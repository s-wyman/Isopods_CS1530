export type ExpirationStatus = "FRESH" | "EXPIRING_SOON" | "EXPIRED";

export type FoodItemSummary = {
    id: string;
    name: string;
    foodType: string;
    storageLocation: string;
    expirationDate: string; // example:"2026-11-20"
    status: ExpirationStatus;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:7070';

export async function fetchFoodItems(): Promise<FoodItemSummary[]> {
    const response = await fetch(`${API_URL}/api/items`);
    if (!response.ok) {
        throw new Error(`Failed to fetch food items: ${response.statusText}`);
    }
    return response.json();
}