import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { ProtectedRoute } from "@/components/routes/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import AssetForm from "./pages/AssetForm";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InventoryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Assets */}
              <Route
                path="/assets"
                element={
                  <ProtectedRoute>
                    <Assets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assets/new"
                element={
                  <ProtectedRoute requiredPermission="canCreate">
                    <AssetForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assets/:id"
                element={
                  <ProtectedRoute>
                    <AssetDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assets/:id/edit"
                element={
                  <ProtectedRoute>
                    <AssetForm />
                  </ProtectedRoute>
                }
              />

              {/* Categories - Admin Only */}
              <Route
                path="/categories"
                element={
                  <ProtectedRoute requiredPermission="canManageCategories">
                    <Categories />
                  </ProtectedRoute>
                }
              />

              {/* Users - Admin Only */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredPermission="canManageUsers">
                    <Users />
                  </ProtectedRoute>
                }
              />

              {/* Reports */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InventoryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
