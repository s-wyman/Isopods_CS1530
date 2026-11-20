package isopods.api;

public record AddFoodItemRequest(
    String name,
    String foodType,
    String storageLocation,
    String expirationDate
) {}