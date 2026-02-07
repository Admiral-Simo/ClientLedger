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

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Users,
  DollarSign,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

// Types
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

  // API Hooks
  // Fixed: Removed unused 'isLoading' variables
  const { data: contracts = [] } = useGetContractsQuery(undefined);
  const { data: clients = [] } = useGetClientsQuery(undefined);

  const [createContract] = useCreateContractMutation();
  const [createClient] = useCreateClientMutation();
  const [deleteClient] = useDeleteClientMutation();
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
        "⚠️ This will permanently delete this client and ALL their contracts.",
      )
    ) {
      await deleteClient(id);
      if (selectedClientId === id) setSelectedClientId(null);
    }
  };

  // ✅ Fixed: Added this missing function
  const handleDeleteContract = async (id: number) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      await deleteContract(id);
    }
  };

  const handleCreateClient = async () => {
    const name = prompt("Client Name:");
    if (!name) return;
    await createClient({
      name,
      email: "contact@client.com",
      country: "Morocco",
      defaultCurrency: "MAD",
    });
  };

  const handleCreateContract = async () => {
    if (!selectedClientId) return;
    await createContract({
      title: "New Project Scope",
      totalValue: 0,
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

  // --- CALCULATIONS ---
  const totalRevenue = contracts.reduce(
    (sum: number, c: Contract) =>
      sum + (c.status === "PAID" ? c.totalValue : 0),
    0,
  );
  const pendingRevenue = contracts.reduce(
    (sum: number, c: Contract) =>
      sum + (c.status !== "PAID" ? c.totalValue : 0),
    0,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "ACTIVE":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      case "DRAFT":
        return "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200";
      default:
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-10 w-full border-b bg-white/95 backdrop-blur px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-1.5 rounded-md">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            ClientLedger
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Logged in as Admin
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Collected from paid invoices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ${pendingRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Draft or active contracts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {clients.length}
              </div>
              <p className="text-xs text-muted-foreground">Total client base</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR: CLIENTS */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Clients</h2>
              <Button size="icon" variant="ghost" onClick={handleCreateClient}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {clients.map((client: Client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`group flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                    selectedClientId === client.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-2 h-2 rounded-full ${selectedClientId === client.id ? "bg-green-400" : "bg-slate-300"}`}
                    />
                    {client.name}
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client.id);
                    }}
                    className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition ${selectedClientId === client.id ? "hover:bg-slate-800" : "hover:bg-red-50"}`}
                  >
                    <Trash2
                      className={`w-4 h-4 ${selectedClientId === client.id ? "text-slate-400 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}
                    />
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-lg bg-slate-50">
                  <p className="text-sm text-muted-foreground">
                    No clients yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* MAIN CONTENT: CONTRACTS */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {selectedClientId
                    ? `Contracts for ${clients.find((c: Client) => c.id === selectedClientId)?.name}`
                    : "Recent Contracts"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your agreements and billing.
                </p>
              </div>
              <Button
                onClick={handleCreateContract}
                disabled={!selectedClientId}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Contract
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {contracts
                .filter(
                  (c: Contract) =>
                    !selectedClientId || c.client?.id === selectedClientId,
                )
                .map((c: Contract) => (
                  <Card key={c.id} className="transition-all hover:shadow-md">
                    {/* EDIT MODE */}
                    {editingContractId === c.id ? (
                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase text-muted-foreground">
                            Project Title
                          </label>
                          <Input
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase text-muted-foreground">
                            Value
                          </label>
                          <Input
                            type="number"
                            value={editForm.totalValue}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                totalValue: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => saveContract(c.id)}
                            className="w-full"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingContractId(null)}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                          <div className="space-y-1">
                            <CardTitle className="text-base font-bold leading-none">
                              {c.title}
                            </CardTitle>
                            <CardDescription>{c.client?.name}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="relative">
                              <select
                                value={c.status}
                                onChange={(e) =>
                                  updateStatus({
                                    id: c.id,
                                    status: e.target.value,
                                  })
                                }
                                className={`appearance-none text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer uppercase tracking-wider ${getStatusColor(c.status)}`}
                              >
                                <option value="DRAFT">Draft</option>
                                <option value="ACTIVE">Active</option>
                                <option value="PAID">Paid</option>
                              </select>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold tracking-tight">
                              {c.totalValue.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium uppercase">
                              {c.currency}
                            </span>
                          </div>
                        </CardContent>

                        <Separator />

                        <CardFooter className="p-3 bg-slate-50/50 flex justify-between">
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => startEditContract(c)}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleDeleteContract(c.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-500" />
                            </Button>
                          </div>
                          {c.status === "PAID" && (
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Completed
                            </div>
                          )}
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
