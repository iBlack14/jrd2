import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// import Panel from "./pages/Panel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/dashboard/Layout";
import DashboardHome from "./pages/dashboard/Home";
import { Placeholder } from "./pages/dashboard/Placeholders";
import UsersPage from "./pages/dashboard/Users";
import FormBuilder from "./pages/dashboard/FormBuilder";
import RequestsPage from "./pages/dashboard/Requests";
import MessagesPage from "./pages/dashboard/Messages";
import SiteHeader from "@/components/site/Header";
import SiteFooter from "@/components/site/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="casos" element={<RequestsPage />} />
                  <Route path="clientes" element={<Placeholder title="Clientes" />} />
                  <Route path="audiencias" element={<FormBuilder />} />
                  <Route path="analitica" element={<Placeholder title="Analítica" />} />
                  <Route path="mensajes" element={<MessagesPage />} />
                  <Route path="alertas" element={<Placeholder title="Alertas" />} />
                  <Route path="buscar" element={<Placeholder title="Buscar" />} />
                  <Route path="tiempos" element={<Placeholder title="Tiempos" />} />
                  <Route path="clientes" element={<Placeholder title="Clientes" />} />
                  <Route path="usuarios" element={<UsersPage />} />
                  <Route path="permisos" element={<Placeholder title="Permisos" />} />
                  <Route path="ajustes" element={<Placeholder title="Ajustes" />} />
                </Route>
                <Route path="/panel" element={<Navigate to="/dashboard" replace />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <SiteFooter />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
