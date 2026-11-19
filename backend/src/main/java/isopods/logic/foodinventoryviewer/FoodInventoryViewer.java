package isopods.logic.foodinventoryviewer;

import java.time.LocalDate;
import java.util.List;

import isopods.data.foodinventorydatabase.FoodInventoryDatabase;

/**
 * Builds the food inventory list that the mobile app displays.
 */

public class FoodInventoryViewer {

    private final FoodInventoryDatabase database;

    public FoodInventoryViewer(FoodInventoryDatabase database) {
        this.database = database;
    }

    /**
     * Returns every saved food item with its expiration status as of today.
     */

    public List<FoodItemSummary> getAllItems() {

        LocalDate today = LocalDate.now();
        
        return database
            .getAllItems()
            .stream()
            .map(item -> new FoodItemSummary(
                item.getFoodName(),
                item.getFoodType(),
                item.getStorageLocation(),
                item.getExpirationDate().toString(),
                ExpirationStatus.of(item.getExpirationDate(), today)
            ))
            .toList();

    }
    
}