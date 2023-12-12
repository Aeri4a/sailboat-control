import math
import numpy as np
import matplotlib.pyplot as plt

from vector_math import *
from controllers import *

import json


# Constants
WATER_DENSITY = 1000
AIR_DENSITY = 1.2
BOAT_DENSITY = 50
GRAVITY = 9.81
DT = 0.1
ALMOST_ZERO = 10**(-15)



# The boat class

class Boat:
    length = 8.0
    width = 2.25
    height = 0.8
    sail_area = 30.0
    sail_height = 6.7
    boom_height = 0.67
    keel_area = 1.44
    keel_length = 1.2
    keel_depth = 1.2
    rudder_area = 0.4
    rudder_depth = 0.9
    ballast_mass = 600.0
    hull_depth = 0.0733
    hull_mass = 786.0
    mass = 1386.0
    roll_inertia = 1472.1
    yaw_inertia = 7392.0

    position = np.array([0.0, 0.0])
    velocity = np.array([0.0, 0.0])
    yaw = -math.pi / 2
    yaw_speed = 0.0
    roll = 0.0
    roll_speed = 0.0
    rudder_position = 0.0
    sail_position = math.pi / 4

    def __init__(self, input_data):
        self.length = input_data["length"]
        self.width = input_data["width_to_length"] * self.length
        self.height = input_data["hull_height_to_length"] * self.length
        self.sail_area = input_data["sail_area_to_length_squared"] * self.length ** 2
        self.sail_height = 3 * (self.sail_area / 6) ** 0.5
        self.boom_height = 0.1*self.sail_height
        self.keel_area = input_data["keel_to_sail_area"] * self.sail_area
        self.keel_length = self.keel_area ** 0.5
        self.keel_depth = self.keel_area ** 0.5
        self.rudder_area = input_data["rudder_to_sail_area"] * self.sail_area
        self.rudder_depth = 2* self.rudder_area ** 0.5
        self.ballast_mass = input_data["ballast_to_upper_hull_mass"] * self.length * self.width * self.height * BOAT_DENSITY
        self.hull_depth = (self.height * BOAT_DENSITY + self.ballast_mass / (self.length * self.width)) / WATER_DENSITY
        self.hull_mass = self.length * self.width * (self.height + self.hull_depth) * BOAT_DENSITY
        self.mass = self.hull_mass + self.ballast_mass
        self.roll_inertia = self.hull_mass * ((self.width ** 2 + self.height**2) / 12 + self.height ** 2 / 4)\
        + self.ballast_mass * (self.hull_depth + self.keel_depth)**2
        self.yaw_inertia = self.mass * self.length ** 2 / 12
     
    def get_hull_wind(self,wind):
        return np.matmul(wind - self.velocity, rotation_matrix(-self.yaw))
    
     
    def get_sail_wind(self,wind):
        return np.matmul(self.get_hull_wind(wind)-np.array([0,(1.3*self.sail_height+3*self.height)*self.roll_speed/3]),rotation_matrix(-self.sail_position))

     
    def get_hull_flow(self):
        return np.matmul(-self.velocity, rotation_matrix(-self.yaw))
    
     
    def get_keel_flow(self):
        return self.get_hull_flow()+np.array([0,self.roll_speed*(self.keel_depth+self.rudder_depth)/2])

     
    def get_rudder_flow(self):
        return np.matmul(self.get_hull_flow()+np.array([0,self.roll_speed*(self.keel_depth+self.rudder_depth)/2\
            +self.yaw_speed*self.length/2]), rotation_matrix(-self.rudder_position))

     
    def lift_function(self,angle):
        angle = abs(angle%math.pi)
        return (angle*(angle-math.pi)/(angle-25*math.pi/24))**5/25

     
    def wave_drag_function(self,froude):
        froude += 10**(-15)
        return 2*10**4*math.exp(-1/froude**2-12*froude)

     
    def get_lift_force(self, wind):
        sail_wind = self.get_sail_wind(wind)
        wind_magnitude = np.linalg.norm(sail_wind)
        wind_angle = math.acos(sail_wind[0]/wind_magnitude)
        lift_coefficient = self.lift_function(wind_angle)
        exposed_sail = abs(self.sail_area * math.sin(wind_angle) * math.cos(self.roll))
        lift_force_magnitude = 0.5 * AIR_DENSITY * wind_magnitude ** 2 * lift_coefficient * exposed_sail
        lift_force_angle = (self.sail_position + self.yaw + (math.pi/2 if sail_wind[1] > 0.0 else -math.pi/2))
        return np.matmul((np.array([1,0]) * lift_force_magnitude), rotation_matrix(lift_force_angle))
    
     
    def get_sail_drag(self, wind):  # angle decreases - fix
        sail_wind = self.get_sail_wind(wind)
        wind_magnitude = np.linalg.norm(sail_wind)
        exposed_sail = abs(sail_wind[1]) * math.cos(self.roll)
        drag_force_magnitude = AIR_DENSITY * wind_magnitude**2 * exposed_sail
        drag_force_direction = (wind-self.velocity)/np.linalg.norm(wind-self.velocity)
        return drag_force_magnitude * drag_force_direction
    
     
    def get_upper_hull_drag(self, wind):
        relative_wind = self.get_hull_wind(wind)
        x_drag = 0.5 * 0.05 * AIR_DENSITY * relative_wind[0] * abs(relative_wind[0]) * self.height * self.width
        y_drag = 0.5 * AIR_DENSITY * relative_wind[1] * abs(relative_wind[1]) * self.height * self.length
        drag = np.array([x_drag, y_drag])
        drag = np.matmul(drag, rotation_matrix(self.yaw))
        return drag
    
     
    def get_lower_hull_drag(self):
        flow = self.get_hull_flow()
        x_drag = 0.5 * WATER_DENSITY * flow[0] * abs(flow[0]) * self.hull_depth * self.width\
            * 0.05 * (1 + self.wave_drag_function(abs(flow[0])/self.length))
        y_drag = 0.5 * WATER_DENSITY * flow[1] * abs(flow[1]) * self.hull_depth * self.length\
            * (1 + self.wave_drag_function(abs(flow[1])/self.length))
        drag = np.array([x_drag, y_drag])
        drag = np.matmul(drag, rotation_matrix(self.yaw))
        return drag
    
     
    def get_keel_drag(self):
        flow = self.get_keel_flow()
        drag_magnitude = WATER_DENSITY * flow[1] * abs(flow[1]) * self.keel_area * math.cos(self.roll)
        drag = np.array([0, drag_magnitude])
        drag = np.matmul(drag, rotation_matrix(self.yaw))
        return drag
    
     
    def get_rudder_drag(self):
        flow = self.get_rudder_flow()
        drag_magnitude = WATER_DENSITY * flow[1] * abs(flow[1]) * self.rudder_area * math.cos(self.roll)
        drag = np.array([0, drag_magnitude])
        drag = np.matmul(drag, rotation_matrix(self.yaw+self.rudder_position))
        return drag
    
     
    def get_linear_acceleration(self, lift, sail_drag, upper_hull_drag, lower_hull_drag, keel_drag, rudder_drag):
        return (lift+sail_drag+upper_hull_drag+lower_hull_drag+keel_drag+rudder_drag)/self.mass
    
     
    def get_roll_acceleration(self, lift, sail_drag, keel_drag, rudder_drag):
        vec_torque = (self.sail_height+3*self.boom_height+3*self.height)/3*(lift+sail_drag)
        vec_torque -= ((2*self.hull_depth+self.keel_depth)*keel_drag)/2
        vec_torque -= ((2*self.hull_depth+self.rudder_depth)*rudder_drag)/2
        torque = np.matmul(vec_torque,rotation_matrix(-self.yaw))[1]
        torque -= self.ballast_mass*GRAVITY*(self.hull_depth+self.keel_depth)*math.sin(self.roll)
        return torque / self.roll_inertia
    
     
    def get_yaw_acceleration(self, rudder_drag):
        torque = -np.matmul(rudder_drag,rotation_matrix(-self.yaw))[1] * self.length / 2
        torque -= self.yaw_speed ** 2 * self.keel_length * self.keel_area * math.cos(self.roll) * WATER_DENSITY / 4
        torque -= self.yaw_speed ** 2 * self.length**2 * self.hull_depth * WATER_DENSITY / 4
        return torque/self.yaw_inertia

    def update_physics(self, wind):
        lift = self.get_lift_force(wind)
        sail_drag = self.get_sail_drag(wind)
        upper_hull_drag = self.get_upper_hull_drag(wind)
        lower_hull_drag = self.get_lower_hull_drag()
        keel_drag = self.get_keel_drag()
        rudder_drag = self.get_rudder_drag()

        self.velocity += self.get_linear_acceleration(lift,sail_drag,upper_hull_drag,lower_hull_drag,keel_drag,rudder_drag) * DT
        self.position += self.velocity * DT
        self.roll_speed += self.get_roll_acceleration(lift,sail_drag,keel_drag,rudder_drag) * DT
        self.roll += self.roll_speed * DT
        self.yaw_speed += self.get_yaw_acceleration(rudder_drag) * DT
        self.yaw += self.yaw_speed * DT
        if self.yaw > math.pi:
            self.yaw -= 2*math.pi
        elif self.yaw < -math.pi:
            self.yaw += 2*math.pi


        if self.roll > math.pi/2 or self.roll < -math.pi/2:
            return True
        return False
