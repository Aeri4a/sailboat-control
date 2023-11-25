import React, { FC } from 'react';

import styles from './Slider.module.scss';

interface SliderProps {
    minValue: number;
    maxValue: number;
    step: number;
    name?: string;
    value: number;
    onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: FC<SliderProps> = ({ minValue, maxValue, step, name, value, onValueChange }) => (
    <div className={styles.wrapper}>
        <input
            name={name}
            className={styles.slider}
            type='range'
            max={maxValue}
            min={minValue}
            step={step}
            value={value}
            onChange={onValueChange}
        />
    </div>
);

export default Slider;