import { FC, useEffect, useState } from 'react'
import styles from './App.module.scss'

import BoatSimulation from './components/BoatSimulationView'

const App: FC = () => {
  const [test, setTest] = useState(0); // looping through data (iterator)
  const [start, setStart] = useState(false);

  const data = { time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]};

  
  const handleStartAnimation = () => {
    setStart(true);
  }
  
  const handleStopAnimation = () => {
    setStart(false);
  }
  
  const doAnimation = () => {
    if (test > 9)
      setTest(0);
    else {
      setTest(prevState => prevState + 1);
    }
  };

  useEffect(() => {
    if (start) {
      const id = setInterval(() => {
        doAnimation();
      }, 1000);

      return () => {
        clearInterval(id);
      }
    }
  }, [test, start]);

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
            <button onClick={() => { setTest(0); }}>Reset</button>
          </div>
        </div>
      </div>
      <div className={styles.rightTile}>
        <div className={styles.timeLineTile}>TL</div>
        <div className={styles.animationWrapper}>
          <BoatSimulation pos={data.time[test]} />
        </div>
      </div>
    </div>
  )
}

export default App
