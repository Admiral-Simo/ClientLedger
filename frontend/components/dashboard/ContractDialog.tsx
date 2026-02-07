"use client";

import { useEffect, useState } from "react";
import {
  useCreateContractMutation,
  useUpdateContractMutation,
} from "@/lib/features/apiSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: number | null; // Required for Create Mode
  contractToEdit?: any; // Required for Edit Mode
}

export default function ContractDialog({
  open,
  onOpenChange,
  clientId,
  contractToEdit,
}: Props) {
  const isEditing = !!contractToEdit;

  const [createContract, { isLoading: isCreating }] =
    useCreateContractMutation();
  const [updateContract, { isLoading: isUpdating }] =
    useUpdateContractMutation();

  const isLoading = isCreating || isUpdating;

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    totalValue: 0,
    currency: "Default",
    status: "DRAFT",
  });

  // Reset or Populate form when opening
  useEffect(() => {
    if (open) {
      if (contractToEdit) {
        setFormData({
          title: contractToEdit.title,
          totalValue: contractToEdit.totalValue,
          currency: contractToEdit.currency || "USD",
          status: contractToEdit.status,
        });
      } else {
        // Reset for new contract
        setFormData({
          title: "",
          totalValue: 0,
          currency: "Default",
          status: "DRAFT",
        });
      }
    }
  }, [open, contractToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateContract({
          id: contractToEdit.id,
          ...formData,
        }).unwrap();
      } else {
        if (!clientId) return;
        await createContract({
          clientId,
          ...formData,
        }).unwrap();
      }
      onOpenChange(false); // Close modal on success
    } catch (error) {
      console.error("Failed to save contract", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Contract" : "New Contract"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the contract details below."
              : "Create a new project scope and agreement."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Total Value</Label>
              <Input
                id="value"
                type="number"
                value={formData.totalValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalValue: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(val) =>
                  setFormData({ ...formData, currency: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default as client.</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="MAD">MAD (DH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Sent (Active)</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
