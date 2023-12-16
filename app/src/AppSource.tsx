import { FC } from 'react';
import { Provider } from 'react-redux';
import store from './store';

import App from './App';

const AppSource: FC = () => (
    <Provider store={store}>
        <App/>
    </Provider>
);

export default AppSource;