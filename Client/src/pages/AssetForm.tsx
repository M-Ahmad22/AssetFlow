import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useInventory } from "@/context/InventoryContext";
import { useAuth } from "@/context/AuthContext";
import { AssetStatus } from "@/data/assets";
import { ArrowLeft, Save } from "lucide-react";

const statusOptions: AssetStatus[] = [
  "In Use",
  "In Repair",
  "In Stock",
  "Available",
];

export default function AssetForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    categories,
    locations,
    addAsset,
    updateAsset,
    getAssetById,
    fetchLocations,
  } = useInventory();

  const { hasPermission, user } = useAuth();

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    categoryId: "",
    purchaseDate: "",
    status: "Available" as AssetStatus,
    locationId: "",
    quantity: 1,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isManager = user?.role === "Manager";

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (!isEditing || !id) return;

    const asset = getAssetById(id);
    if (!asset) return;

    setFormData({
      name: asset.name,
      serialNumber: asset.serialNumber,
      categoryId: asset.categoryId,
      purchaseDate: asset.purchaseDate,
      status: asset.status,
      locationId: asset.locationId,
      quantity: asset.quantity,
      notes: asset.notes || "",
    });
  }, [id, isEditing, getAssetById]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isManager) {
      if (!formData.name.trim()) newErrors.name = "Asset name is required";
      if (!formData.serialNumber.trim())
        newErrors.serialNumber = "Serial number is required";
      if (!formData.categoryId) newErrors.categoryId = "Category is required";
      if (!formData.purchaseDate)
        newErrors.purchaseDate = "Purchase date is required";
      if (formData.quantity < 1)
        newErrors.quantity = "Quantity must be at least 1";
    }

    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.locationId) newErrors.locationId = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && id) {
      if (isManager) {
        updateAsset(id, {
          status: formData.status,
          locationId: formData.locationId,
        });
      } else {
        updateAsset(id, formData);
      }
    } else {
      addAsset(formData);
    }

    navigate("/assets");
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isFieldDisabled = (field: string) => {
    if (isManager && isEditing) {
      return !["status", "locationId"].includes(field);
    }
    return false;
  };

  return (
    <Layout
      title={isEditing ? "Edit Asset" : "Add New Asset"}
      description={
        isEditing
          ? isManager
            ? "Update asset status and location"
            : "Modify asset details"
          : "Add a new asset to inventory"
      }
    >
      <button
        onClick={() => navigate("/assets")}
        className="btn-ghost gap-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assets
      </button>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="enterprise-card p-6 space-y-6">
          {isManager && isEditing && (
            <div className="bg-[hsl(var(--warning)/0.1)] border border-[hsl(var(--warning)/0.3)] rounded-lg p-4">
              <p className="text-sm text-[hsl(var(--warning))]">
                Managers can only update Status and Location.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div className="md:col-span-2">
              <label className="enterprise-label">Asset Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isFieldDisabled("name")}
                className="enterprise-input"
              />
            </div>

            {/* SERIAL */}
            <div>
              <label className="enterprise-label">Serial Number *</label>
              <input
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                disabled={isFieldDisabled("serialNumber")}
                className="enterprise-input"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="enterprise-label">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isFieldDisabled("categoryId")}
                className="enterprise-select"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PURCHASE DATE */}
            <div>
              <label className="enterprise-label">Purchase Date *</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                disabled={isFieldDisabled("purchaseDate")}
                className="enterprise-input"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="enterprise-label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                min={1}
                value={formData.quantity}
                onChange={handleChange}
                disabled={isFieldDisabled("quantity")}
                className="enterprise-input"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="enterprise-label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="enterprise-select"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION (🔥 FIXED) */}
            <div>
              <label className="enterprise-label">Location *</label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="enterprise-select"
              >
                <option value="">Select location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* NOTES */}
            <div className="md:col-span-2">
              <label className="enterprise-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="enterprise-input resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/assets")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary gap-2">
              <Save className="h-4 w-4" />
              {isEditing ? "Update Asset" : "Create Asset"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
