import { FC, useState, useEffect } from "react";

import { useSelector } from '../../store';
import { simSelector } from '../../store/slices/Simulation';

import styles from "./Chart.module.scss";
import Chart from "./Chart";


interface ChartArrayValues {
    [key: string]: number;
    time: number;
}

interface CommonChartDataSet {
    xAxis: string;
    yAxis: string;
    values: ChartArrayValues[];
}

const ChartSection: FC = () => {
    const { simulationData: data } = useSelector(simSelector);
    const isDataEmpty = data === null;
    const [posXData, setPosXData] = useState<CommonChartDataSet>({
        xAxis: "time",
        yAxis: "positionX",
        values: []
    });
    const [posYData, setPosYData] = useState<CommonChartDataSet>({
        xAxis: "time",
        yAxis: "positionY",
        values: []
    });
    const [veloXData, setVeloXData] = useState<CommonChartDataSet>({
        xAxis: "time",
        yAxis: "velocityX",
        values: []
    });
    const [veloYData, setVeloYData] = useState<CommonChartDataSet>({
        xAxis: "time",
        yAxis: "velocityY",
        values: []
    });
    const [rudPosData, setRudPosData] = useState<CommonChartDataSet>({
       xAxis: "time" ,
       yAxis: "rudderPosition",
       values: []
    });
    const [sailPos, setSailPos] = useState<CommonChartDataSet>({
        xAxis: "time",
        yAxis: "sailPosition",
        values: []
    });
    const [yawData, setYawData] = useState<CommonChartDataSet>({
        xAxis: "time",
        yAxis: "yaw",
        values: []
    });
    const [rollData, setRollData] = useState<CommonChartDataSet>({
       xAxis: "time",
       yAxis: "roll",
       values: []
    });

    useEffect(() => {
        if (isDataEmpty) return;
        const posX: ChartArrayValues[] = [];
        const posY: ChartArrayValues[] = [];
        const veloX: ChartArrayValues[] = [];
        const veloY: ChartArrayValues[] = [];
        const rudPos: ChartArrayValues[] = [];
        const sailPos: ChartArrayValues[] = [];
        const yaw: ChartArrayValues[] = [];
        const roll: ChartArrayValues[] = [];
        for (let i = 0; i < data?.positionX.length; i += 1200) {
            posX.push({
                positionX: +data?.positionX[i].toFixed(0),
                time: i
            });
            posY.push({
                positionY: +data?.positionY[i].toFixed(0),
                time: i
            });
            veloX.push({
                velocityX: +data?.velocityX[i].toFixed(0),
                time: i
            });
            veloY.push({
                velocityY: +data?.velocityY[i].toFixed(0),
                time: i
            });
            rudPos.push({
                rudderPosition: +data?.rudderPosition[i].toFixed(0),
                time: i
            });
            sailPos.push({
                sailPosition: +data?.sailPosition[i].toFixed(0),
                time: i
            });
            yaw.push({
                yaw: +data?.yaw[i].toFixed(0),
                time: i
            });
            roll.push({
                roll: +data?.roll[i].toFixed(0),
                time: i
            });
        }
        setPosXData(prevState => ({ ...prevState, values: posX }));
        setPosYData(prevState => ({ ...prevState, values: posY }));
        setVeloXData(prevState => ({ ...prevState, values: veloX }));
        setVeloYData(prevState => ({ ...prevState, values: veloY }));
        setRudPosData(prevState => ({ ...prevState, values: rudPos }));
        setSailPos(prevState => ({ ...prevState, values: sailPos }));
        setYawData(prevState => ({ ...prevState, values: yaw }));
        setRollData(prevState => ({ ...prevState, values: roll }));
    }, [data]);

    return (
        <>
            {isDataEmpty ? (
                <div className={styles.noDataInfo}>No data available</div>
            ) : (
                <div className={styles.container}>
                    {/* Position X */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={posXData.xAxis}
                            yAxis={posXData.yAxis}
                            data={posXData.values}
                        />
                    </div>
                    {/* Position Y */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={posYData.xAxis}
                            yAxis={posYData.yAxis}
                            data={posYData.values}
                        />
                    </div>
                    {/* Velocity X */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={veloXData.xAxis}
                            yAxis={veloXData.yAxis}
                            data={veloXData.values}
                        />
                    </div>
                    {/* Velocity Y */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={veloYData.xAxis}
                            yAxis={veloYData.yAxis}
                            data={veloYData.values}
                        />
                    </div>
                    {/* Rudder position */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={rudPosData.xAxis}
                            yAxis={rudPosData.yAxis}
                            data={rudPosData.values}
                        />
                    </div>
                    {/* Sail position */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={sailPos.xAxis}
                            yAxis={sailPos.yAxis}
                            data={sailPos.values}
                        />
                    </div>
                    
                    {/* Yaw */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={yawData.xAxis}
                            yAxis={yawData.yAxis}
                            data={yawData.values}
                        />
                    </div>
                    {/* Roll */}
                    <div className={styles.chartBackground}>
                        <Chart
                            xAxis={rollData.xAxis}
                            yAxis={rollData.yAxis}
                            data={rollData.values}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ChartSection;
