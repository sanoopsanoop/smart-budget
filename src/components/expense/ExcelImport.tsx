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
import { toast } from "@/components/ui/use-toast";
import { Expense } from "@/lib/expense-utils";
import * as XLSX from "xlsx";

interface ExcelImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (expenses: Array<Omit<Expense, "id">>) => void;
}

const ExcelImport = ({ open, onClose, onImport }: ExcelImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Array<Omit<Expense, "id">>>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      parseExcel(e.target.files[0]);
    }
  };

  const parseExcel = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Map Excel data to expense format with flexible column matching
      const expenses = jsonData.map((row: any) => {
        // Find amount field - look for various possible column names
        const amountValue = findValue(row, [
          "Amount",
          "amount",
          "AMOUNT",
          "Cost",
          "cost",
          "Price",
          "price",
          "Value",
          "value",
        ]);
        const amount =
          typeof amountValue === "number"
            ? amountValue
            : parseFloat(amountValue) || 0;

        // Find category field
        const category =
          findValue(row, [
            "Category",
            "category",
            "CATEGORY",
            "Type",
            "type",
            "Expense Type",
            "expense type",
          ]) || "others";

        // Find description field
        const description =
          findValue(row, [
            "Description",
            "description",
            "DESC",
            "desc",
            "Note",
            "note",
            "Details",
            "details",
          ]) || "";

        // Try to parse date from various formats and column names
        let date = new Date();
        const dateValue = findValue(row, [
          "Date",
          "date",
          "DATE",
          "Transaction Date",
          "transaction date",
          "Purchase Date",
          "purchase date",
        ]);

        if (dateValue) {
          try {
            // Handle Excel date number format
            if (typeof dateValue === "number") {
              // Use Excel date conversion
              const excelEpoch = new Date(1899, 11, 30);
              date = new Date(
                excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000,
              );
            } else {
              date = new Date(dateValue);
            }

            // Check if date is valid
            if (isNaN(date.getTime())) {
              date = new Date(); // Fallback to current date
            }
          } catch (e) {
            console.error("Error parsing date:", e);
          }
        }

        return {
          amount,
          category: typeof category === "string" ? category : "others",
          date,
          description: typeof description === "string" ? description : "",
        };
      });

      // Filter out invalid entries
      const validExpenses = expenses.filter(
        (exp) => !isNaN(exp.amount) && exp.amount > 0,
      );

      setPreview(validExpenses);

      toast({
        title: "Excel Parsed",
        description: `Found ${validExpenses.length} valid expense entries`,
      });
    } catch (error) {
      console.error("Error parsing Excel:", error);
      toast({
        variant: "destructive",
        title: "Parsing Failed",
        description: "Could not parse Excel file. Please check the format.",
      });
    }
  };

  // Helper function to find a value in an object using multiple possible keys
  const findValue = (obj: any, possibleKeys: string[]): any => {
    for (const key of possibleKeys) {
      if (obj[key] !== undefined) {
        return obj[key];
      }
    }
    return null;
  };

  const handleImport = () => {
    if (preview.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No valid expense data found to import.",
      });
      return;
    }

    onImport(preview);
    setFile(null);
    setPreview([]);
    onClose();

    toast({
      title: "Import Successful",
      description: `Imported ${preview.length} expenses`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Import from Excel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Excel File</label>
            <Input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Excel file should contain amount, category, date, and description
              information
            </p>
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Preview ({preview.length} items)
              </h3>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {preview.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-sm border-b py-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        ₹{item.amount.toFixed(2)}
                      </span>
                      <span className="text-gray-600">{item.category}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{item.date.toLocaleDateString()}</span>
                      <span>{item.description}</span>
                    </div>
                  </div>
                ))}
                {preview.length > 5 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    ...and {preview.length - 5} more items
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={preview.length === 0}>
            Import {preview.length} Expenses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImport;
