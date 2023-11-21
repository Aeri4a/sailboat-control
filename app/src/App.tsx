import { FC, useState } from 'react'
import styles from './App.module.scss'

import BoatSimulation from './components/BoatSimulationView'

const App: FC = () => {
  const [timeStamp, settimeStamp] = useState(0);
  const [animRunning, setRunning] = useState(false);

  const FRAME_TIME = 100; // time between physics simulation steps [ms]

  // const data = { time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]};
  const data = {time: [...Array(36000).keys()]};
  
  const handleStartAnimation = () => {
    setRunning(true);
  }
  
  const handleStopAnimation = () => {
    setRunning(false);
  }

  return (
    <div className={styles.appContainer}>
      <div className={styles.leftTile}>
        <div className={styles.header}>
          Simulation settings
        </div>
        <div className={styles.actionPanel}>
          <div className={styles.variables}>
            <button onClick={handleStartAnimation}>Start</button>
            <button onClick={handleStopAnimation}>Stop</button>
            <button onClick={() => { settimeStamp(0); }}>Reset</button>
          </div>
        </div>
      </div>
      <div className={styles.rightTile}>
        <div className={styles.timeLineTile}>TL</div>
        <div className={styles.animationWrapper}>
          <BoatSimulation set_time={settimeStamp} anim_running={animRunning} frame_len={FRAME_TIME} time={data.time[timeStamp]} />
        </div>
      </div>
    </div>
  )
}

export default App
