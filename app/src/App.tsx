import { FC, useState } from 'react'
import styles from './App.module.scss'

import BoatSimulation from './components/BoatSimulationView';
import VariableSection from './components/VariableSection';
import VariableBox from './components/VariableBox';
import ButtonBox from './components/ButtonBox';

import { BoatData, WindData } from './types/commonTypes';

import boatVarList from './data/boatVarList';
import windVarList from './data/windVarList';
import { initialBoatData, initialWindData } from './data/initialData';
import Slider from './components/Slider';

// CONSTANTS
const FRAME_TIME = 100; // time between physics simulation steps [ms]

const App: FC = () => {
  const [boatData, setBoatData] = useState<BoatData>(initialBoatData);
  const [windData, setWindData] = useState<WindData>(initialWindData);

  const [timeStamp, setTimeStamp] = useState(0);
  const [animRun, setAnimRun] = useState(false);

  const data = { time: [...Array(36000).keys()] };
  
  const handleStartAnimation = () => {
    setAnimRun(true);
  };
  
  const handleStopAnimation = () => {
    setAnimRun(false);
  };

  const handleBoatDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBoatData(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
  };

  const handleWindDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWindData(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
  };

  return (
    <div className={styles.appContainer}>
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
                value={boatData[variable.shortName as keyof BoatData]}
                onValueChange={handleBoatDataChange}
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
                value={windData[variable.shortName as keyof WindData]}
                onValueChange={handleWindDataChange}
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
            boatData={boatData}
          />
        </div>
      </div>
    </div>
  )
}

export default App;
