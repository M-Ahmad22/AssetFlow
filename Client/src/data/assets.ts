export type AssetStatus = 'In Use' | 'In Repair' | 'In Stock' | 'Available';

export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  purchaseDate: string;
  status: AssetStatus;
  locationId: string;
  quantity: number;
  notes?: string;
}

export const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Dell XPS 15 Laptop',
    serialNumber: 'DXP-2024-001',
    categoryId: '1',
    purchaseDate: '2024-01-15',
    status: 'In Use',
    locationId: '1',
    quantity: 15,
    notes: 'Developer workstations',
  },
  {
    id: '2',
    name: 'HP LaserJet Pro Printer',
    serialNumber: 'HLP-2023-045',
    categoryId: '1',
    purchaseDate: '2023-06-20',
    status: 'Available',
    locationId: '1',
    quantity: 3,
  },
  {
    id: '3',
    name: 'Herman Miller Aeron Chair',
    serialNumber: 'HMA-2024-102',
    categoryId: '2',
    purchaseDate: '2024-02-10',
    status: 'In Use',
    locationId: '1',
    quantity: 25,
  },
  {
    id: '4',
    name: 'Standing Desk - Electric',
    serialNumber: 'SDE-2023-078',
    categoryId: '2',
    purchaseDate: '2023-08-05',
    status: 'In Stock',
    locationId: '3',
    quantity: 12,
  },
  {
    id: '5',
    name: 'Dewalt Power Drill Set',
    serialNumber: 'DPD-2022-033',
    categoryId: '3',
    purchaseDate: '2022-11-30',
    status: 'In Repair',
    locationId: '4',
    quantity: 2,
  },
  {
    id: '6',
    name: 'MacBook Pro 16"',
    serialNumber: 'MBP-2024-089',
    categoryId: '1',
    purchaseDate: '2024-03-01',
    status: 'In Use',
    locationId: '5',
    quantity: 8,
    notes: 'Remote developer machines',
  },
  {
    id: '7',
    name: 'Cisco Network Switch 48-Port',
    serialNumber: 'CNS-2023-012',
    categoryId: '1',
    purchaseDate: '2023-04-15',
    status: 'In Use',
    locationId: '3',
    quantity: 4,
  },
  {
    id: '8',
    name: 'Conference Table - Large',
    serialNumber: 'CTL-2024-005',
    categoryId: '2',
    purchaseDate: '2024-01-20',
    status: 'In Use',
    locationId: '2',
    quantity: 2,
  },
  {
    id: '9',
    name: 'Tool Cabinet - Rolling',
    serialNumber: 'TCR-2023-067',
    categoryId: '3',
    purchaseDate: '2023-09-10',
    status: 'Available',
    locationId: '4',
    quantity: 3,
  },
  {
    id: '10',
    name: 'Dell Monitor 27"',
    serialNumber: 'DM27-2024-156',
    categoryId: '1',
    purchaseDate: '2024-02-28',
    status: 'In Stock',
    locationId: '3',
    quantity: 4,
    notes: 'Low stock - reorder needed',
  },
  {
    id: '11',
    name: 'Multimeter Digital Pro',
    serialNumber: 'MDP-2022-089',
    categoryId: '3',
    purchaseDate: '2022-07-15',
    status: 'Available',
    locationId: '4',
    quantity: 2,
  },
  {
    id: '12',
    name: 'Ergonomic Keyboard Set',
    serialNumber: 'EKS-2024-201',
    categoryId: '1',
    purchaseDate: '2024-03-10',
    status: 'In Stock',
    locationId: '3',
    quantity: 3,
  },
];
