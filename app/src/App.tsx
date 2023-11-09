import { FC, useState } from 'react'
import styles from './App.module.scss'

import BoatSimulation from './components/BoatSimulation'

const App: FC = () => {

  return (
    <div className={styles.appContainer}>
      <div className={styles.leftTile}></div>
      <div className={styles.rightTile}>
        <div className={styles.timeLineTile}></div>
        <BoatSimulation/>
      </div>
    </div>
  )
}

export default App
