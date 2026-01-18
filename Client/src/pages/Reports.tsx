import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/context/InventoryContext';
import { locations } from '@/data/locations';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  MapPin,
  AlertTriangle,
  Printer,
  Download,
  FileBarChart,
} from 'lucide-react';

type ReportTab = 'by-location' | 'low-stock';

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as ReportTab) || 'by-location';
  const [activeTab, setActiveTab] = useState<ReportTab>(initialTab);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    locations[0]?.id || ''
  );

  const { assets, categories } = useInventory();

  const handleTabChange = (tab: ReportTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Assets by Location
  const assetsByLocation = useMemo(() => {
    return assets.filter((a) => a.locationId === selectedLocation);
  }, [assets, selectedLocation]);

  // Low Stock Items (quantity < 5)
  const lowStockItems = useMemo(() => {
    return assets.filter((a) => a.quantity < 5);
  }, [assets]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.name || 'Unknown';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout title="Reports" description="Inventory analytics and reports">
      {/* Tabs */}
      <div className="enterprise-card mb-6">
        <div className="flex border-b border-border">
          <button
            onClick={() => handleTabChange('by-location')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'by-location'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Assets by Location
          </button>
          <button
            onClick={() => handleTabChange('low-stock')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'low-stock'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
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

      {/* Report Content */}
      {activeTab === 'by-location' && (
        <div className="space-y-4">
          {/* Location Selector */}
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

          {/* Report Header */}
          <div className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Assets at {getLocationName(selectedLocation)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generated on {new Date().toLocaleDateString()} •{' '}
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

      {activeTab === 'low-stock' && (
        <div className="space-y-4">
          {/* Report Actions */}
          <div className="enterprise-card p-4 no-print">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing items with quantity less than 5 units
              </p>
              <button onClick={handlePrint} className="btn-secondary gap-2">
                <Printer className="h-4 w-4" />
                Print Report
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Low Stock Alert Report
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generated on {new Date().toLocaleDateString()} •{' '}
                  {lowStockItems.length} items need attention
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>

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
                                ? 'text-destructive'
                                : 'text-[hsl(var(--warning))]'
                            }`}
                          >
                            {asset.quantity}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              isCritical
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]'
                            }`}
                          >
                            {isCritical ? 'Critical' : 'Low'}
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

          {/* Summary by Category */}
          {lowStockItems.length > 0 && (
            <div className="enterprise-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Summary by Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const catLowStock = lowStockItems.filter(
                    (a) => a.categoryId === cat.id
                  );
                  if (catLowStock.length === 0) return null;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-lg border border-border"
                    >
                      <p className="font-medium text-foreground">{cat.name}</p>
                      <p className="text-2xl font-bold text-[hsl(var(--warning))] mt-1">
                        {catLowStock.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        items low on stock
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
