import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useInventory } from "@/context/InventoryContext";
import { Plus, Edit, Trash2, X, Save, MapPin } from "lucide-react";

export default function Locations() {
  const { locations, assets, addLocation, updateLocation, deleteLocation } =
    useInventory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "office",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAssetCount = (locationId: string) =>
    assets.filter((a) => a.locationId === locationId).length;

  const resetForm = () => {
    setFormData({ name: "", address: "", type: "office" });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const loc = locations.find((l) => l.id === id);
    if (!loc) return;

    setFormData({
      name: loc.name,
      address: loc.address ?? "",
      type: loc.type,
    });
    setEditingId(id);
    setShowForm(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Location name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    editingId ? updateLocation(editingId, formData) : addLocation(formData);

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteLocation(id);
    setShowDeleteModal(null);
  };

  const locationToDelete = showDeleteModal
    ? locations.find((l) => l.id === showDeleteModal)
    : null;

  const assetsInLocation = showDeleteModal ? getAssetCount(showDeleteModal) : 0;

  return (
    <Layout
      title="Location Management"
      description="Manage physical and logical asset locations"
    >
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {locations.length} locations configured
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        )}
      </div>

      {showForm && (
        <div className="enterprise-card p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingId ? "Edit Location" : "Add New Location"}
            </h3>
            <button onClick={resetForm} className="btn-ghost p-2">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="enterprise-label">Location Name *</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                className={`enterprise-input ${
                  errors.name ? "border-destructive" : ""
                }`}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="enterprise-label">Address</label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, address: e.target.value }))
                }
                className="enterprise-input"
              />
            </div>

            <div>
              <label className="enterprise-label">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, type: e.target.value }))
                }
                className="enterprise-input"
              >
                <option value="office">Office</option>
                <option value="warehouse">Warehouse</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((l) => (
          <div key={l.id} className="enterprise-card p-5">
            <div className="flex justify-between mb-3">
              <div className="flex gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{l.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getAssetCount(l.id)} assets
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(l.id)}
                  className="btn-ghost p-2"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(l.id)}
                  className="btn-ghost p-2 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{l.address}</p>
          </div>
        ))}
      </div>

      {showDeleteModal && locationToDelete && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50">
          <div className="enterprise-card p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Delete Location</h3>
            <p className="mb-4">Delete "{locationToDelete.name}"?</p>

            {assetsInLocation > 0 && (
              <div className="bg-warning/10 border border-warning/30 p-4 mb-4 rounded">
                ⚠ {assetsInLocation} assets are assigned to this location.
              </div>
            )}

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
