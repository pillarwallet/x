import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// utils
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
  isApproved: boolean;
  isInReview: boolean;
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
  isApproved?: boolean; // Only privileged users can update this
  isInReview?: boolean; // App owners can update this
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
  ? 'https://developerapps-nubpgwxpiq-uc.a.run.app'
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
      async queryFn(arg, _api, _extra, baseQuery) {
        try {
          const signature = '';
          const result = await baseQuery({
            url: '/',
            method: 'POST',
            body: arg,
            headers: { 'x-signature': signature },
          });
          
          // Check for 401 unauthorized response
          if ('error' in result && result.error && typeof result.error === 'object') {
            const error = result.error as { status?: number; data?: unknown };
            if (error.status === 401) {
              alert('You are not authorized to perform this operation. Please ensure you are connected with the correct wallet.');
            }
          }
          
          return result as any;
        } catch (error) {
          return { error } as any;
        }
      },
      invalidatesTags: ['DeveloperApp'],
    }),

    // Update developer app
    updateDeveloperApp: builder.mutation<
      ApiResponse<DeveloperApp>,
      { appId: string; data: DeveloperAppUpdateRequest }
    >({
      async queryFn(arg, _api, _extra, baseQuery) {
        try {
          const signature = '';
          const result = await baseQuery({
            url: `/${arg.appId}`,
            method: 'PUT',
            body: arg.data,
            headers: { 'x-signature': signature },
          });
          
          // Check for 401 unauthorized response
          if ('error' in result && result.error && typeof result.error === 'object') {
            const error = result.error as { status?: number; data?: unknown };
            if (error.status === 401) {
              alert('You are not authorized to perform this operation. Please ensure you are connected with the correct wallet.');
            }
          }
          
          return result as any;
        } catch (error) {
          return { error } as any;
        }
      },
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
      async queryFn(arg, _api, _extra, baseQuery) {
        try {
          const signature = '';
          const result = await baseQuery({
            url: `/${arg.appId}`,
            method: 'DELETE',
            body: arg.data,
            headers: { 'x-signature': signature },
          });
          
          // Check for 401 unauthorized response
          if ('error' in result && result.error && typeof result.error === 'object') {
            const error = result.error as { status?: number; data?: unknown };
            if (error.status === 401) {
              alert('You are not authorized to perform this operation. Please ensure you are connected with the correct wallet.');
            }
          }
          
          return result as any;
        } catch (error) {
          return { error } as any;
        }
      },
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

