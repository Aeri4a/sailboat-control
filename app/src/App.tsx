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

import { BoatData, WindData } from './types/commonTypes';

import mapInputData from './utils/simulationInputMaper';
import boatVarList from './data/boatVarList';
import windVarList from './data/windVarList';
import { initialBoatData, initialWindData } from './data/initialData';

// CONSTANTS
const FRAME_TIME = 100; // time between physics simulation steps [ms]

const App: FC = () => {
  const dispatch = useDispatch();
  const { simulationData, loading: isSimLoading } = useSelector(simSelector);
  const [windInputData, setWindInputData] = useState<WindData>(initialWindData);
  const [boatInputData, setBoatInputData] = useState<BoatData>(initialBoatData);

  const [timeStamp, setTimeStamp] = useState(0);
  const [animRun, setAnimRun] = useState(false);

  const data = { time: [...Array(36000).keys()] };

  const getSimulationData = () => {
    const mappedData = mapInputData(boatInputData, windInputData);

    dispatch(simActions.startSimulation(mappedData))
    .unwrap()
    .then(()=> {
        console.log('good');
        setAnimRun(true);
    }).catch(err => {
        console.log('bad: ', err);
    })
  }
  
  const handleStartAnimation = () => {
    getSimulationData(); //
    // setAnimRun(true);
  };
  
  const handleStopAnimation = () => {
    setAnimRun(false);
  };

  const handleBoatInputDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoatInputData(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
  };

  const handleWindInputDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWindInputData(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
  };

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
              style={{ backgroundColor: '#1394ab', color: 'white' }} // change to 'active' class
            >
              Variables
            </div>
            <div
              className={styles.section}
              // style={{ backgroundColor: '#1394ab', color: 'white' }}
            >
              Statistics
            </div>
          </div>
          <div className={styles.title}>
            Sailboat
          </div>
        </div>
        <div className={styles.actionPanel}> {/*switch here between vars-stats*/}
          <VariableSection subTitle='Boat'>
            {boatVarList.map(variable => (
              <VariableBox
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

        </div>
      </div>
      <div className={styles.rightTile}>
        <div className={styles.timeLineTile}>
            <div className={styles.timeLineWrapper}>
              <ButtonBox
                startState={animRun}
                startAction={handleStartAnimation}
                pauseAction={handleStopAnimation}
                restartAction={() => { setTimeStamp(0); }}
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
