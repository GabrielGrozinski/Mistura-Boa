import { createSlice } from "@reduxjs/toolkit";

const filtrarSlice = createSlice({
    name: 'filtro',
    initialState: {
        ordenacao: 'Ordenação Padrão',
        refeicao: 'Todas'
    },
    reducers: {
        modificaOrdenacao (state, action) {
            state.ordenacao = action.payload;
        },
        modificaRefeicao (state, action) {
            state.refeicao = action.payload;
        }
    }
});

export const {modificaOrdenacao, modificaRefeicao} = filtrarSlice.actions;
export default filtrarSlice.reducer;

// Reducer para gerenciar os filtros de Ordenação e Refeição.
