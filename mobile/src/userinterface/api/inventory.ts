import { fetchApi } from "./client";

export type ExpirationStatus = "FRESH" | "EXPIRING_SOON" | "EXPIRED";

export type FoodItemSummary = {
  name: string;
  foodType: string;
  storageLocation: string;
  expirationDate: string;
  status: ExpirationStatus;
};

export function fetchInventory(foodTypes: string[] = []): Promise<FoodItemSummary[]> {
  const query = foodTypes.length > 0 ? `?foodType=${encodeURIComponent(foodTypes.join(","))}` : "";
  return fetchApi<FoodItemSummary[]>(`/api/items${query}`);
}