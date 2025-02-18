import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PlusCircle, BarChart2 } from "lucide-react";

const MobileLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 columns-2">
      <main className="flex-1 pb-16 shrink-0 grow-0">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
        <div className="flex h-full items-center justify-around">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center space-y-1 ${location.pathname === "/dashboard" ? "text-blue-600" : "text-gray-600"}`}
          >
            <BarChart2 className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 ${location.pathname === "/" ? "text-blue-600" : "text-gray-600"}`}
          >
            <PlusCircle className="h-6 w-6" />
            <span className="text-xs">Add Expense</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
