"use client";

import { useState } from "react";
import { useUpdateContractStatusMutation } from "@/lib/features/apiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  ChevronDown,
  Check,
  Send,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  contractId: number;
  currentStatus: string;
}

export default function ContractStatusSelector({
  contractId,
  currentStatus,
}: Props) {
  const [updateStatus, { isLoading }] = useUpdateContractStatusMutation();
  const [isOpen, setIsOpen] = useState(false);

  // MAPPING: Backend Status -> UI Label & Color
  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    DRAFT: {
      label: "Draft",
      color:
        "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      icon: FileText,
    },
    ACTIVE: {
      label: "Sent", // ✅ Requirement: Display ACTIVE as SENT
      color:
        "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Send,
    },
    PAID: {
      label: "Paid",
      color:
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: Check,
    },
    OVERDUE: {
      label: "Overdue",
      color:
        "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: AlertCircle,
    },
  };

  const currentConfig = statusConfig[currentStatus] || statusConfig.DRAFT;
  const StatusIcon = currentConfig.icon;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    try {
      await updateStatus({ id: contractId, status: newStatus }).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger disabled={isLoading} className="focus:outline-none">
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider transition-all",
            currentConfig.color,
            isLoading && "opacity-70 cursor-not-allowed",
          )}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <StatusIcon className="w-3.5 h-3.5" />
          )}
          {currentConfig.label}
          <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleStatusChange("DRAFT")}>
          <FileText className="w-4 h-4 mr-2 text-slate-500" />
          Draft
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleStatusChange("ACTIVE")}>
          <Send className="w-4 h-4 mr-2 text-blue-500" />
          Mark as Sent
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleStatusChange("PAID")}>
          <Check className="w-4 h-4 mr-2 text-green-500" />
          Mark as Paid
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleStatusChange("OVERDUE")}>
          <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
          Mark Overdue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
