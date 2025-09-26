import {configureStore} from '@reduxjs/toolkit';
import autenticacao from './autenticacaoReducer';
import barra from './barraReducer';
import filtro from './filtrarReducer'

const store = configureStore ({
    reducer: {
        autenticacao,
        barra,
        filtro
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
