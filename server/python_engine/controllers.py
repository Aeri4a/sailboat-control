import math


def sigmoid(x):
    return 2/(1+math.e**(-x))-1 if x >= 0 else 1-2/(1+math.e**x)


class PositionPID:
    p = 0.01
    i = 0.0
    d = 10

    last = 0
    integral = 0
    dt = 0.1

    def __init__(self, p, i, d, dt):
        self.p = p
        self.i = i
        self.d = d
        self.dt = dt

    def control(self, target, actual, position):
        error = actual - target
        if error > math.pi:
            error -= 2*math.pi
        elif error < -math.pi:
            error += 2*math.pi

        target_position = math.pi/4*sigmoid(self.p*error + self.i*self.integral/self.dt + self.d*(error-self.last)*self.dt)

        self.last = error
        self.integral += error * self.dt

        return max(min((target_position-position)*self.dt,math.pi/12),-math.pi/12)
    

class SailController:
    sail_target = 0
    dt = 0.1

    C = 5.0
    P = 5.0

    time = 0
    cumulative_limit = 0.995
    weight = 0
    gain_constant = 1
    speed_mean = 0

    def __init__(self, init_sail, dt):
        self.dt = dt
        self.sail_target = init_sail
        self.gain_constant *= dt
    
    def control(self, speed_now, sail_now):
        self.time += self.dt
        self.speed_mean = self.weight*self.speed_mean + (1-self.weight)*speed_now
        self.weight += self.gain_constant*(self.cumulative_limit-self.weight)*self.dt

        self.sail_target += self.C * (speed_now - self.speed_mean) * sigmoid(sail_now - self.sail_target) * self.dt
        self.sail_target = max(-5*math.pi/12,min(5*math.pi/12,self.sail_target))
        sail_semitarget = self.sail_target + 0.01*math.sin(self.time/200)
        sail_update = self.P * (sail_semitarget-sail_now) * self.dt
        return max(min(sail_update*self.dt,math.pi/12),-math.pi/12)
