"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetProfileQuery,
  useSendInvoiceEmailMutation,
  useUpdateContractMutation, // 👈 Restored for status changes
} from "@/lib/features/apiSlice";
import {
  FileText,
  Mail,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ContractCard({ contract }: { contract: any }) {
  const { data: profile } = useGetProfileQuery(undefined);
  const [sendEmail, { isLoading: isSending }] = useSendInvoiceEmailMutation();
  const [updateContract, { isLoading: isUpdatingStatus }] =
    useUpdateContractMutation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const isProfileComplete = !!(profile?.companyName && profile?.address);

  // Guard for PDF and Email
  const handleActionWrapper = (action: () => void) => {
    if (!isProfileComplete) {
      setIsAlertOpen(true);
      return;
    }
    action();
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateContract({
        id: contract.id,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail(contract.id).unwrap();
      alert("Invoice sent successfully!");
    } catch (err) {
      console.error("Email failed:", err);
    }
  };

  // Fixed PDF Download using a hidden link to bypass pop-up blockers
  const handleDownloadPdf = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/contracts/${contract.id}/pdf`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice_${contract.id}.pdf`);
    link.target = "_blank"; // Ensure it opens/downloads correctly
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-muted-foreground/10 bg-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold line-clamp-1">
                {contract.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                ID: #{contract.id}
              </p>
            </div>

            {/* 🔄 RESTORED: Status Change Dropdown */}
            <Select
              disabled={isUpdatingStatus}
              defaultValue={contract.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[100px] h-7 text-xs font-semibold uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary">
              {contract.totalValue.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-muted-foreground uppercase">
              {contract.currency}
            </span>
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/5 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-background gap-2"
            onClick={() => handleActionWrapper(handleDownloadPdf)}
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button
            size="sm"
            className="gap-2"
            disabled={isSending}
            onClick={() => handleActionWrapper(handleSendEmail)}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Send
          </Button>
        </CardFooter>
      </Card>

      {/* 🚨 PROFILE SETUP MODAL */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl">
              Profile Setup Required
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              We need your business details to generate a valid invoice.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg p-4 my-2 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div
                className={`h-2 w-2 rounded-full ${profile?.companyName ? "bg-green-500" : "bg-red-500"}`}
              />
              Company Legal Name: {profile?.companyName ? "✅" : "❌"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div
                className={`h-2 w-2 rounded-full ${profile?.address ? "bg-green-500" : "bg-red-500"}`}
              />
              Business Address: {profile?.address ? "✅" : "❌"}
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Link href="/dashboard/profile" className="w-full">
              <Button
                className="w-full gap-2"
                onClick={() => setIsAlertOpen(false)}
              >
                Go to Profile <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
