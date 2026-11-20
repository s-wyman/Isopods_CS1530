import { fetchApi } from "./client";

export type ExpirationStatus = "FRESH" | "EXPIRING_SOON" | "EXPIRED";
export type SortOrder = "none" | "asc" | "desc";

export type FoodItemSummary = {
  id: string;
  name: string;
  foodType: string;
  storageLocation: string;
  expirationDate: string;
  status: ExpirationStatus;
};

export function fetchInventory(foodTypes: string[] = [], sort: SortOrder = "none"): Promise<FoodItemSummary[]> {
  const params: string[] = [];

  if (foodTypes.length > 0)
    params.push(`foodType=${encodeURIComponent(foodTypes.join(","))}`);
  if (sort !== "none")
    params.push(`sort=${sort}`);

  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return fetchApi<FoodItemSummary[]>(`/api/items${query}`);
  
}

export function updateExpirationDate(id: string, expirationDate: string): Promise<FoodItemSummary> {
  return fetchApi<FoodItemSummary>(`/api/items/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expirationDate }),
  });
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
