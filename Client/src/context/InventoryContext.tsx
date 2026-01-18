import React, { createContext, useContext, useState, useCallback } from 'react';
import { Asset, initialAssets, AssetStatus } from '@/data/assets';
import { Category, initialCategories } from '@/data/categories';

interface InventoryContextType {
  assets: Asset[];
  categories: Category[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getCategoryById: (id: string) => Category | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addAsset = useCallback((asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
    };
    setAssets((prev) => [...prev, newAsset]);
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...updates } : asset))
    );
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  const getAssetById = useCallback(
    (id: string) => assets.find((asset) => asset.id === id),
    [assets]
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((cat) => cat.id === id),
    [categories]
  );

  return (
    <InventoryContext.Provider
      value={{
        assets,
        categories,
        addAsset,
        updateAsset,
        deleteAsset,
        addCategory,
        updateCategory,
        deleteCategory,
        getAssetById,
        getCategoryById,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
