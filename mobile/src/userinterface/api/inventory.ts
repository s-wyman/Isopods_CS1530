import { fetchApi } from "./client";

export type ExpirationStatus = "FRESH" | "EXPIRING_SOON" | "EXPIRED";

export type FoodItemSummary = {
  name: string;
  foodType: string;
  storageLocation: string;
  expirationDate: string;
  status: ExpirationStatus;
};

export function fetchInventory(
  foodTypes: string[] = []
): Promise<FoodItemSummary[]> {
  const query = foodTypes.length > 0
    ? `?foodType=${encodeURIComponent(foodTypes.join(","))}`
    : "";

  return fetchApi<FoodItemSummary[]>(`/api/items${query}`);
}

// Added for US1: NewFoodItem and addFoodItem

// Data to create a new food item
export type NewFoodItem = {
  name: string;
  foodType: string;
  storageLocation: string;
  expirationDate: string;
};

export type AddFoodItemResponse = {
  message: string;
};

export function addFoodItem(
  item: NewFoodItem
): Promise<AddFoodItemResponse> {
  return fetchApi<AddFoodItemResponse>("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}