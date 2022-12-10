import 'whatwg-fetch';
import { createApi } from '@reduxjs/toolkit/query/react';
import { IAritst } from '@/types/artist';
import { customFetchBaseQuery } from './_baseQuery';

export const artistApi = createApi({
    reducerPath: 'artistApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Artist'],
    endpoints: (build) => ({
        getArtist: build.query<IAritst[], void>({
            query: () => '/artist',
            providesTags: ['Artist'],
        }),
        submitArtistInfo: build.mutation({
            query: (reqData: any) => ({
                url: '/artist',
                method: 'POST',
                body: reqData,
            }),
        }),
    }),
});

export const { useGetArtistQuery, useSubmitArtistInfoMutation } = artistApi;
