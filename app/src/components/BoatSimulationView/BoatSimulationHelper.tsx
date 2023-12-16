const interpolate = (time : number, frame_dt: number, data: number[] | undefined) => {
    if (!data)
        return 0;
    const p1 = data![time] || 0;
    if (time+1 >= data.length)
        return p1;
    const p2 = data![time+1]!;
    return p1 + frame_dt * (p2 - p1);
}

export default interpolate;