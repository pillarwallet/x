import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiResponse } from '../../../types/api'

export const pillarXApi = createApi({
    reducerPath: 'pillarXApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://feed-nubpgwxpiq-uc.a.run.app/' }),
    endpoints: (builder) => ({
        getTilesInfo: builder.query<ApiResponse, { page: number; address: string }>({
            query: ({ page, address }) => `?page=${page}&address=${address}`,
        }),
    })
})

export const { useGetTilesInfoQuery } = pillarXApi;
