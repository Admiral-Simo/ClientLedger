"use client";

import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  useUpdateContractMutation,
} from "@/lib/features/apiSlice";
import {
  FileText,
  Mail,
  AlertCircle,
  Loader2,
  ChevronRight,
  Check,
  Send,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Utility for clean class merging

export default function ContractCard({ contract }: { contract: any }) {
  const { data: profile } = useGetProfileQuery(undefined);
  const [updateContract] = useUpdateContractMutation();
  const [sendEmail, { isLoading: isSending }] = useSendInvoiceEmailMutation();

  // Local states for polished UI
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const isProfileComplete = !!(profile?.companyName && profile?.address);

  // 🕒 Auto-reset the "Sent!" state after 4 seconds
  useEffect(() => {
    if (sendSuccess) {
      const timer = setTimeout(() => setSendSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [sendSuccess]);

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
      setSendSuccess(true); // Trigger the "Greater" UI state
    } catch (err) {
      console.error("Email failed:", err);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contracts/${contract.id}/pdf`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("PDF Failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${contract.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-muted-foreground/10">
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
            <Select
              defaultValue={contract.status}
              onValueChange={(val) =>
                updateContract({ id: contract.id, status: val })
              }
            >
              <SelectTrigger className="w-[90px] h-6 text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
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

          {/* 🚀 THE GREATER BUTTON */}
          <Button
            size="sm"
            onClick={() => handleActionWrapper(handleSendEmail)}
            disabled={isSending || sendSuccess}
            className={cn(
              "h-9 transition-all duration-500 ease-in-out font-medium gap-2",
              sendSuccess
                ? "bg-emerald-500 hover:bg-emerald-500 text-white shadow-emerald-200"
                : "bg-primary",
            )}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : sendSuccess ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in duration-300" />
                <span className="animate-in slide-in-from-bottom-1">Sent!</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Email</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* REFINED SETUP MODAL */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl">
          <DialogHeader className="flex flex-col items-center">
            <div className="bg-amber-50 p-3 rounded-full mb-2">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Incomplete Business Profile
            </DialogTitle>
            <DialogDescription className="text-center text-balance">
              We need your company details to generate professional invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="text-sm font-medium">Legal Company Name</span>
              {profile?.companyName ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <span className="text-xs text-red-500 font-bold uppercase">
                  Missing
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="text-sm font-medium">Business Address</span>
              {profile?.address ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <span className="text-xs text-red-500 font-bold uppercase">
                  Missing
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Link href="/dashboard/profile" className="w-full">
              <Button
                className="w-full group h-11"
                onClick={() => setIsAlertOpen(false)}
              >
                Complete Setup{" "}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
