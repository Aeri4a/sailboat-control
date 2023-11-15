import { FC, useState } from 'react'
import styles from './App.module.scss'

import BoatSimulation from './components/BoatSimulationView'

const App: FC = () => {

  const data = { time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]};

  const startAnimation = () => {

  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.leftTile}>
      <button onClick={startAnimation}>Start animation</button>
      </div>
      <div className={styles.rightTile}>
        <div className={styles.timeLineTile}></div>
        <BoatSimulation />
      </div>
    </div>
  )
}

export default App
