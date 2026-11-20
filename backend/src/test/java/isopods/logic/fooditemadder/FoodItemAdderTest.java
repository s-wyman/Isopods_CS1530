package isopods.logic.fooditemadder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.Optional;

import isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import isopods.model.FoodItem;

/**
 * Food Item Adder Tests.
 *
 * Checks that a newly added food item gets the correct expiration status 
 * from its expiration date.
 */

class FoodItemAdderTest {

    private final FoodItemAdder adder = new FoodItemAdder(new FoodInventoryDatabase());

    /**
     * An expiration date that already passed marks the item as expired.
     */

    @Test
    void itemPastExpirationDateIsExpired() {
        FoodItem item = adder.addItem("Milk", "Dairy", "Fridge", LocalDate.now().minusDays(1));
        assertTrue(item.getExpirationStatus());
    }

    /**
     * An expiration date still in the future keeps the item fresh.
     */

    @Test
    void itemBeforeExpirationDateIsNotExpired() {
        FoodItem item = adder.addItem("Milk", "Dairy", "Fridge", LocalDate.now().plusDays(1));
        assertFalse(item.getExpirationStatus());
    }

    @Test
    void updatingExpirationDateReplacesOldDateAndStatus() {
        FoodItem item = adder.addItem("Milk", "Dairy", "Fridge", LocalDate.now().minusDays(1));
        LocalDate newDate = LocalDate.now().plusDays(7);

        assertEquals(Optional.of(item), adder.updateExpirationDate(item.getId(), newDate));
        assertEquals(newDate, item.getExpirationDate());
        assertFalse(item.getExpirationStatus());
    }

    @Test
    void updatingUnknownItemChangesNothing() {
        assertTrue(adder.updateExpirationDate("missing", LocalDate.now()).isEmpty());
    }

}