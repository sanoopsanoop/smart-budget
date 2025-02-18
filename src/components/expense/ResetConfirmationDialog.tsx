import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResetConfirmationDialogProps {
  open?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ResetConfirmationDialog = ({
  open = true,
  onConfirm = () => {},
  onCancel = () => {},
}: ResetConfirmationDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Form</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset the form? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetConfirmationDialog;
