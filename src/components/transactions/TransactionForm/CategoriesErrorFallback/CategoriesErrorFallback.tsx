import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from "@/components/ui/responsive-dialog";
import { AlertCircle } from "lucide-react";

type CategoriesErrorFallbackProps = {
  isEditing: boolean;
  onCancel: () => void;
};

export const CategoriesErrorFallback: React.FC<
  CategoriesErrorFallbackProps
> = ({ isEditing, onCancel }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Transaction" : "Add New Transaction"}
        </DialogTitle>
      </DialogHeader>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to Load Categories</AlertTitle>
        <AlertDescription>
          Unable to load categories. Please try again.
        </AlertDescription>
      </Alert>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
};
