import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Asset } from "@/data/assets";
import { Category } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: string;
}

interface InventoryContextType {
  assets: Asset[];
  categories: Category[];
  locations: Location[];
  loading: boolean;

  fetchAssets: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchLocations: () => Promise<void>;

  addAsset: (asset: Omit<Asset, "id">) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addLocation: (location: Omit<Location, "id">) => Promise<void>;
  updateLocation: (id: string, updates: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;

  getAssetById: (id: string) => Asset | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getLocationById: (id: string) => Location | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/assets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();

      setAssets(
        Array.isArray(data)
          ? data.map((a: any) => ({
              id: a._id,
              name: a.name,
              serialNumber: a.serialNumber,
              purchaseDate: a.purchaseDate,
              status: a.status,
              quantity: a.quantity,
              notes: a.notes ?? "",
              categoryId:
                typeof a.category === "object" ? a.category._id : a.category,
              locationId:
                typeof a.location === "object" ? a.location._id : a.location,
            }))
          : []
      );
    } catch {
      setAssets([]);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();

      setCategories(
        Array.isArray(data)
          ? data.map((c: any) => ({
              id: c._id,
              name: c.name,
              description: c.description ?? "",
              icon: c.icon ?? "Package",
            }))
          : []
      );
    } catch {
      setCategories([]);
    }
  }, [token]);

  const fetchLocations = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();

      setLocations(
        Array.isArray(data)
          ? data.map((l: any) => ({
              id: l._id,
              name: l.name,
              address: l.address ?? "",
              type: l.type ?? "office",
            }))
          : []
      );
    } catch {
      setLocations([]);
    }
  }, [token]);

  const addAsset = async (asset: Omit<Asset, "id">) => {
    await fetch(`${API_BASE}/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...asset,
        category: asset.categoryId,
        location: asset.locationId,
      }),
    });

    await fetchAssets();
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    await fetch(`${API_BASE}/assets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...updates,
        category: updates.categoryId,
        location: updates.locationId,
      }),
    });

    await fetchAssets();
  };

  const deleteAsset = async (id: string) => {
    await fetch(`${API_BASE}/assets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchAssets();
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });

    await fetchCategories();
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchCategories();
  };

  const addLocation = async (location: Omit<Location, "id">) => {
    await fetch(`${API_BASE}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(location),
    });

    await fetchLocations();
  };

  const updateLocation = async (id: string, updates: Partial<Location>) => {
    await fetch(`${API_BASE}/locations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    await fetchLocations();
  };

  const deleteLocation = async (id: string) => {
    await fetch(`${API_BASE}/locations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchLocations();
  };

  const getAssetById = useCallback(
    (id: string) => assets.find((a) => a.id === id),
    [assets]
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getLocationById = useCallback(
    (id: string) => locations.find((l) => l.id === id),
    [locations]
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      await Promise.all([fetchAssets(), fetchCategories(), fetchLocations()]);
      setLoading(false);
    };

    load();
  }, [token, fetchAssets, fetchCategories, fetchLocations]);

  return (
    <InventoryContext.Provider
      value={{
        assets,
        categories,
        locations,
        loading,
        fetchAssets,
        fetchCategories,
        fetchLocations,
        addAsset,
        updateAsset,
        deleteAsset,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        getAssetById,
        getCategoryById,
        getLocationById,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return ctx;
}
