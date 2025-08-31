import { createSlice } from "@reduxjs/toolkit";

// Reducer para gerenciar o Email, Nome e Senha.

const autenticacaoSlice = createSlice({
    name: 'Autenticacao',
    initialState: {
        nome: '',
        email: '',
        senha: '',
    },
    reducers: {
        modificaNome (state, action) {
            state.nome = action.payload;
        },
        modificaEmail (state, action) {
            state.email = action.payload;
        },
        modificaSenha (state, action) {
            state.senha = action.payload;
        }
    },
});

export const {modificaNome, modificaEmail, modificaSenha} = autenticacaoSlice.actions;

export default autenticacaoSlice.reducer;
