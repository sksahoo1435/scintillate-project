import { configureStore } from "@reduxjs/toolkit";
import idSclice from '../Stores/slices/IdIndex'

export const imgStore = configureStore({
    reducer:{
        img:idSclice,
    }
})