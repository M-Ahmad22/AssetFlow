import { AssetStatus } from '@/data/assets';

interface StatusBadgeProps {
  status: AssetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusClass = () => {
    switch (status) {
      case 'Available':
        return 'status-badge status-available';
      case 'In Use':
        return 'status-badge status-in-use';
      case 'In Repair':
        return 'status-badge status-in-repair';
      case 'In Stock':
        return 'status-badge status-in-stock';
      default:
        return 'status-badge';
    }
  };

  return <span className={getStatusClass()}>{status}</span>;
}
