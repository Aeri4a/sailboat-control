import { FC } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Charts: FC = () => {

    const testData = [
        {name: 1, uv: 400},
        {name: 2, uv: 500},
        {name: 3, uv: 600},
        {name: 4, uv: 700},
    ]

    return (
        <div>
            <LineChart
                width={400}
                height={300}
                data={testData}
            >
                <Line
                    type='monotone'
                    dataKey='uv'
                    stroke='blue'
                />
                <Tooltip/>
                <Legend/>
                <CartesianGrid stroke='white'/>
                <XAxis dataKey='name' />
                <YAxis />
            </LineChart>
        </div>
    );
}

export default Charts;
