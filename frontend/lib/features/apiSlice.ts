import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

interface StatsSummary {
  totalClients: number;
  totalContracts: number;
  totalPendingAmount: number;
  totalPaidAmount: number;
  totalOverdueAmount: number;
}

interface UserProfile {
  companyName?: string;

  address?: string;

  taxID?: string;

  phone?: string;

  ownerId?: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch {
        console.log("No active session");
      }
      return headers;
    },
  }),
  tagTypes: ["Contracts", "Clients", "Profile"],
  endpoints: (builder) => ({
    getContracts: builder.query<any, void>({
      query: () => "/contracts",
      providesTags: ["Contracts"],
    }),
    createContract: builder.mutation({
      query: (body) => ({
        url: "/contracts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contracts"],
    }),
    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),
    createClient: builder.mutation({
      query: (newClient) => ({
        url: "/clients",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients", "Contracts"], // Deleting a client deletes their contracts (Cascade)
    }),

    updateClient: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Clients"],
    }),

    // --- CONTRACTS ---
    deleteContract: builder.mutation({
      query: (id) => ({
        url: `/contracts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contracts"],
    }),

    updateContract: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/contracts/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Contracts"],
    }),

    updateContractStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/contracts/${id}/status`,
        method: "PUT",
        params: { status }, // Sends ?status=PAID
      }),
      invalidatesTags: ["Contracts"],
    }),

    getStatsSummary: builder.query<StatsSummary, void>({
      query: () => "/stats/summary",
      providesTags: ["Contracts", "Clients"],
    }),

    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (ProfileData) => ({
        url: `/profile/update`,
        method: "POST",
        body: ProfileData,
      }),
      invalidatesTags: ["Profile"],
    }),

    getProfile: builder.query({
      query: () => `/profile`,
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetContractsQuery,
  useCreateContractMutation,
  useCreateClientMutation,
  useGetClientsQuery,
  useDeleteClientMutation,
  useDeleteContractMutation,
  useUpdateClientMutation,
  useUpdateContractMutation,
  useUpdateContractStatusMutation,
  useGetStatsSummaryQuery,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = apiSlice;
