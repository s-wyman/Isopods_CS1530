import { fetchApi } from "./client";

export type ExpirationStatus = "FRESH" | "EXPIRING_SOON" | "EXPIRED";

export type FoodItemSummary = {
  name: string;
  foodType: string;
  storageLocation: string;
  expirationDate: string;
  status: ExpirationStatus;
};

export function fetchInventory(): Promise<FoodItemSummary[]> {
  return fetchApi<FoodItemSummary[]>("/api/items");
}