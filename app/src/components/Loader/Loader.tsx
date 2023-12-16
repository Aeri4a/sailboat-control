import { FC } from 'react';

import styles from './Loader.module.scss';

const Loader: FC = () => (
    <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
    </div>
)

export default Loader;