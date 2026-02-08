"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  CreditCard,
  Save,
  Loader2,
  CheckCircle2,
  User,
  AlertCircle, // ✅ Imported Icon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // ✅ Imported Alert components

// Import your hooks
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/lib/features/apiSlice";

export default function UserProfilePage() {
  const { data: profileData, isLoading: isFetching } =
    useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // ✅ Error State

  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    taxID: "",
    phone: "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        companyName: profileData.companyName || "",
        address: profileData.address || "",
        taxID: profileData.taxID || "",
        phone: profileData.phone || "",
      });
    }
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSuccess(false);
    setErrorMessage(null); // ✅ Clear error when user starts typing again
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      await updateProfile(formData).unwrap();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      let msg = "Failed to update profile.";

      // 1. Check for our new clean "errors" list
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        // Join the list with line breaks so it looks nice
        msg = error.data.errors.join("\n");
      }
      // 2. Fallback for other types of errors
      else if (error?.data?.message) {
        msg = error.data.message;
      }

      setErrorMessage(msg);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your company details and invoice preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <nav className="flex flex-col space-y-1">
          <Button variant="secondary" className="justify-start font-medium">
            <User className="mr-2 h-4 w-4" />
            General
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-muted-foreground"
            disabled
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing (Coming Soon)
          </Button>
        </nav>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                This information will appear on every PDF invoice you generate.
              </CardDescription>
            </CardHeader>
            <Separator />

            <CardContent className="p-6 space-y-6">
              {/* ✅ ERROR ALERT DISPLAY */}
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-logo.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {formData.companyName
                      ? formData.companyName.substring(0, 2).toUpperCase()
                      : "CL"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium leading-none">Company Logo</h3>
                  <p className="text-xs text-muted-foreground">
                    Your initials are used as a placeholder.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyName">Company Legal Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      className="pl-9"
                      placeholder="e.g. Acme Solutions Inc."
                      value={formData.companyName}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxID">Tax / VAT ID</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="taxID"
                      className="pl-9"
                      placeholder="e.g. US-12345678"
                      value={formData.taxID}
                      onChange={(e) => handleChange("taxID", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-9"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      className="pl-9"
                      placeholder="123 Innovation Dr, Tech City"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    This address will be displayed in the &quot;From&quot;
                    section of your invoices.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                {isSuccess && (
                  <span className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved successfully
                  </span>
                )}

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-[140px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
