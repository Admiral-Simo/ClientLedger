import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

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
      } catch (err) {
        console.log("No active session");
      }
      return headers;
    },
  }),
  tagTypes: ["Contracts", "Clients"],
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
  }),
});

export const {
  useGetContractsQuery,
  useCreateContractMutation,
  useCreateClientMutation,
  useGetClientsQuery,
} = apiSlice;
