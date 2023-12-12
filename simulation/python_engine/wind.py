import random
import math

# Wind generator
SINES = 16              # number of sine functions used in wind generation
DECAY = 1.15             # decrease in sine frequency for each sine for wind generation
STARTING_COEF = 0.25    # maximum frequency of wind sine
def generate_sines_array():
    freqs = []
    phases = []
    coef = STARTING_COEF
    for _ in range(SINES):
        freqs.append(coef*random.random())
        phases.append(2*math.pi/freqs[-1]*random.random())
        coef /= 1.1
    return freqs, phases

def get_wind(t, freqs, phases, mean, sd_multiplier):
    result = 0
    for i in range(SINES):
        result += math.sin(t*freqs[i]+phases[i])
    result *= sd_multiplier
    result += mean
    return result