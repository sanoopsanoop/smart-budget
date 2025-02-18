import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "error" | "success";

interface ExpenseValidationAlertProps {
  type?: AlertType;
  title?: string;
  message?: string;
  show?: boolean;
}

const ExpenseValidationAlert = ({
  type = "error",
  title = "Error",
  message = "Please check your input and try again",
  show = true,
}: ExpenseValidationAlertProps) => {
  if (!show) return null;

  const variants = {
    error: {
      containerClass: "border-red-500 bg-red-50",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      titleClass: "text-red-700",
      messageClass: "text-red-600",
    },
    success: {
      containerClass: "border-green-500 bg-green-50",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      titleClass: "text-green-700",
      messageClass: "text-green-600",
    },
  };

  const variant = variants[type];

  return (
    <Alert className={cn("flex items-center gap-3", variant.containerClass)}>
      {variant.icon}
      <div>
        <AlertTitle className={variant.titleClass}>{title}</AlertTitle>
        <AlertDescription className={variant.messageClass}>
          {message}
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default ExpenseValidationAlert;
