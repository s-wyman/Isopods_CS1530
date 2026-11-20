package isopods.logic.fooditemadder;

import java.io.File;
import java.time.LocalDate;
import java.util.Optional;

import isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import isopods.model.FoodItem;

public class FoodItemAdder {

    private FoodInventoryDatabase database;
    
    public FoodItemAdder(FoodInventoryDatabase database) {
        this.database = database;
    }

    public FoodItem addItem(
            String foodName, String foodType, String storageLocation, LocalDate expirationDate, File image) {
        FoodItem newItem = new FoodItem(
                foodName,
                foodType,
                storageLocation,
                expirationDate,
                image
        );

        database.addItem(newItem);
        return newItem;
    }

    public FoodItem addItem(String foodName, String foodType, String storageLocation, LocalDate expirationDate) {
        return addItem(
                foodName,
                foodType,
                storageLocation,
                expirationDate,
                null
        );
    }

    public boolean removeItem(FoodItem item) {
        return database.removeItem(item);
    }

    /**
     * Replaces the expiration date of the item with the given id.
     *
     * @return the updated item, or empty if no item has that id
     */
    
    public Optional<FoodItem> updateExpirationDate(String id, LocalDate expirationDate) {
        Optional<FoodItem> item = database.findItem(id);
        item.ifPresent(found -> found.setExpirationDate(expirationDate));
        return item;
    }

    
}