export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'office' | 'warehouse' | 'remote';
}

export const locations: Location[] = [
  {
    id: '1',
    name: 'Office A',
    address: '123 Main Street, Floor 1',
    type: 'office',
  },
  {
    id: '2',
    name: 'Office B',
    address: '123 Main Street, Floor 2',
    type: 'office',
  },
  {
    id: '3',
    name: 'Warehouse 1',
    address: '456 Industrial Blvd',
    type: 'warehouse',
  },
  {
    id: '4',
    name: 'Warehouse 2',
    address: '789 Storage Ave',
    type: 'warehouse',
  },
  {
    id: '5',
    name: 'Remote Employee',
    address: 'Various Locations',
    type: 'remote',
  },
];
