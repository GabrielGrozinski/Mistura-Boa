import {configureStore} from '@reduxjs/toolkit';
import autenticacao from './autenticacaoReducer';

const store = configureStore ({
    reducer: {
        autenticacao
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
