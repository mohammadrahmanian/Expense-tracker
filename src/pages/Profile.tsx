import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Lock, Upload } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      // TODO: Implement password change API call
      console.log("Changing password...", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Password changed successfully!");
      resetPasswordForm();
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please select a valid CSV file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleCsvImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file first");
      return;
    }

    setIsImporting(true);
    try {
      // TODO: Implement CSV import API call
      console.log("Importing CSV file:", selectedFile.name);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success(`Successfully imported transactions from ${selectedFile.name}`);
      setSelectedFile(null);
      // Reset file input
      (document.getElementById("csv-file") as HTMLInputElement).value = "";
    } catch (error) {
      toast.error("Failed to import CSV file. Please check the format and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>
            Your current account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display-name">Name</Label>
              <Input
                id="display-name"
                value={user?.name || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Label htmlFor="display-email">Email</Label>
              <Input
                id="display-email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                {...registerPassword("currentPassword")}
                className={passwordErrors.currentPassword ? "border-red-500" : ""}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...registerPassword("newPassword")}
                  className={passwordErrors.newPassword ? "border-red-500" : ""}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...registerPassword("confirmPassword")}
                  className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* CSV Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Transactions
          </CardTitle>
          <CardDescription>
            Upload a CSV file to import your transaction history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted format: CSV files with columns for date, description, amount, and category
            </p>
          </div>

          {selectedFile && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Selected file:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          <Button 
            onClick={handleCsvImport} 
            disabled={!selectedFile || isImporting}
            className="w-full md:w-auto"
          >
            {isImporting ? "Importing..." : "Import Transactions"}
          </Button>

          <Separator />

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>First row should contain column headers</li>
              <li>Required columns: Date, Description, Amount</li>
              <li>Optional columns: Category, Type (income/expense)</li>
              <li>Date format: YYYY-MM-DD or MM/DD/YYYY</li>
              <li>Amount should be numeric (negative for expenses, positive for income)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;