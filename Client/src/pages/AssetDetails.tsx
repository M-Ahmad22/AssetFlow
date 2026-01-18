import { Layout } from "@/components/layout/Layout";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "react-router-dom";
import {
  Package,
  FolderTree,
  MapPin,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const { assets, categories, locations } = useInventory();
  const { user } = useAuth();

  const totalAssets = assets.length;
  const totalCategories = categories.length;
  const totalLocations = locations.length;
  const lowStockItems = assets.filter((a) => a.quantity < 5).length;

  const statusCounts = {
    "In Use": assets.filter((a) => a.status === "In Use").length,
    Available: assets.filter((a) => a.status === "Available").length,
    "In Stock": assets.filter((a) => a.status === "In Stock").length,
    "In Repair": assets.filter((a) => a.status === "In Repair").length,
  };

  const recentAssets = [...assets]
    .sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    )
    .slice(0, 5);

  return (
    <Layout
      title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
      description="Here's an overview of your inventory system"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-card-value">{totalAssets}</p>
              <p className="stat-card-label">Total Assets</p>
            </div>
            <div className="stat-card-icon bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-card-value">{totalCategories}</p>
              <p className="stat-card-label">Categories</p>
            </div>
            <div className="stat-card-icon bg-[hsl(var(--info)/0.1)] text-[hsl(var(--info))]">
              <FolderTree className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-card-value">{totalLocations}</p>
              <p className="stat-card-label">Locations</p>
            </div>
            <div className="stat-card-icon bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-card-value">{lowStockItems}</p>
              <p className="stat-card-label">Low Stock Items</p>
            </div>
            <div className="stat-card-icon bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="enterprise-card p-5">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Asset Status Overview
          </h3>

          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage =
                totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;

              return (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status as any} />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="enterprise-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Assets
            </h3>
            <Link
              to="/assets"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Serial Number</th>
                  <th>Status</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.length > 0 ? (
                  recentAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="font-medium">{asset.name}</td>
                      <td className="text-muted-foreground">
                        {asset.serialNumber}
                      </td>
                      <td>
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="text-muted-foreground">
                        {new Date(asset.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-muted-foreground py-6"
                    >
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/assets"
            className="enterprise-card p-4 hover:border-primary transition-colors flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Assets</p>
              <p className="text-sm text-muted-foreground">
                Browse all inventory
              </p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="enterprise-card p-4 hover:border-primary transition-colors flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--info)/0.1)] text-[hsl(var(--info))]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Reports</p>
              <p className="text-sm text-muted-foreground">
                Analytics & insights
              </p>
            </div>
          </Link>

          <Link
            to="/reports?tab=low-stock"
            className="enterprise-card p-4 hover:border-primary transition-colors flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockItems} items need attention
              </p>
            </div>
          </Link>

          <Link
            to="/reports?tab=by-location"
            className="enterprise-card p-4 hover:border-primary transition-colors flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">By Location</p>
              <p className="text-sm text-muted-foreground">
                Assets per location
              </p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
