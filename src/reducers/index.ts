import {configureStore} from '@reduxjs/toolkit';
import autenticacao from './autenticacaoReducer';
import barra from './barraReducer';
import filtro from './filtrarReducer'
import refeicoes from './refeicoesReducer';

const store = configureStore ({
    reducer: {
        autenticacao,
        barra,
        filtro,
        refeicoes
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
