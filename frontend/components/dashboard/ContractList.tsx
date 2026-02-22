"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ContractCard from "./ContractCard";
import CreateContractModal from "./CreateContractModal";
import { useGetContractsQuery } from "@/lib/features/apiSlice";
import { cn } from "@/lib/utils";

interface ContractListProps {
  selectedClientId: number | null;
  clientName?: string;
}

export default function ContractList({
  selectedClientId,
  clientName,
}: ContractListProps) {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(6);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isClientSwitching, setIsClientSwitching] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setIsClientSwitching(true);
    setPage(0);
    setSearchTerm("");
    const timer = setTimeout(() => setIsClientSwitching(false), 200);
    return () => clearTimeout(timer);
  }, [selectedClientId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useGetContractsQuery(
    {
      page,
      size: pageSize,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      search: debouncedSearch || undefined,
      clientId: selectedClientId || undefined,
    },
    { skip: isClientSwitching },
  );

  const contracts = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const showLoading = isLoading || isClientSwitching;
  const showEmpty = !showLoading && contracts.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-card rounded-2xl border shadow-sm overflow-hidden">
      {/* --- HEADER SECTION --- */}
      <div className="p-6 border-b space-y-6 shrink-0 bg-gradient-to-b from-card to-background/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {selectedClientId && clientName ? (
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary/60" />
                  Contracts for{" "}
                  <span className="text-primary">{clientName}</span>
                </span>
              ) : (
                "Overview"
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage and track your service agreements.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!selectedClientId}
            className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-2"
          >
            <Plus className="h-4 w-4" /> New Contract
          </Button>
        </div>

        {/* --- FILTERS BAR --- */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder="Search by title..."
              className="pl-10 h-10 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex w-full lg:w-auto items-center gap-3">
            <Tabs
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="hidden sm:block"
            >
              <TabsList className="bg-muted/30 p-1 rounded-xl h-10 border">
                <TabsTrigger
                  value="ALL"
                  className="rounded-lg px-4 text-xs font-bold"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger
                  value="DRAFT"
                  className="rounded-lg px-4 text-xs font-bold"
                >
                  DRAFT
                </TabsTrigger>
                <TabsTrigger
                  value="PENDING"
                  className="rounded-lg px-4 text-xs font-bold"
                >
                  PENDING
                </TabsTrigger>
                <TabsTrigger
                  value="PAID"
                  className="rounded-lg px-4 text-xs font-bold"
                >
                  PAID
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="h-10 w-px bg-border mx-1 hidden sm:block" />

            <div className="flex items-center bg-muted/30 p-1 rounded-xl border h-10">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground",
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground",
                )}
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-black/10">
        {showLoading ? (
          <LoadingSkeleton mode={viewMode} />
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-muted/30 rounded-3xl flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div className="max-w-[280px]">
              <h3 className="text-xl font-bold">No results found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedClientId
                  ? `There are no contracts registered for ${clientName} yet.`
                  : "We couldn't find any contracts matching your current filters."}
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                {contracts.map((contract: any) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="font-bold py-4">
                        Contract Title
                      </TableHead>
                      <TableHead className="font-bold">Total Value</TableHead>
                      <TableHead className="font-bold text-right pr-6">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract: any) => (
                      <TableRow
                        key={contract.id}
                        className="group transition-colors hover:bg-muted/10"
                      >
                        <TableCell className="py-4 font-semibold">
                          {contract.title}
                        </TableCell>
                        <TableCell className="font-medium">
                          {contract.currency}{" "}
                          {contract.totalValue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              contract.status === "PAID" &&
                                "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                              contract.status === "PENDING" &&
                                "bg-amber-500/10 text-amber-600 border-amber-500/20",
                            )}
                          >
                            {contract.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- FOOTER / PAGINATION --- */}
      <div className="p-4 border-t bg-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter">
            Result Data
          </span>
          <Badge
            variant="outline"
            className="text-[10px] font-black bg-muted/30"
          >
            {totalElements} TOTAL
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-muted-foreground uppercase">
            Page {page + 1} / {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setPage((p) => p - 1)}
              disabled={data?.first || showLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setPage((p) => p + 1)}
              disabled={data?.last || showLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CreateContractModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        clientId={selectedClientId}
        clientName={clientName}
      />
    </div>
  );
}

// Sub-component for Skeleton states
function LoadingSkeleton({ mode }: { mode: "grid" | "list" }) {
  if (mode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
