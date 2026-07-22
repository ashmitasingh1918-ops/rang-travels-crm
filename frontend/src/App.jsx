import MainLayout from "./layout/MainLayout";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <MainLayout />
    </>
  );
}

export default App;