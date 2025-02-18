import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MobileLayout from "./components/layouts/MobileLayout";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <MobileLayout>
        <Routes>
          <Route path="/" element={<AddExpense />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MobileLayout>
    </Suspense>
  );
}

export default App;
