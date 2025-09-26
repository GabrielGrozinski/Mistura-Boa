import { createSlice } from "@reduxjs/toolkit";

const barraSlice = createSlice({
    name: 'barra',
    initialState: {
        barra: 0
    },
    reducers: {
        modificaBarra (state, action) {
            state.barra = action.payload
        },
    },
});

export const {modificaBarra} = barraSlice.actions;

export default barraSlice.reducer;
