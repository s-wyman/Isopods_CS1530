package isopods.logic.foodinventoryviewer;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
                        ExpirationStatus.of(item.getExpirationDate(), today)))
                .toList();

    }

    public List<FoodItemSummary> getItems(Set<String> foodTypes) {
        return getAllItems()
                .stream()
                .filter(item -> foodTypes.isEmpty() || foodTypes.contains(item.foodType().toLowerCase()))
                .toList();
    }

    public static Set<String> parseFilter(String param) {
        if (param == null || param.isBlank())
            return Set.of();

        return Arrays.stream(param.split(","))
                .map(value -> value.trim().toLowerCase())
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toSet());
    }
}