import json
import math
# import numpy as np
# import matplotlib.pyplot as plt

from boat import *
from wind import *

input_file = open("input_1.json")
input_data = json.load(input_file)


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

# TESTER
# boat.tester()
boat.dir_test()

# for i in range(360):
#     print(arg(np.matmul(np.array([1,0]),rotation_matrix(i/180*math.pi)))*180/math.pi)

# Loop variables
step = 0
time = 0
# MAIN LOOP
# while not is_target_reached:
#     step += 1
#     time += DT
#     wind_speed = get_wind(time, wind_speed_freqs, wind_speed_phases, wind_speed_mean, wind_direction_sd_multiplier)
#     wind_direction = get_wind(time, wind_direction_freqs, wind_direction_phases, 0, wind_direction_sd_multiplier)
#     wind = np.array([-wind_speed*math.cos(wind_direction), -wind_speed*math.sin(wind_direction)])
