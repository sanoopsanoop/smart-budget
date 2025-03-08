import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Expense } from "@/lib/expense-utils";

interface SmsImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (expense: Omit<Expense, "id">) => void;
}

const SmsImport = ({ open, onClose, onImport }: SmsImportProps) => {
  const [smsText, setSmsText] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualCategory, setManualCategory] = useState("others");
  const [manualDescription, setManualDescription] = useState("");

  const parseAmount = (text: string): number | null => {
    // Look for patterns like Rs.500, Rs 500, INR 500, ₹500, etc.
    const amountRegex = /(?:Rs\.?|INR|₹)\s?(\d+(?:\.\d+)?)/i;
    const match = text.match(amountRegex);
    return match ? parseFloat(match[1]) : null;
  };

  const guessCategory = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("food") ||
      lowerText.includes("restaurant") ||
      lowerText.includes("cafe")
    ) {
      return "food";
    } else if (
      lowerText.includes("uber") ||
      lowerText.includes("ola") ||
      lowerText.includes("travel")
    ) {
      return "traveling";
    } else if (
      lowerText.includes("movie") ||
      lowerText.includes("netflix") ||
      lowerText.includes("entertainment")
    ) {
      return "entertainment";
    } else if (
      lowerText.includes("rent") ||
      lowerText.includes("electricity") ||
      lowerText.includes("water")
    ) {
      return "housing";
    }
    return "others";
  };

  const handleParse = () => {
    if (!smsText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter SMS text",
      });
      return;
    }

    const amount = parseAmount(smsText);
    if (amount) {
      setManualAmount(amount.toString());
      setManualCategory(guessCategory(smsText));
      setManualDescription(smsText.substring(0, 50));
      toast({
        title: "SMS Parsed",
        description: `Found amount: ₹${amount}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Parsing Failed",
        description: "Could not find amount in SMS. Please enter manually.",
      });
    }
  };

  const handleImport = () => {
    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    onImport({
      amount,
      category: manualCategory,
      date: new Date(),
      description: manualDescription,
    });

    // Reset form
    setSmsText("");
    setManualAmount("");
    setManualCategory("others");
    setManualDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Import from SMS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste SMS Text</label>
            <Textarea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste payment SMS here"
              className="h-24"
            />
            <Button onClick={handleParse} className="w-full">
              Parse SMS
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="food">Food</option>
              <option value="housing">Housing</option>
              <option value="traveling">Traveling</option>
              <option value="entertainment">Entertainment</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmsImport;
