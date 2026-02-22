"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateContractMutation } from "@/lib/features/apiSlice";
import { Loader2 } from "lucide-react";

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number | null;
  clientName?: string;
}

export default function CreateContractModal({
  isOpen,
  onClose,
  clientId,
  clientName,
}: CreateContractModalProps) {
  const [createContract, { isLoading }] = useCreateContractMutation();
  const [formData, setFormData] = useState({
    title: "",
    totalValue: "",
    currency: "Default",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    try {
      await createContract({
        title: formData.title,
        totalValue: parseFloat(formData.totalValue),
        currency: formData.currency,
        clientId: clientId,
      }).unwrap();

      // Reset and close
      setFormData({ title: "", totalValue: "", currency: "Default" });
      onClose();
    } catch (err) {
      console.error("Failed to create contract:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Contract {clientName && `for ${clientName}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Contract Title</Label>
            <Input
              id="title"
              required
              placeholder="e.g., Q3 Web Development"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Total Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.totalValue}
                onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(v) => setFormData({ ...formData, currency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default (Client's)</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="MAD">MAD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Contract
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
