"use client";

import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth"; // ✅ Import Auth
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, CheckCircle2, Loader2, Download } from "lucide-react"; // ✅ Import Download Icon
import ContractStatusSelector from "@/components/contract-status-selector";
import { useDeleteContractMutation } from "@/lib/features/apiSlice";
import ContractDialog from "./ContractDialog";

interface ContractProps {
  contract: any;
}

export default function ContractCard({ contract }: ContractProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // ✅ Download Loading State

  const [deleteContract, { isLoading: isDeleting }] =
    useDeleteContractMutation();

  const handleDelete = async () => {
    await deleteContract(contract.id);
  };

  // ✅ NEW: Secure Download Handler
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // 1. Get the current JWT Token
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        alert("You must be logged in to download.");
        return;
      }

      // 2. Fetch the PDF with the Authorization Header
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${apiUrl}/contracts/${contract.id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 This unlocks the backend
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // 3. Convert response to a Blob (File)
      const blob = await response.blob();

      // 4. Create a temporary download link and click it programmatically
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Generate a clean filename based on the title
      const safeTitle = contract.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      a.download = `invoice_${safeTitle}.pdf`;
      document.body.appendChild(a);
      a.click();

      // 5. Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Could not download the invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold leading-none">
              {contract.title}
            </CardTitle>
            <CardDescription>{contract.client?.name}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ContractStatusSelector
              contractId={contract.id}
              currentStatus={contract.status}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">
              {contract.totalValue.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase">
              {contract.currency}
            </span>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="p-3 bg-muted/40 flex justify-between">
          <div className="flex gap-1">
            {/* EDIT BUTTON */}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsEditOpen(true)}
              disabled={isDownloading}
            >
              <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>

            {/* ✅ DOWNLOAD BUTTON */}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download Invoice PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              ) : (
                <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
              )}
            </Button>

            {/* DELETE BUTTON */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  disabled={isDeleting || isDownloading}
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-destructive" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the contract
                    <span className="font-semibold text-foreground">
                      {contract.title}
                    </span>
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Contract
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {contract.status === "PAID" && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </div>
          )}
        </CardFooter>
      </Card>

      {/* EDIT MODAL */}
      <ContractDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        contractToEdit={contract}
      />
    </>
  );
}
