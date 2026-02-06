"use client";
import {
  useGetContractsQuery,
  useCreateContractMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  useDeleteContractMutation,
  useUpdateContractMutation,
  useUpdateContractStatusMutation,
} from "@/lib/features/apiSlice";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

// --- 1. Define Types (Fixes "Unexpected any") ---
interface Client {
  id: number;
  name: string;
  email: string;
  country: string;
  defaultCurrency: string;
}

interface Contract {
  id: number;
  title: string;
  totalValue: number;
  currency: string;
  status: "DRAFT" | "ACTIVE" | "PAID" | "OVERDUE";
  client?: Client;
}

export default function Dashboard() {
  const router = useRouter();

  // --- 2. Fix "Expected 1-2 arguments" by passing 'undefined' ---
  const { data: contracts, isLoading: loadingContracts } =
    useGetContractsQuery(undefined);
  const { data: clients, isLoading: loadingClients } =
    useGetClientsQuery(undefined);

  // Mutations
  const [createContract] = useCreateContractMutation();
  const [createClient] = useCreateClientMutation();
  const [deleteClient] = useDeleteClientMutation();
  // Removed unused 'updateClient' to fix the Warning
  const [deleteContract] = useDeleteContractMutation();
  const [updateContract] = useUpdateContractMutation();
  const [updateStatus] = useUpdateContractStatusMutation();

  // State
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [editingContractId, setEditingContractId] = useState<number | null>(
    null,
  );
  const [editForm, setEditForm] = useState({ title: "", totalValue: 0 });

  // --- ACTIONS ---

  const handleDeleteClient = async (id: number) => {
    if (
      confirm(
        "Are you sure? This will delete all contracts for this client too!",
      )
    ) {
      await deleteClient(id);
      if (selectedClientId === id) setSelectedClientId(null);
    }
  };

  const handleDeleteContract = async (id: number) => {
    if (confirm("Delete this contract?")) {
      await deleteContract(id);
    }
  };

  const handleCreateClient = async () => {
    const name = prompt("Client Name:");
    if (!name) return;
    await createClient({
      name,
      email: "email@example.com",
      country: "Morocco",
      defaultCurrency: "MAD",
    });
  };

  const handleCreateContract = async () => {
    if (!selectedClientId) return alert("Select a client first!");
    await createContract({
      title: "New Project",
      totalValue: 1000,
      clientId: selectedClientId,
    });
  };

  const startEditContract = (c: Contract) => {
    setEditingContractId(c.id);
    setEditForm({ title: c.title, totalValue: c.totalValue });
  };

  const saveContract = async (id: number) => {
    await updateContract({ id, ...editForm });
    setEditingContractId(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">ClientLedger</h1>
        <button
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: CLIENTS */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Clients</h2>
            <button
              onClick={handleCreateClient}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              + New
            </button>
          </div>

          <div className="space-y-2">
            {loadingClients ? (
              <p>Loading...</p>
            ) : (
              clients?.map((client: Client) => (
                <div
                  key={client.id}
                  className={`group flex justify-between items-center p-3 rounded cursor-pointer border transition ${
                    selectedClientId === client.id
                      ? "bg-blue-50 border-blue-500 shadow-sm"
                      : "bg-white border-transparent hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  <div className="truncate font-medium">{client.name}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client.id);
                    }}
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition px-2"
                    title="Delete Client"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTRACTS */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {selectedClientId
                ? `Contracts for ${clients?.find((c: Client) => c.id === selectedClientId)?.name || "Client"}`
                : "All Contracts"}
            </h2>
            <button
              onClick={handleCreateContract}
              disabled={!selectedClientId}
              className={`px-4 py-2 rounded text-white text-sm font-medium ${
                selectedClientId
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              + Add Contract
            </button>
          </div>

          <div className="grid gap-4">
            {loadingContracts ? (
              <p>Loading...</p>
            ) : (
              contracts
                ?.filter(
                  (c: Contract) =>
                    !selectedClientId || c.client?.id === selectedClientId,
                )
                .map((c: Contract) => (
                  <div
                    key={c.id}
                    className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    {/* EDIT MODE */}
                    {editingContractId === c.id ? (
                      <div className="flex flex-col gap-3">
                        <input
                          className="border p-2 rounded"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                        <input
                          type="number"
                          className="border p-2 rounded"
                          value={editForm.totalValue}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              totalValue: Number(e.target.value),
                            })
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveContract(c.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingContractId(null)}
                            className="bg-gray-300 px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // VIEW MODE
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {c.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {c.client?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Status Dropdown */}
                            <select
                              value={c.status}
                              onChange={(e) =>
                                updateStatus({
                                  id: c.id,
                                  status: e.target.value,
                                })
                              }
                              className={`text-xs font-bold px-2 py-1 rounded border-0 cursor-pointer ${
                                c.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : c.status === "DRAFT"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              <option value="DRAFT">DRAFT</option>
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="PAID">PAID</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {c.totalValue}{" "}
                            <span className="text-sm text-gray-400">
                              {c.currency}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditContract(c)}
                              className="text-gray-400 hover:text-blue-600 p-1"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteContract(c.id)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
            )}

            {contracts?.length === 0 && (
              <p className="text-gray-400 italic">No contracts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
