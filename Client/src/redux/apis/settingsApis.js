import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEnv from "../../configs/config.js";

const settingsApis = createApi({
    reducerPath: "settingsApis",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getEnv("SERVER_URL")}/api/settings`,
        credentials: "include",
    }),
    tagTypes: ["Settings"],
    endpoints: (builder) => ({
        // Get public config
        getPublicConfig: builder.query({
            query: () => ({
                url: "/config",
                method: "GET",
            }),
            providesTags: ["Settings"],
        }),

        // Get admin settings
        getSettings: builder.query({
            query: () => ({
                url: "/admin",
                method: "GET",
            }),
            providesTags: ["Settings"],
        }),

        // Update settings
        updateSettings: builder.mutation({
            query: (data) => ({
                url: "/admin",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Settings"],
        }),
    }),
});

export const {
    useGetPublicConfigQuery,
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} = settingsApis;

export default settingsApis;
