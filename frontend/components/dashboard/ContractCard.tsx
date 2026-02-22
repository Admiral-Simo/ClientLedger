"use client";

import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { toast } from "sonner";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useGetProfileQuery,
  useSendInvoiceEmailMutation,
  useUpdateContractStatusMutation,
} from "@/lib/features/apiSlice";
import { FileText, Loader2, Check, Send } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ContractCard({ contract }: { contract: any }) {
  const { data: profile } = useGetProfileQuery(undefined);

  // 🔄 RESTORED: Mutation for status updates
  const [updateContractStatus, { isLoading: isUpdatingStatus }] =
    useUpdateContractStatusMutation();
  const [sendEmail, { isLoading: isSending }] = useSendInvoiceEmailMutation();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const isProfileComplete = !!(profile?.companyName && profile?.address);

  useEffect(() => {
    if (sendSuccess) {
      const timer = setTimeout(() => setSendSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [sendSuccess]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const promise = updateContractStatus({
        id: contract.id,
        status: newStatus,
      }).unwrap();

      toast.promise(promise, {
        loading: "Updating status...",
        success: (data) => `Status changed to ${newStatus}`,
        error: "Failed to update status",
      });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleActionWrapper = (action: () => void) => {
    if (!isProfileComplete) {
      setIsAlertOpen(true);
      return;
    }
    action();
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail(contract.id).unwrap();
      setSendSuccess(true);
      toast.success("Invoice Sent Successfully");
    } catch (err) {
      toast.error("Email failed to send");
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const session = await fetchAuthSession(); // Using Amplify session
      const token = session.tokens?.idToken?.toString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/${contract.id}/pdf`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${contract.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF Downloaded");
    } catch (err) {
      toast.error("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-muted-foreground/10 bg-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {contract.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">
                  {contract.totalValue.toLocaleString()}
                </span>
                <span className="text-xs font-bold opacity-50">
                  {contract.currency}
                </span>
              </div>
            </div>

            {/* 🔄 RESTORED: Select component for status updates */}
            <Select
              disabled={isUpdatingStatus}
              defaultValue={contract.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                className={cn(
                  "w-[100px] h-7 text-[10px] font-bold border-none transition-colors",
                  contract.status === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="OVERDUE">OVERDUE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardFooter className="grid grid-cols-2 gap-3 pt-6">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 gap-2 font-medium"
            disabled={isDownloading}
            onClick={() => handleActionWrapper(handleDownloadPdf)}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Download
          </Button>

          <Button
            size="sm"
            onClick={() => handleActionWrapper(handleSendEmail)}
            disabled={isSending || sendSuccess}
            className={cn(
              "h-9 transition-all duration-500 font-medium gap-2",
              sendSuccess ? "bg-emerald-500" : "bg-primary",
            )}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : sendSuccess ? (
              <Check className="h-4 w-4 animate-in zoom-in" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {sendSuccess ? "Sent!" : "Email"}
          </Button>
        </CardFooter>
      </Card>

      {/* Setup Modal - Remains for UX safety */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Your business details are required for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <div className="flex justify-between p-2 border rounded">
              <span>Company Name</span>
              {profile?.companyName ? "✅" : "❌"}
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>Address</span>
              {profile?.address ? "✅" : "❌"}
            </div>
          </div>
          <DialogFooter>
            <Link href="/dashboard/profile" className="w-full">
              <Button className="w-full" onClick={() => setIsAlertOpen(false)}>
                Go to Profile
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
