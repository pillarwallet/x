import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { addMiddleware } from '../../../store';
import { isTestnet } from '../../../utils/blockchain';

export interface DeveloperApp {
  appId: string;
  ownerEoaAddress: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  tags: string;
  logo: string;
  banner?: string;
  supportEmail: string;
  launchUrl: string;
  socialTelegram?: string;
  socialX?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DeveloperAppCreateRequest {
  ownerEoaAddress: string;
  name: string;
  appId: string;
  shortDescription: string;
  longDescription?: string;
  tags: string;
  logo: string;
  banner?: string;
  supportEmail: string;
  launchUrl: string;
  socialTelegram?: string;
  socialX?: string;
  socialFacebook?: string;
  socialTiktok?: string;
}

export interface DeveloperAppUpdateRequest {
  ownerEoaAddress: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  tags?: string;
  logo?: string;
  banner?: string;
  supportEmail?: string;
  launchUrl?: string;
  socialTelegram?: string;
  socialX?: string;
  socialFacebook?: string;
  socialTiktok?: string;
}

export interface DeveloperAppDeleteRequest {
  ownerEoaAddress: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

const baseUrl = isTestnet
  ? 'http://localhost:5000/pillarx-staging/us-central1/developerApps'
  : 'https://developerapps-7eu4izffpa-uc.a.run.app';

export const developerAppsApi = createApi({
  reducerPath: 'developerAppsApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  tagTypes: ['DeveloperApp'],
  endpoints: (builder) => ({
    // Get all developer apps
    getAllDeveloperApps: builder.query<ApiResponse<DeveloperApp[]>, { eoaAddress?: string } | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params?.eoaAddress) {
          searchParams.append('eoaAddress', params.eoaAddress);
        }
        return `/?${searchParams.toString()}`;
      },
      providesTags: ['DeveloperApp'],
    }),

    // Get single developer app
    getDeveloperApp: builder.query<ApiResponse<DeveloperApp>, string>({
      query: (appId) => `/${appId}`,
      providesTags: (_result, _error, appId) => [{ type: 'DeveloperApp', id: appId }],
    }),

    // Create developer app
    createDeveloperApp: builder.mutation<
      ApiResponse<DeveloperApp>,
      DeveloperAppCreateRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DeveloperApp'],
    }),

    // Update developer app
    updateDeveloperApp: builder.mutation<
      ApiResponse<DeveloperApp>,
      { appId: string; data: DeveloperAppUpdateRequest }
    >({
      query: ({ appId, data }) => ({
        url: `/${appId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { appId }) => [
        { type: 'DeveloperApp', id: appId },
        'DeveloperApp',
      ],
    }),

    // Delete developer app
    deleteDeveloperApp: builder.mutation<
      ApiResponse<void>,
      { appId: string; data: DeveloperAppDeleteRequest }
    >({
      query: ({ appId, data }) => ({
        url: `/${appId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['DeveloperApp'],
    }),
  }),
});

addMiddleware(developerAppsApi);

export const {
  useGetAllDeveloperAppsQuery,
  useGetDeveloperAppQuery,
  useCreateDeveloperAppMutation,
  useUpdateDeveloperAppMutation,
  useDeleteDeveloperAppMutation,
} = developerAppsApi;

