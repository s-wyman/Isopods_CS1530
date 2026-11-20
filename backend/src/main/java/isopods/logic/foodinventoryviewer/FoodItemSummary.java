package isopods.logic.foodinventoryviewer;

/**
 * One row of the inventory list, in the shape the mobile app receives as JSON.
 *
 * @param expirationDate the expiration date in ISO format, such as "2026-11-20"
 */

public record FoodItemSummary(
    String name,
    String foodType,
    String storageLocation,
    String expirationDate,
    ExpirationStatus status
) {}
