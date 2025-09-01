import { createSlice } from "@reduxjs/toolkit";

// Reducer para gerenciar o Email, Nome e Senha.

const autenticacaoSlice = createSlice({
    name: 'Autenticacao',
    initialState: {
        email: '',
    },
    reducers: {
        modificaEmail (state, action) {
            state.email = action.payload;
        },
    },
});

export const {modificaEmail} = autenticacaoSlice.actions;

export default autenticacaoSlice.reducer;
