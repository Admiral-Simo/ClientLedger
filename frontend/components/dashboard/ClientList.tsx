"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  useCreateClientMutation,
  useDeleteClientMutation,
} from "@/lib/features/apiSlice";

interface Client {
  id: number;
  name: string;
}

interface Props {
  clients: Client[];
  selectedClientId: number | null;
  onSelect: (id: number | null) => void;
}

export default function ClientList({
  clients,
  selectedClientId,
  onSelect,
}: Props) {
  const [createClient] = useCreateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const handleCreate = async () => {
    const name = prompt("Client Name:");
    if (!name) return;
    await createClient({
      name,
      email: "contact@client.com",
      country: "Morocco",
      defaultCurrency: "MAD",
    });
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("⚠️ Permanently delete this client and ALL their contracts?")) {
      await deleteClient(id);
      if (selectedClientId === id) onSelect(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Clients</h2>
        <Button size="icon" variant="ghost" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelect(client.id)}
            className={`group flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
              selectedClientId === client.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card text-card-foreground border-border hover:border-input hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedClientId === client.id
                    ? "bg-green-400"
                    : "bg-muted-foreground/30"
                }`}
              />
              {client.name}
            </div>
            <div
              onClick={(e) => handleDelete(client.id, e)}
              className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition ${
                selectedClientId === client.id
                  ? "hover:bg-primary-foreground/20"
                  : "hover:bg-destructive/10"
              }`}
            >
              <Trash2
                className={`w-4 h-4 ${
                  selectedClientId === client.id
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground hover:text-destructive"
                }`}
              />
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">No clients yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
