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
  DollarSign,
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
import { useGetContractsQuery } from "@/lib/features/apiSlice";

interface ContractListProps {
  selectedClientId: number | null;
  clientName?: string;
}

export default function ContractList({
  selectedClientId,
  clientName,
}: ContractListProps) {
  // --- State ---
  const [page, setPage] = useState(0);
  const [pageSize] = useState(6);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ NEW: View Mode State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fix race conditions when switching clients
  const [isClientSwitching, setIsClientSwitching] = useState(false);

  // --- Effects ---
  useEffect(() => {
    setIsClientSwitching(true);
    setPage(0);
    setSearchTerm("");
    const timer = setTimeout(() => setIsClientSwitching(false), 150);
    return () => clearTimeout(timer);
  }, [selectedClientId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- API ---
  const { data, isLoading, isFetching } = useGetContractsQuery(
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

  const currentViewValue = useMemo(() => {
    return contracts.reduce(
      (acc: any, curr: any) => acc + (curr.totalValue || 0),
      0,
    );
  }, [contracts]);

  const showLoading = isLoading || isClientSwitching;
  const showEmpty = !showLoading && contracts.length === 0;

  // Helper for Status Badge (reused in Table)
  const getStatusBadge = (status: string) => {
    const styles: any = {
      PAID: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      OVERDUE: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      DRAFT: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
    };
    return (
      <Badge className={styles[status] || ""} variant="outline">
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-background rounded-xl border shadow-sm overflow-hidden">
      {/* === HEADER === */}
      <div className="p-4 border-b bg-card space-y-4">
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
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">New Contract</span>
          </Button>
        </div>

        {/* === TOOLBAR === */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>

            {/* ✅ LAYOUT TOGGLE: Now it works! */}
            <div className="flex items-center border rounded-md bg-background p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-sm"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Value Bar */}
        {contracts.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md border border-dashed">
            <DollarSign className="h-4 w-4" />
            <span>Value on this page: </span>
            <span className="font-mono font-medium text-foreground">
              ${currentViewValue.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* === CONTENT AREA === */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-black/20">
        {showLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : showEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No contracts found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              {selectedClientId
                ? `No contracts for ${clientName}. Create one!`
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          // ✅ CONDITIONAL RENDERING: Grid vs List
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
                      <TableHead>Client</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract: any) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {contract.title}
                        </TableCell>
                        <TableCell>{contract.client?.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: contract.currency || "USD",
                          }).format(contract.totalValue)}
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>

      {/* === FOOTER === */}
      <div className="p-3 border-t bg-card flex items-center justify-between z-10">
        <div className="text-xs text-muted-foreground">
          Page {page + 1} of {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={data?.first || showLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={data?.last || showLoading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
