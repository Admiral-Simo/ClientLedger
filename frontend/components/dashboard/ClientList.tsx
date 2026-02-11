"use client";

import { useState } from "react";
import { Plus, MoreVertical, Trash2, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDeleteClientMutation } from "@/lib/features/apiSlice";
import ClientDialog from "./ClientDialog";
import { Client } from "@/types";

interface ClientListProps {
  clients: Client[];
  selectedClientId: number | null;
  onSelect: (id: number | null) => void;
}

export default function ClientList({
  clients = [], // Fallback, falls undefined
  selectedClientId,
  onSelect,
}: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteClient] = useDeleteClientMutation();

  // Sicherheits-Check: (clients || []) verhindert den Absturz
  const filteredClients = (clients || []).filter((client) =>
    client?.name?.toLowerCase().includes(searchTerm.toLowerCase() || ""),
  );

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Möchtest du diesen Kunden wirklich löschen?")) {
      await deleteClient(id);
      if (selectedClientId === id) onSelect(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-card rounded-xl border shadow-sm">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Clients</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200",
              selectedClientId === null
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                selectedClientId === null ? "bg-white/20" : "bg-muted",
              )}
            >
              <Users className="h-4 w-4" />
            </div>
            <span className="flex-1 text-left">All Clients</span>
          </button>

          <Separator className="my-2" />

          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {clients?.length === 0 ? "Lade..." : "Keine Treffer."}
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => onSelect(client.id)}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-lg text-sm font-medium cursor-pointer transition-all",
                  selectedClientId === client.id
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      selectedClientId === client.id
                        ? "bg-primary"
                        : "bg-muted-foreground/30",
                    )}
                  />
                  <span className="truncate">{client.name}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => handleDelete(e as any, client.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <ClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
