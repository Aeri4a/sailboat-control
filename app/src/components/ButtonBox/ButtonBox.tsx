import React, { FC } from 'react';

import styles from './ButtonBox.module.scss';

import PlayIcon from '../../assets/play.svg';
import PauseIcon from '../../assets/pause.svg';
import RestartIcon from '../../assets/restart.svg';
import FetchAgainIcon from '../../assets/fetchAgain.svg';

interface ButtonBoxProps {
    startState: boolean;
    startAction: () => void;
    pauseAction: () => void;
    restartAction: () => void;
    fetchAgainAction: () => void;
}

const ButtonBox: FC<ButtonBoxProps> = ({
    startState, startAction, pauseAction, restartAction, fetchAgainAction
}) => (
    <div className={styles.container}>
        <div className={styles.button} onClick={fetchAgainAction}>
            <img className={styles.image} src={FetchAgainIcon} alt='FetchAgain'/>
        </div>
        <div className={styles.button} onClick={restartAction}>
            <img className={styles.image} src={RestartIcon} alt='Restart'/>
        </div>
        <div
            className={styles.button}
            onClick={startState ? pauseAction : startAction}
        >
            <img
                className={styles.image}
                src={
                    startState
                        ? PauseIcon
                        : PlayIcon
                }
                alt='Action'
            />
        </div>
    </div>
);

export default ButtonBox;
