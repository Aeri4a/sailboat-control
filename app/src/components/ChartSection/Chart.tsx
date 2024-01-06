import { FC } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";

const capitalizeFirstLetter = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1);

const LINE_COLOR = "#2e5886";

interface ChartProps {
    xAxis: string;
    yAxis: string;
    data: { [key: string]: number }[];
}

const Chart: FC<ChartProps> = ({ xAxis, yAxis, data }) => {
    return (
        <ResponsiveContainer minWidth={450} minHeight={250}>
            {/* fit to FHD */}
            <LineChart data={data}>
                <Line
                    type="basis"
                    dataKey={yAxis}
                    stroke={LINE_COLOR}
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                <CartesianGrid stroke="black" />
                <XAxis dataKey={xAxis}>
                    <Label
                        value={capitalizeFirstLetter(xAxis)}
                        position="insideBottom"
                        offset={-5}
                        fill={LINE_COLOR}
                    />
                </XAxis>
                <YAxis
                    dataKey={yAxis}
                    tickSize={8}
                    scale="linear"
                    // ticks={}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
