"use client";
import {
  useGetContractsQuery,
  useCreateContractMutation,
  useGetClientsQuery, // <--- NEW
  useCreateClientMutation, // <--- NEW
} from "@/lib/features/apiSlice";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();

  // 1. Fetch Data
  const { data: contracts, isLoading: loadingContracts } =
    useGetContractsQuery();
  const { data: clients, isLoading: loadingClients } = useGetClientsQuery({});

  // 2. Mutations
  const [createContract] = useCreateContractMutation();
  const [createClient] = useCreateClientMutation();

  // 3. State to track which client is selected
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const handleCreateClient = async () => {
    try {
      await createClient({
        name: "Test Client Corp",
        email: "boss@testcorp.com",
        country: "Morocco",
        defaultCurrency: "EUR",
      }).unwrap();
      alert("Client Created! Now select them to add a contract.");
    } catch (err) {
      console.error("Failed to create client", err);
    }
  };

  const handleCreateContract = async () => {
    if (!selectedClientId) {
      alert("Please create (and select) a client first!");
      return;
    }

    try {
      await createContract({
        title: "New React Contract",
        totalValue: 750,
        // FIX: Match the backend DTO structure (clientId, not client object)
        clientId: selectedClientId,
      }).unwrap();
    } catch (err) {
      console.error("Failed to create contract", err);
      alert("Error creating contract. Check console.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Log Out
        </button>
      </div>

      {/* SECTION 1: CLIENTS */}
      <div className="mb-10 bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 text-black">
          1. Select a Client
        </h2>

        <div className="flex gap-4 items-center mb-4">
          <button
            onClick={handleCreateClient}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Create Test Client
          </button>

          <div className="text-sm text-gray-500">
            {loadingClients
              ? "Loading clients..."
              : `${clients?.length || 0} Clients found`}
          </div>
        </div>

        {/* Client Selection List */}
        <div className="flex gap-2 flex-wrap">
          {clients?.map((client: any) => (
            <button
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`px-4 py-2 rounded border ${
                selectedClientId === client.id
                  ? "bg-blue-100 border-blue-500 text-blue-800 font-bold ring-2 ring-blue-500"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {client.name} #{client.id}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: CONTRACTS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">2. Contracts</h2>
          <button
            onClick={handleCreateContract}
            disabled={!selectedClientId}
            className={`px-4 py-2 rounded text-white ${
              selectedClientId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            + Add Contract for Client #{selectedClientId || "?"}
          </button>
        </div>

        {loadingContracts ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {contracts?.map((c: any) => (
              <div
                key={c.id}
                className="p-4 bg-white rounded shadow border hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">
                      {c.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {c.client?.name || "Unknown Client"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      c.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="mt-4 text-2xl font-bold text-gray-900">
                  €{c.totalValue}
                </div>
              </div>
            ))}

            {contracts?.length === 0 && (
              <p className="text-gray-500 italic">No contracts yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
