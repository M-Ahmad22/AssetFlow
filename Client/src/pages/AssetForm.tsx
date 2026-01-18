import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/context/InventoryContext';
import { useAuth } from '@/context/AuthContext';
import { locations } from '@/data/locations';
import { AssetStatus, Asset } from '@/data/assets';
import { ArrowLeft, Save } from 'lucide-react';

const statusOptions: AssetStatus[] = ['In Use', 'In Repair', 'In Stock', 'Available'];

export default function AssetForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, addAsset, updateAsset, getAssetById } = useInventory();
  const { hasPermission, user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    categoryId: '',
    purchaseDate: '',
    status: 'Available' as AssetStatus,
    locationId: '',
    quantity: 1,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check permissions
  const canEditAll = hasPermission('canUpdate');
  const canEditStatusLocation = hasPermission('canUpdateStatus');
  const isManager = user?.role === 'Manager';

  useEffect(() => {
    if (isEditing && id) {
      const asset = getAssetById(id);
      if (asset) {
        setFormData({
          name: asset.name,
          serialNumber: asset.serialNumber,
          categoryId: asset.categoryId,
          purchaseDate: asset.purchaseDate,
          status: asset.status,
          locationId: asset.locationId,
          quantity: asset.quantity,
          notes: asset.notes || '',
        });
      }
    }
  }, [id, isEditing, getAssetById]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isManager) {
      if (!formData.name.trim()) newErrors.name = 'Asset name is required';
      if (!formData.serialNumber.trim())
        newErrors.serialNumber = 'Serial number is required';
      if (!formData.categoryId) newErrors.categoryId = 'Category is required';
      if (!formData.purchaseDate)
        newErrors.purchaseDate = 'Purchase date is required';
      if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.locationId) newErrors.locationId = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditing && id) {
      if (isManager) {
        // Manager can only update status and location
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

    navigate('/assets');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isFieldDisabled = (fieldName: string) => {
    if (isManager && isEditing) {
      return !['status', 'locationId'].includes(fieldName);
    }
    return false;
  };

  return (
    <Layout
      title={isEditing ? 'Edit Asset' : 'Add New Asset'}
      description={
        isEditing
          ? isManager
            ? 'Update asset status and location'
            : 'Modify asset details'
          : 'Add a new asset to inventory'
      }
    >
      <button
        onClick={() => navigate('/assets')}
        className="btn-ghost gap-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assets
      </button>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="enterprise-card p-6 space-y-6">
          {isManager && isEditing && (
            <div className="bg-[hsl(var(--warning)/0.1)] border border-[hsl(var(--warning)/0.3)] rounded-lg p-4 mb-6">
              <p className="text-sm text-[hsl(var(--warning))]">
                As a Manager, you can only update the Status and Location fields.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset Name */}
            <div className="md:col-span-2">
              <label className="enterprise-label">Asset Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isFieldDisabled('name')}
                className={`enterprise-input ${
                  errors.name ? 'border-destructive' : ''
                } ${isFieldDisabled('name') ? 'bg-muted opacity-60' : ''}`}
                placeholder="e.g., Dell XPS 15 Laptop"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Serial Number */}
            <div>
              <label className="enterprise-label">Serial Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                disabled={isFieldDisabled('serialNumber')}
                className={`enterprise-input ${
                  errors.serialNumber ? 'border-destructive' : ''
                } ${isFieldDisabled('serialNumber') ? 'bg-muted opacity-60' : ''}`}
                placeholder="e.g., DXP-2024-001"
              />
              {errors.serialNumber && (
                <p className="text-destructive text-sm mt-1">
                  {errors.serialNumber}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="enterprise-label">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isFieldDisabled('categoryId')}
                className={`enterprise-select ${
                  errors.categoryId ? 'border-destructive' : ''
                } ${isFieldDisabled('categoryId') ? 'bg-muted opacity-60' : ''}`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-destructive text-sm mt-1">
                  {errors.categoryId}
                </p>
              )}
            </div>

            {/* Purchase Date */}
            <div>
              <label className="enterprise-label">Purchase Date *</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                disabled={isFieldDisabled('purchaseDate')}
                className={`enterprise-input ${
                  errors.purchaseDate ? 'border-destructive' : ''
                } ${isFieldDisabled('purchaseDate') ? 'bg-muted opacity-60' : ''}`}
              />
              {errors.purchaseDate && (
                <p className="text-destructive text-sm mt-1">
                  {errors.purchaseDate}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="enterprise-label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isFieldDisabled('quantity')}
                className={`enterprise-input ${
                  errors.quantity ? 'border-destructive' : ''
                } ${isFieldDisabled('quantity') ? 'bg-muted opacity-60' : ''}`}
              />
              {errors.quantity && (
                <p className="text-destructive text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="enterprise-label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`enterprise-select ${
                  errors.status ? 'border-destructive' : ''
                }`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-destructive text-sm mt-1">{errors.status}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="enterprise-label">Location *</label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className={`enterprise-select ${
                  errors.locationId ? 'border-destructive' : ''
                }`}
              >
                <option value="">Select location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <p className="text-destructive text-sm mt-1">
                  {errors.locationId}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="enterprise-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={isFieldDisabled('notes')}
                rows={3}
                className={`enterprise-input resize-none ${
                  isFieldDisabled('notes') ? 'bg-muted opacity-60' : ''
                }`}
                placeholder="Additional notes about this asset..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/assets')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary gap-2">
              <Save className="h-4 w-4" />
              {isEditing ? 'Update Asset' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
