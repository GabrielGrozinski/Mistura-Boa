import { createSlice } from "@reduxjs/toolkit";

const filtrarSlice = createSlice({
    name: 'filtro',
    initialState: {
        ordenacao: 'Ordenação Padrão'
    },
    reducers: {
        modificaOrdenacao (state, action) {
            state.ordenacao = action.payload;
        }
    }
});

export const {modificaOrdenacao} = filtrarSlice.actions;
export default filtrarSlice.reducer;