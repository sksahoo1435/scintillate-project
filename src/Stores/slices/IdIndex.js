import { createSlice } from "@reduxjs/toolkit";

export const idSlice = createSlice({
    name:'img',
    initialState:{
        ind:0,
    },

    reducers:{
        indTransfer(state,action){
            return { ind: action.payload };
        }
    }

})

export default idSlice.reducer;