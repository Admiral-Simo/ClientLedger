import { Contract, ContractFilters, PaginatedResponse } from "@/types";
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
    // Inside apiSlice.ts endpoints:

    // Inside apiSlice.ts -> endpoints -> getContracts

    // ✅ CORRECT
    getContracts: builder.query<PaginatedResponse<Contract>, ContractFilters>({
      query: (filters = { page: 0, size: 10 }) => {
        const params = new URLSearchParams();

        params.append("page", (filters.page ?? 0).toString());
        params.append("size", (filters.size ?? 10).toString());

        if (filters.status && filters.status !== "ALL") {
          params.append("status", filters.status);
        }
        if (filters.search) {
          params.append("search", filters.search);
        }

        // 👇 THIS IS LIKELY MISSING
        if (filters.clientId) {
          params.append("clientId", filters.clientId.toString());
        }

        return `/contracts?${params.toString()}`;
      },
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

    sendInvoiceEmail: builder.mutation<{ message: string }, number>({
      query: (contractId) => ({
        url: `/contracts/${contractId}/email`,
        method: "POST",
      }),
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
  useSendInvoiceEmailMutation,
} = apiSlice;
