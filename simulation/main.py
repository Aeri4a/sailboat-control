import json
import math
import numpy as np
import matplotlib.pyplot as plt

from boat import *
from wind import *
from vector_math import *

DT = 0.1

input_file = open("input_1.json")
input_data = json.load(input_file)
input_file.close()


boat = Boat(input_data)

# Wind variables
wind_speed_mean = input_data["wind_speed_mean"]
wind_speed_sd_multiplier = input_data["wind_speed_sd"] * (2 / SINES) ** 0.5
wind_direction_sd_multiplier = input_data["wind_direction_sd"] * (2 / SINES) ** 0.5 / 180 * math.pi
wind_speed_freqs, wind_speed_phases = generate_sines_array()
wind_direction_freqs, wind_direction_phases = generate_sines_array()

# Target variables
target_x = input_data["target_x"]
target_y = input_data["target_y"]
is_target_reached = False              # If true then end programm







# Loop variables
# step = 0
# time = 0

x = []
y = []
vx = []
vy = []
z = []
t = []
roll = []
yaw = []
wx= []
wy = []
# z = [(0.001*i,0,1-0.001*i) for i in range(1000)]
rudder_position = []
speed = []
sail_position = []
tmax = 0

# rudder_pid = PID(0.01,0,10,DT)
# 3 0.001 0 works
rudder_pid = PositionPID(3,0.001,0,DT)
# sail_control = SailController(0.001, 100, 100, boat.sail_position, DT)
# targets = [np.array([500,-500]),np.array([1000,0]),np.array([500,500]),np.array([0,0])]

# wind = np.array([-5.0,0])
for i in range(2000):
    wind = np.matmul(np.array([get_wind(i*DT, wind_speed_freqs, wind_speed_freqs, wind_speed_mean, wind_speed_sd_multiplier),0]),rotation_matrix(get_wind(i*DT, wind_direction_freqs,wind_direction_phases,math.pi,wind_direction_sd_multiplier)))
    # print(i)
    if boat.update_physics(wind):
        break
    tmax += 1



    # boat.rudder_position += rudder_pid.control(-math.pi/2,boat.yaw,boat.rudder_position)
    boat.rudder_position += rudder_pid.control(-0.5*math.pi,arg(boat.velocity),boat.rudder_position)
    boat.rudder_position = max(-math.pi/4,boat.rudder_position)
    boat.rudder_position = min(math.pi/4,boat.rudder_position)
    # boat.sail_position += sail_control.control(np.linalg.norm(boat.velocity),boat.sail_position)



    t.append(i)
    x.append(boat.position[1])
    y.append(boat.position[0])
    roll.append(boat.roll)
    rudder_position.append(boat.rudder_position)
    sail_position.append(boat.sail_position)
    speed.append(np.linalg.norm(boat.velocity))
    yaw.append(boat.yaw)

    vx.append(boat.velocity[1])
    vy.append(boat.velocity[0])
    wx.append(wind[1])
    wy.append(wind[0])


start = 0
# start = tmax-100
z=[(i/(tmax-start),0,1-i/(tmax-start)) for i in range(tmax-start)]
fig, axs = plt.subplots(2,3)
axs[0,0].scatter(x[start:],y[start:],c=z)
axs[0,0].set_title("position")
axs[0,1].scatter(t[start:],roll[start:],c=z)
axs[0,1].set_title("roll")
axs[0,2].scatter(t[start:],yaw[start:],c=z)
axs[0,2].set_title("yaw")

axs[1,0].scatter(t[start:],rudder_position[start:],c=z)
axs[1,0].set_title("rudder position")
axs[1,1].scatter(t[start:],speed[start:],c=z)
axs[1,1].set_title("speed")
axs[1,2].scatter(t[start:],sail_position[start:],c=z)
axs[1,2].set_title("sail position")


output_dict = {
    "positionX": x,
    "positionY": y,
    "velocityX": vx,
    "velocityY": vy,
    "yaw": yaw,
    "roll": roll,
    "rudderPosition":rudder_position,
    "sailPosition":sail_position,
    "windX":wx,
    "windY":wy
}
output_data = json.dumps(output_dict)
output_file = open("output.json","w")
output_file.write(output_data)
output_file.close()

plt.show()
