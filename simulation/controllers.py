import math

    
def sigmoid(x, a, b):
    return a*((math.exp(b*x)-1)/(math.exp(b*x)+1))


class PID:
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

    def control(self, target, actual):
        error = actual - target
        if error > math.pi:
            error -= 2*math.pi
        elif error < -math.pi:
            error += 2*math.pi

        output = self.p*error + self.i*self.integral + self.d*(error-self.last)

        self.last = error
        self.integral += error * self.dt

        return output

class PDD:
    p_coef = 0.01
    d_coef = 0.1
    dd_coef = 1
    dt = 0.1

    prev_error = 0
    prev_d_val = 0

    def __init__(self, p, d, dd, dt):
        self.p_coef = p
        self.d_coef = d
        self.dd_coef = dd
        self.dt = dt

    def control(self, target, actual):
        error = actual - target
        if error > math.pi:
            error -= 2*math.pi
        elif error < -math.pi:
            error += 2*math.pi

        # error = sigmoid(error,0.2,1)

        d_val = error - self.prev_error
        dd_val = d_val - self.prev_d_val

        output = self.p_coef*error + self.d_coef*d_val*self.dt + self.dd_coef * dd_val * self.dt**2

        self.prev_error = error
        self.prev_d_val = d_val

        return output



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

        target_position = sigmoid(self.p*error + self.i*self.integral/self.dt + self.d*(error-self.last)*self.dt,math.pi/4,1)

        self.last = error
        self.integral += error * self.dt

        return max(min((target_position-position)*self.dt,math.pi/12),-math.pi/12)
    