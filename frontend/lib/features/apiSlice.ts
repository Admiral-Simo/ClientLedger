import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch {
        // We ignore the error here. If the user isn't logged in,
        // no token is attached, and the backend will return 401.
      }
      return headers;
    },
  }),
  tagTypes: ["Clients", "Contracts"],
  endpoints: (builder) => ({
    // CLIENTS
    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),
    createClient: builder.mutation({
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients", "Contracts"],
    }),
    updateClient: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Clients"],
    }),

    // CONTRACTS
    getContracts: builder.query({
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
        params: { status },
      }),
      invalidatesTags: ["Contracts"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  useUpdateClientMutation,
  useGetContractsQuery,
  useCreateContractMutation,
  useDeleteContractMutation,
  useUpdateContractMutation,
  useUpdateContractStatusMutation,
} = apiSlice;
