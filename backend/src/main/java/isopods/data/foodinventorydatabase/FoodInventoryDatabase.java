package isopods.data.foodinventorydatabase;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import isopods.model.FoodItem;

/**
 * Stores food items in memory until the PostgreSQL database is set up.
 * Safe to use from the console and the web server at the same time.
 */

public class FoodInventoryDatabase {

    private final List<FoodItem> items = new CopyOnWriteArrayList<>();

    public void addItem(FoodItem item) {
        items.add(item);
    }

    public boolean removeItem(FoodItem item) {
        return items.remove(item);
    }

    public List<FoodItem> getAllItems() {
        return List.copyOf(items);
    }

}