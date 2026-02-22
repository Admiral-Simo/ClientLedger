"use client";

import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Trash2,
  Users,
  Search,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  clients = [],
  selectedClientId,
  onSelect,
}: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteClient] = useDeleteClientMutation();

  const filteredClients = (clients || []).filter((client) =>
    client?.name?.toLowerCase().includes(searchTerm.toLowerCase() || ""),
  );

  const handleDelete = async (
    e: React.MouseEvent,
    id: number,
    name: string,
  ) => {
    e.stopPropagation();

    // Using Sonner for a much cleaner confirmation flow
    toast.warning(`Delete client "${name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteClient(id).unwrap();
            toast.success("Client deleted successfully");
            if (selectedClientId === id) onSelect(null);
          } catch (err) {
            toast.error("Error deleting client");
          }
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-card/50 backdrop-blur-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300">
      {/* --- HEADER --- */}
      <div className="p-5 border-b space-y-4 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-sm uppercase tracking-widest text-primary/70">
              Clients
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] font-bold px-1.5 h-4"
            >
              {clients.length}
            </Badge>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search clients..."
            className="pl-9 h-9 bg-muted/30 border-none rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- SCROLLABLE LIST --- */}
      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-1 px-1">
          {/* ALL CLIENTS SELECTOR */}
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.98]",
              selectedClientId === null
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                selectedClientId === null
                  ? "bg-white/20"
                  : "bg-primary/10 text-primary",
              )}
            >
              <Users className="h-4 w-4" />
            </div>
            <span className="flex-1 text-left tracking-tight">All Clients</span>
          </button>

          <div className="px-3 py-4 flex items-center gap-2">
            <Separator className="flex-1 opacity-50" />
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
              Directory
            </span>
            <Separator className="flex-1 opacity-50" />
          </div>

          {filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
              <UserCircle2 className="h-10 w-10 text-muted-foreground/20 mb-2" />
              <p className="text-xs font-medium text-muted-foreground/60">
                {clients?.length === 0
                  ? "Wait for the data..."
                  : "No clients found with that name."}
              </p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => onSelect(client.id)}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]",
                  selectedClientId === client.id
                    ? "bg-secondary/80 text-secondary-foreground shadow-sm ring-1 ring-primary/10"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar className="h-8 w-8 rounded-lg border shadow-sm transition-transform group-hover:scale-105">
                    <AvatarFallback
                      className={cn(
                        "text-[10px] font-black",
                        selectedClientId === client.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-background",
                      )}
                    >
                      {client.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "truncate font-semibold tracking-tight",
                      selectedClientId === client.id && "text-primary",
                    )}
                  >
                    {client.name}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl shadow-xl border-muted-foreground/10"
                  >
                    <DropdownMenuItem
                      className="text-destructive font-bold text-xs gap-2 focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      onClick={(e) =>
                        handleDelete(e as any, client.id, client.name)
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Client
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
