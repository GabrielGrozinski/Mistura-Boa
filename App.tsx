import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/reducers';
import Rotas from './src/navigation/rotas';





export default function App() {

    return (
        <Provider store={store}>
            <Rotas />
        </Provider>
    );
}
