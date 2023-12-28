import json
import math
import numpy as np

from boat import *

DT = 0.1

input_file = open("input.json")
input_data = json.load(input_file)
input_file.close()

boat = Boat(input_data)

# Wind variable
wind_speed = input_data["windSpeed"]
# Target variable
target_direction = input_data["targetDirection"]



# Loop variables
x = []
y = []
vx = []
vy = []
t = []
roll = []
yaw = []
rudder_position = []
sail_position = []

rudder_pid = PositionPID(3,0.001,0,DT)
sail_control = SailController(boat.sail_position, DT)

wind = np.array([-wind_speed,0])
for i in range(int(3600/DT)):
    if boat.update_physics(wind):
        break

    # boat.rudder_position += rudder_pid.control(target_direction,boat.yaw,boat.rudder_position)
    boat.rudder_position += rudder_pid.control(target_direction,arg(boat.velocity),boat.rudder_position)
    boat.rudder_position = max(-math.pi/4,boat.rudder_position)
    boat.rudder_position = min(math.pi/4,boat.rudder_position)
    boat.sail_position += sail_control.control(np.linalg.norm(boat.velocity),boat.sail_position)
    boat.sail_position = max(-5*math.pi/12,boat.sail_position)
    boat.sail_position = min(5*math.pi/12,boat.sail_position)

    t.append(i)
    x.append(boat.position[1])
    y.append(boat.position[0])
    vx.append(boat.velocity[1])
    vy.append(boat.velocity[0])
    yaw.append(boat.yaw)
    roll.append(boat.roll)
    rudder_position.append(boat.rudder_position)
    sail_position.append(boat.sail_position)



output_dict = {
    "positionX": x,
    "positionY": y,
    "velocityX": vx,
    "velocityY": vy,
    "yaw": yaw,
    "roll": roll,
    "rudderPosition":rudder_position,
    "sailPosition":sail_position,
}
output_data = json.dumps(output_dict)
output_file = open("output.json","w")
output_file.write(output_data)
output_file.close()

print(boat.position[0])
