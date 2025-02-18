import React from "react";
import { cn } from "@/lib/utils";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onDateClick: () => void;
  onSubmit: () => void;
}

const NumericKeypad = ({
  onNumberClick,
  onDelete,
  onDateClick,
  onSubmit,
}: NumericKeypadProps) => {
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "0", "."];

  return (
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      {buttons.map((btn) => (
        <button
          key={btn}
          onClick={() => onNumberClick(btn === "$" ? "" : btn)}
          className={cn(
            "h-14 w-14 rounded-full text-xl font-medium flex items-center justify-center",
            btn === "$" ? "bg-yellow-50" : "bg-gray-100",
          )}
        >
          {btn}
        </button>
      ))}
      <button
        onClick={onDelete}
        className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center text-xl"
      >
        ←
      </button>
      <button
        onClick={onDateClick}
        className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-xl"
      >
        📅
      </button>
      <button
        onClick={onSubmit}
        className="h-14 w-[56px] rounded-[28px] bg-black text-white flex items-center justify-center text-xl"
      >
        ✓
      </button>
    </div>
  );
};

export default NumericKeypad;
