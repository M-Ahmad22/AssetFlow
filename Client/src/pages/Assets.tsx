import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AssetStatus } from "@/data/assets";
import { Search, Filter, Plus, Eye, Edit, Trash2, X } from "lucide-react";

export default function Assets() {
  const { assets, categories, locations, deleteAsset } = useInventory();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories
          .find((c) => c.id === asset.categoryId)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;

      const matchesLocation =
        locationFilter === "all" || asset.locationId === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [assets, searchTerm, statusFilter, locationFilter, categories]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.name || "Unknown";
  };

  const handleDelete = (id: string) => {
    deleteAsset(id);
    setShowDeleteModal(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || locationFilter !== "all";

  return (
    <Layout title="Assets" description="Manage your inventory assets">
      <div className="enterprise-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, serial number, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="enterprise-input pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AssetStatus | "all")
                }
                className="enterprise-select w-36"
              >
                <option value="all">All Status</option>
                <option value="In Use">In Use</option>
                <option value="Available">Available</option>
                <option value="In Stock">In Stock</option>
                <option value="In Repair">In Repair</option>
              </select>
            </div>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="enterprise-select w-40"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-ghost text-sm gap-1"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}

            {hasPermission("canCreate") && (
              <Link to="/assets/new" className="btn-primary gap-2">
                <Plus className="h-4 w-4" />
                Add Asset
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAssets.length} of {assets.length} assets
        </p>
      </div>

      <div className="enterprise-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Serial Number</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Qty</th>
                <th>Purchase Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No assets found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">
                          {asset.name}
                        </p>
                        {asset.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {asset.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground">
                      {asset.serialNumber}
                    </td>
                    <td>{getCategoryName(asset.categoryId)}</td>
                    <td>{getLocationName(asset.locationId)}</td>
                    <td>
                      <StatusBadge status={asset.status} />
                    </td>
                    <td>
                      <span
                        className={`font-medium ${
                          asset.quantity < 5
                            ? "text-[hsl(var(--warning))]"
                            : "text-foreground"
                        }`}
                      >
                        {asset.quantity}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {new Date(asset.purchaseDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/assets/${asset.id}`)}
                          className="btn-ghost p-2"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(hasPermission("canUpdate") ||
                          hasPermission("canUpdateStatus")) && (
                          <button
                            onClick={() => navigate(`/assets/${asset.id}/edit`)}
                            className="btn-ghost p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission("canDelete") && (
                          <button
                            onClick={() => setShowDeleteModal(asset.id)}
                            className="btn-ghost p-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="enterprise-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Asset
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this asset? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="btn-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
