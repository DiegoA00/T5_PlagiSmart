import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster richColors />
    </AuthProvider>
  );
}
