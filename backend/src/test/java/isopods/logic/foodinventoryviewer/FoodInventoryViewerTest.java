package isopods.logic.foodinventoryviewer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;

import isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import isopods.logic.fooditemadder.FoodItemAdder;

class FoodInventoryViewerTest {

    private final FoodInventoryDatabase database = new FoodInventoryDatabase();
    private final FoodItemAdder adder = new FoodItemAdder(database);
    private final FoodInventoryViewer viewer = new FoodInventoryViewer(database);

    @Test
    void emptyInventoryReturnsNoItems() {
        assertTrue(viewer.getAllItems().isEmpty());
    }

    @Test
    void addedItemAppearsWithItsDetailsAndStatus() {

        LocalDate expirationDate = LocalDate.now().plusDays(10);
        adder.addItem("Milk", "Dairy", "Fridge", expirationDate);

        FoodItemSummary expected = new FoodItemSummary("Milk", "Dairy", "Fridge", expirationDate.toString(), ExpirationStatus.FRESH);
        assertEquals(List.of(expected), viewer.getAllItems());
        
    }

}
