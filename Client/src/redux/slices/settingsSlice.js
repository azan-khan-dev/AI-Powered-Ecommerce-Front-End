import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: { siteSettings: undefined },
    reducers: {
        setSiteSettings: (state, action) => {
            state.siteSettings = action.payload;
        },
    },
});

export const { setSiteSettings } = settingsSlice.actions;
export default settingsSlice;