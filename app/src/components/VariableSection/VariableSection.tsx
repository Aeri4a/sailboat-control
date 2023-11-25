import React, { FC } from 'react';

import styles from './VariableSection.module.scss';

interface VariableSectionProps {
    subTitle: string;
    children?: React.ReactNode;
}

const VariableSection: FC<VariableSectionProps> = ({ children, subTitle }) => (
    <div className={styles.container}>
        <div className={styles.subTitle}>
            {subTitle}
        </div>
        <div className={styles.content}>
            {children}
        </div>
    </div>
);

export default VariableSection;