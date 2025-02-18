import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validatePassword } from "@/lib/expense-utils";

interface BudgetSetupProps {
  open: boolean;
  onClose: () => void;
  onSave: (limit: number) => void;
  currentLimit?: number;
}

const BudgetSetup = ({
  open,
  onClose,
  onSave,
  currentLimit = 0,
}: BudgetSetupProps) => {
  const [monthlyLimit, setMonthlyLimit] = useState(currentLimit.toString());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!validatePassword(password)) {
      setError("Invalid password");
      return;
    }

    const limit = parseFloat(monthlyLimit);
    if (isNaN(limit) || limit <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    onSave(limit);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Set Monthly Budget Limit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Limit ($)</label>
            <Input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="Enter monthly limit"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSetup;
