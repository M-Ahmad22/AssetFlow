import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/context/InventoryContext';
import { useAuth } from '@/context/AuthContext';
import { locations } from '@/data/locations';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  MapPin,
  Calendar,
  Tag,
  Hash,
  FileText,
} from 'lucide-react';
import { useState } from 'react';

export default function AssetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssetById, getCategoryById, deleteAsset } = useInventory();
  const { hasPermission } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const asset = id ? getAssetById(id) : undefined;
  const category = asset ? getCategoryById(asset.categoryId) : undefined;
  const location = asset
    ? locations.find((l) => l.id === asset.locationId)
    : undefined;

  if (!asset) {
    return (
      <Layout title="Asset Not Found">
        <div className="enterprise-card p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Asset Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The asset you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/assets" className="btn-primary">
            Back to Assets
          </Link>
        </div>
      </Layout>
    );
  }

  const handleDelete = () => {
    deleteAsset(asset.id);
    navigate('/assets');
  };

  return (
    <Layout title="Asset Details" description={asset.name}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/assets')}
        className="btn-ghost gap-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="enterprise-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {asset.name}
                </h2>
                <p className="text-muted-foreground mt-1 font-mono">
                  {asset.serialNumber}
                </p>
              </div>
              <StatusBadge status={asset.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">
                    {category?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">
                    {location?.name || 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--info)/0.1)] text-[hsl(var(--info))]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(asset.purchaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p
                    className={`font-medium ${
                      asset.quantity < 5
                        ? 'text-[hsl(var(--warning))]'
                        : 'text-foreground'
                    }`}
                  >
                    {asset.quantity} units
                    {asset.quantity < 5 && (
                      <span className="text-sm ml-2">(Low Stock)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {asset.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-foreground mt-1">{asset.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="enterprise-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              {(hasPermission('canUpdate') || hasPermission('canUpdateStatus')) && (
                <Link
                  to={`/assets/${asset.id}/edit`}
                  className="btn-primary w-full gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Asset
                </Link>
              )}
              {hasPermission('canDelete') && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-destructive w-full gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Asset
                </button>
              )}
            </div>
          </div>

          <div className="enterprise-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Location Details
            </h3>
            {location && (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Name: </span>
                  <span className="text-foreground">{location.name}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Address: </span>
                  <span className="text-foreground">{location.address}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Type: </span>
                  <span className="text-foreground capitalize">
                    {location.type}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="enterprise-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Asset
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{asset.name}"? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-destructive">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
