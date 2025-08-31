import {configureStore} from '@reduxjs/toolkit';
import autenticacao from './autenticacaoReducer';

const store = configureStore ({
    reducer: {
        autenticacao
    },
});

export default store;
