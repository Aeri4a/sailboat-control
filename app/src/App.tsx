import { FC, useEffect, useState } from 'react'
import styles from './App.module.scss'

import { useDispatch, useSelector } from './store';
import { simSelector, simActions } from './store/slices/Simulation';

import BoatSimulation from './components/BoatSimulationView';
import VariableSection from './components/VariableSection';
import VariableBox from './components/VariableBox';
import ButtonBox from './components/ButtonBox';
import Slider from './components/Slider';
import Loader from './components/Loader';
import ChartSection from './components/ChartSection';

import { BoatData, TargetData, WindData, Tab } from './types/commonTypes';

import mapInputData from './utils/simulationInputMaper';
import calcMinTargetValue from './utils/calcMinTargetValue';
import boatVarList from './data/boatVarList';
import windVarList from './data/windVarList';
import { initialBoatData, initialTargetData, initialWindData } from './data/initialData';

const activeTabStyle = { backgroundColor: '#2e5886', color: 'white' };

// CONSTANTS
const FRAME_TIME = 100; // time between physics simulation steps [ms]

const App: FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.VARIABLES);

  const { simulationData, loading: isSimLoading } = useSelector(simSelector);
  const [windInputData, setWindInputData] = useState<WindData>(initialWindData);
  const [boatInputData, setBoatInputData] = useState<BoatData>(initialBoatData);
  const [targetInputData, setTargetInputData] = useState<TargetData>(initialTargetData);

  const [timeStamp, setTimeStamp] = useState(0);
  const [animRun, setAnimRun] = useState(false);

  const data = { time: [...Array(36000).keys()] };

  const getSimulationData = () => {
    const mappedData = mapInputData(
      boatInputData,
      windInputData,
      targetInputData.value
    );

    dispatch(simActions.startSimulation(mappedData))
    .unwrap()
    .then(()=> {
        console.log('good');
        setAnimRun(true);
        setActiveTab(Tab.STATISTICS);
    }).catch(err => {
        console.log('bad: ', err);
    });
  }
  
  const handleStartAnimation = () => {
    if (simulationData === null)
      getSimulationData();
    else
      setAnimRun(true);
  };
  
  const handleStopAnimation = () => {
    setAnimRun(false);
  };

  const handleFetchAgain = () => {
    setTimeStamp(0);
    getSimulationData();
  };

  const handleBoatInputDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoatInputData(prevState => ({ ...prevState, [event.target.name]: +event.target.value }));
  };

  const handleWindInputDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWindInputData(prevState => ({ ...prevState, [event.target.name]: +event.target.value }));
  };

  const handleTargetInputDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetInputData(prevState => ({ ...prevState, value: +event.target.value }));
  };

  useEffect(() => {
    const allParameters = [
      boatInputData.length,
      boatInputData.wtlr,
      boatInputData.hhtlr,
      boatInputData.satlsr,
      boatInputData.katlsr,
      boatInputData.ratsar,
      boatInputData.bmtuhm,
      windInputData.sp
    ];

    const newMinTargetValue = +calcMinTargetValue(allParameters).toFixed(2);
    const insertValue = newMinTargetValue > 3.14 ? 3.14 : newMinTargetValue;
    setTargetInputData(prevState => ({
      ...prevState,
      minValue: insertValue,
      value: +((prevState.maxValue + insertValue)/2).toFixed(2)
    }));
  }, [boatInputData, windInputData]);


  useEffect(() => {
    console.log(simulationData);
  }, [simulationData]);

  return (
    <div className={styles.appContainer}>
      {isSimLoading && <Loader/>}
      <div className={styles.leftTile}>
        <div className={styles.header}>
          <div className={styles.sectionSelect}>
            <div 
              className={styles.section}
              style={activeTab === Tab.VARIABLES ? activeTabStyle : {}}
              onClick={() => setActiveTab(Tab.VARIABLES)}
            >
              Variables
            </div>
            <div
              className={styles.section}
              style={activeTab === Tab.STATISTICS ? activeTabStyle : {}}
              onClick={() => setActiveTab(Tab.STATISTICS)}
            >
              Statistics
            </div>
          </div>
          <div className={styles.title}>
            Sailboat
          </div>
        </div>
        {activeTab === Tab.VARIABLES
          ? (<div className={styles.actionPanel}>
              <VariableSection subTitle='Boat'>
                {boatVarList.map(variable => (
                  <VariableBox
                    key={variable.defaultValue}
                    name={variable.shortName}
                    value={boatInputData[variable.shortName as keyof BoatData]}
                    onValueChange={handleBoatInputDataChange}
                    maxValue={variable.max}
                    minValue={variable.min}
                    step={variable.step}
                    description={variable.name}
                    unit={variable.unit}
                  />
                ))}
              </VariableSection>

              <VariableSection subTitle='Wind'>
                {windVarList.map(variable => (
                  <VariableBox
                    key={variable.defaultValue}
                    name={variable.shortName}
                    value={windInputData[variable.shortName as keyof WindData]}
                    onValueChange={handleWindInputDataChange}
                    maxValue={variable.max}
                    minValue={variable.min}
                    step={variable.step}
                    description={variable.name}
                    unit={variable.unit}
                  />
                ))}
              </VariableSection>

              <VariableSection subTitle='Target'>
                  <VariableBox
                    name='Destination'
                    value={targetInputData.value}
                    onValueChange={handleTargetInputDataChange}
                    maxValue={targetInputData.maxValue}
                    minValue={targetInputData.minValue}
                    step={targetInputData.step}
                    description='Destination'
                    unit=''
                  />
              </VariableSection>
              </div>)
        : (<ChartSection/>)
        }
        
      </div>
      <div className={styles.rightTile}>
        <div className={styles.timeLineTile}>
            <div className={styles.timeLineWrapper}>
              <ButtonBox
                startState={animRun}
                startAction={handleStartAnimation}
                pauseAction={handleStopAnimation}
                restartAction={() => { setTimeStamp(0); }}
                fetchAgainAction={handleFetchAgain}
              />
              <Slider
                value={timeStamp}
                onValueChange={(event) => {setTimeStamp(+event.target.value);}}
                minValue={0}
                maxValue={36000}
                step={1}
              />
            </div>
        </div>
        <div className={styles.animationWrapper}>
          <BoatSimulation
            set_time={setTimeStamp}
            anim_running={animRun}
            frame_len={FRAME_TIME}
            time={data.time[timeStamp]}
            boatData={boatInputData}
            simulationData={simulationData}
          />
        </div>
      </div>
    </div>
  )
}

export default App;
