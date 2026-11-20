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
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ expirationDate }),
  });
}