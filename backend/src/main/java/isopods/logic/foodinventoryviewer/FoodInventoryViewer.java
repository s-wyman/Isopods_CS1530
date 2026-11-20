package isopods.logic.foodinventoryviewer;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import isopods.model.FoodItem;

/**
 * Builds the food inventory list that the mobile app displays.
 */

public class FoodInventoryViewer {

    private static final Comparator<FoodItem> BY_EXPIRATION_DATE = Comparator.comparing(FoodItem::getExpirationDate);

    private final FoodInventoryDatabase database;

    public FoodInventoryViewer(FoodInventoryDatabase database) {
        this.database = database;
    }

    /**
     * Returns every saved food item with its expiration status as of today.
     */
        
    public List<FoodItemSummary> getAllItems() {
        return getItems(Set.of(), SortOrder.NONE);
    }

    /**
     * Returns the items of the given food types, or every item when none are given, in the
     * given order. Sorting only changes the returned list, never the stored inventory.
     */

    public List<FoodItemSummary> getItems(Set<String> foodTypes, SortOrder sort) {
        
        Stream<FoodItem> items = database.getAllItems()
            .stream()
            .filter(item -> foodTypes.isEmpty() || foodTypes.contains(item.getFoodType().toLowerCase()));

        Stream<FoodItem> ordered = switch (sort) {
            case ASCENDING -> items.sorted(BY_EXPIRATION_DATE);
            case DESCENDING -> items.sorted(BY_EXPIRATION_DATE.reversed());
            case NONE -> items;
        };

        return ordered.map(this::summarize).toList();

    }

    /**
     * Converts a stored food item into the row the mobile app displays, with its expiration
     * status as of today.
     */

    public FoodItemSummary summarize(FoodItem item) {
        return new FoodItemSummary(
            item.getId(),
            item.getFoodName(),
            item.getFoodType(),
            item.getStorageLocation(),
            item.getExpirationDate().toString(),
            ExpirationStatus.of(item.getExpirationDate(), LocalDate.now())
        );
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