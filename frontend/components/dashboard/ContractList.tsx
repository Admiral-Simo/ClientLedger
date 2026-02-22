"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ContractCard from "./ContractCard";
import CreateContractModal from "./CreateContractModal"; // 👈 New Import
import { useGetContractsQuery } from "@/lib/features/apiSlice";

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

  // 🌟 State for the Modal
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
    <div className="flex flex-col h-[calc(100vh-140px)] bg-background rounded-xl border shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-4 border-b bg-card space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              {selectedClientId && clientName ? (
                <>
                  Contracts for{" "}
                  <span className="text-primary">{clientName}</span>
                </>
              ) : (
                "All Contracts"
              )}
              {totalElements > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalElements}
                </Badge>
              )}
            </h2>
          </div>

          {/* 🌟 Button now opens the modal */}
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!selectedClientId}
            title={!selectedClientId ? "Select a client first" : ""}
          >
            <Plus className="h-4 w-4" /> New Contract
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center border rounded-md bg-background p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-black/20 relative">
        {showLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No contracts found</h3>
            <p className="text-muted-foreground mt-1">
              {selectedClientId
                ? `No contracts for ${clientName}.`
                : "Try adjusting filters."}
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                {contracts.map((contract: any) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract: any) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {contract.title}
                        </TableCell>
                        <TableCell>
                          {contract.currency} {contract.totalValue}
                        </TableCell>
                        <TableCell>{contract.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t bg-card flex items-center justify-between shrink-0">
        <span className="text-xs text-muted-foreground">
          Page {page + 1} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={data?.first || showLoading}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={data?.last || showLoading}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 🌟 Modal Integration */}
      <CreateContractModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        clientId={selectedClientId}
        clientName={clientName}
      />
    </div>
  );
}
