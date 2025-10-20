import { createSlice } from "@reduxjs/toolkit";

const refeicoesSlice = createSlice({
    name: 'refeicoes',
    initialState: {
        barraCafeDaManha: 0,
        barraAlmoco: 0,
        barraSobremesa: 0,
        barraJantar: 0,
    },
    reducers: {
        modificaCafeDaManha (state, action) {
            state.barraCafeDaManha = action.payload
        },
        modificaAlmoco (state, action) {
            state.barraAlmoco = action.payload
        },
        modificaSobremesa (state, action) {
            state.barraSobremesa = action.payload
        },
        modificaJantar (state, action) {
            state.barraJantar = action.payload
        },
    }
});

export const {modificaAlmoco, modificaCafeDaManha, modificaJantar, modificaSobremesa} = refeicoesSlice.actions;
export default refeicoesSlice.reducer;

// Reducer de Refeições (Café da Manhã, Almoço, Sobremesa e Jantar).
