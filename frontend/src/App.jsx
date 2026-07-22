import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </>
  );
}

export default App;