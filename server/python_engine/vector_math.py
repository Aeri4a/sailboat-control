import math
import numpy as np

# Math

def rotation_matrix(angle):
    return np.array([[math.cos(angle), math.sin(angle)], [-math.sin(angle), math.cos(angle)]])

def arg(vector):
    return math.acos(vector[0]/np.linalg.norm(vector))*vector[1]/abs(vector[1])
