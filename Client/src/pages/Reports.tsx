import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useInventory } from "@/context/InventoryContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MapPin, AlertTriangle, Printer, FileBarChart } from "lucide-react";

type ReportTab = "by-location" | "low-stock";

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as ReportTab) || "by-location";
  const [activeTab, setActiveTab] = useState<ReportTab>(initialTab);

  const { assets, categories, locations, fetchLocations } = useInventory();

  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (!selectedLocation && locations.length > 0) {
      setSelectedLocation(locations[0].id);
    }
  }, [locations, selectedLocation]);

  const handleTabChange = (tab: ReportTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const assetsByLocation = useMemo(() => {
    if (!selectedLocation) return [];
    return assets.filter((a) => a.locationId === selectedLocation);
  }, [assets, selectedLocation]);

  const lowStockItems = useMemo(() => {
    return assets.filter((a) => a.quantity < 5);
  }, [assets]);

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Unknown";

  const getLocationName = (locationId: string) =>
    locations.find((l) => l.id === locationId)?.name || "Unknown";

  const handlePrint = () => window.print();

  return (
    <Layout title="Reports" description="Inventory analytics and reports">
      {/* Tabs */}
      <div className="enterprise-card mb-6">
        <div className="flex border-b border-border">
          <button
            onClick={() => handleTabChange("by-location")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "by-location"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Assets by Location
          </button>

          <button
            onClick={() => handleTabChange("low-stock")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "low-stock"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Low Stock Report
            {lowStockItems.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] rounded-full">
                {lowStockItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "by-location" && (
        <div className="space-y-4">
          <div className="enterprise-card p-4 no-print">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground">
                  Select Location:
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="enterprise-select w-48"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handlePrint} className="btn-secondary gap-2">
                <Printer className="h-4 w-4" />
                Print Report
              </button>
            </div>
          </div>

          <div className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Assets at {getLocationName(selectedLocation)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generated on {new Date().toLocaleDateString()} •{" "}
                  {assetsByLocation.length} assets found
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
            </div>

            {assetsByLocation.length > 0 ? (
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Serial Number</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {assetsByLocation.map((asset) => (
                    <tr key={asset.id}>
                      <td className="font-medium">{asset.name}</td>
                      <td className="font-mono text-muted-foreground">
                        {asset.serialNumber}
                      </td>
                      <td>{getCategoryName(asset.categoryId)}</td>
                      <td>
                        <StatusBadge status={asset.status} />
                      </td>
                      <td>{asset.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <FileBarChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No assets found at this location
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "low-stock" && (
        <div className="space-y-4">
          <div className="enterprise-card p-4 no-print flex justify-between">
            <p className="text-sm text-muted-foreground">
              Showing items with quantity less than 5 units
            </p>
            <button onClick={handlePrint} className="btn-secondary gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </button>
          </div>

          <div className="enterprise-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Low Stock Alert Report
            </h2>

            {lowStockItems.length > 0 ? (
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Current Qty</th>
                    <th>Alert Level</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((asset) => {
                    const isCritical = asset.quantity <= 2;
                    return (
                      <tr key={asset.id}>
                        <td className="font-medium">{asset.name}</td>
                        <td>{getCategoryName(asset.categoryId)}</td>
                        <td>{getLocationName(asset.locationId)}</td>
                        <td>
                          <StatusBadge status={asset.status} />
                        </td>
                        <td>
                          <span
                            className={`font-bold ${
                              isCritical
                                ? "text-destructive"
                                : "text-[hsl(var(--warning))]"
                            }`}
                          >
                            {asset.quantity}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              isCritical
                                ? "bg-destructive/10 text-destructive"
                                : "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]"
                            }`}
                          >
                            {isCritical ? "Critical" : "Low"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] mx-auto mb-4">
                  <FileBarChart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  All Stock Levels Healthy
                </h3>
                <p className="text-muted-foreground">
                  No items are currently below the minimum threshold
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
