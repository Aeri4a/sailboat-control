import { combineReducers } from '@reduxjs/toolkit';
import { simReducer as sim } from './slices/Simulation';

const generalReducer = combineReducers({ sim });

export default generalReducer;
