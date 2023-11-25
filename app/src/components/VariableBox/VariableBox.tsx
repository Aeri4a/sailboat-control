import React, { FC } from 'react';

import styles from './VariableBox.module.scss';

import Slider from '../Slider';

interface VariableBoxProps {
    minValue: number;
    maxValue: number;
    step: number;
    name: string;
    value: number;
    onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    description: string;
    unit: string;
}

const VariableBox: FC<VariableBoxProps> = ({
    minValue, maxValue, step, name, value, onValueChange, description, unit
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.actionBox}>
                <Slider
                    name={name}
                    value={value}
                    onValueChange={onValueChange}
                    minValue={minValue}
                    maxValue={maxValue}
                    step={step}
                />
                <div className={styles.description}>
                    {description}
                </div>
            </div>
            <div className={styles.valueBox}>
                {`${value} [${unit}]`}
            </div>
        </div>
    );
};

export default VariableBox;