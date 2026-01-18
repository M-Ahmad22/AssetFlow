import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/context/InventoryContext';
import { Plus, Edit, Trash2, X, Save, FolderTree } from 'lucide-react';

export default function Categories() {
  const { categories, assets, addCategory, updateCategory, deleteCategory } =
    useInventory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAssetCount = (categoryId: string) => {
    return assets.filter((a) => a.categoryId === categoryId).length;
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setFormData({ name: category.name, description: category.description });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory({ ...formData, icon: 'Package' });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setShowDeleteModal(null);
  };

  const categoryToDelete = showDeleteModal
    ? categories.find((c) => c.id === showDeleteModal)
    : null;
  const assetsInCategory = showDeleteModal ? getAssetCount(showDeleteModal) : 0;

  return (
    <Layout
      title="Category Management"
      description="Manage asset categories for your inventory"
    >
      {/* Add Category Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {categories.length} categories configured
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="enterprise-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button onClick={resetForm} className="btn-ghost p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="enterprise-label">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`enterprise-input ${
                  errors.name ? 'border-destructive' : ''
                }`}
                placeholder="e.g., Electronics"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="enterprise-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="enterprise-input resize-none"
                placeholder="Brief description of this category..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary gap-2">
                <Save className="h-4 w-4" />
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="enterprise-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getAssetCount(category.id)} assets
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(category.id)}
                  className="btn-ghost p-2"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(category.id)}
                  className="btn-ghost p-2 text-destructive hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="enterprise-card p-8 text-center">
          <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Categories Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create your first category to organize your assets.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="enterprise-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Category
            </h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete "{categoryToDelete.name}"?
            </p>
            {assetsInCategory > 0 && (
              <div className="bg-[hsl(var(--warning)/0.1)] border border-[hsl(var(--warning)/0.3)] rounded-lg p-4 mb-4">
                <p className="text-sm text-[hsl(var(--warning))]">
                  Warning: This category has {assetsInCategory} asset
                  {assetsInCategory > 1 ? 's' : ''} assigned to it. Deleting
                  this category may cause issues.
                </p>
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
