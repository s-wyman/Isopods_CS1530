package isopods.logic.foodinventoryviewer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

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

        FoodItemSummary expected = new FoodItemSummary("Milk", "Dairy", "Fridge", expirationDate.toString(),
                ExpirationStatus.FRESH);
        assertEquals(List.of(expected), viewer.getAllItems());

    }

    @Test
    void noFilterReturnsEveryItem() {

        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(10));
        adder.addItem("rice", "grains-pasta", "pantry", LocalDate.now().plusDays(10));

        assertEquals(2, viewer.getItems(Set.of()).size());

    }

    @Test
    void multipleFoodTypesShowItemsOfEitherType() {

        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(10));
        adder.addItem("chicken", "meat", "freezer", LocalDate.now().plusDays(10));
        adder.addItem("rice", "grains-pasta", "pantry", LocalDate.now().plusDays(10));

        List<String> names = viewer.getItems(Set.of("dairy-eggs", "meat"))
                .stream()
                .map(FoodItemSummary::name)
                .toList();

        assertEquals(List.of("milk", "chicken"), names);

    }

    @Test
    void noMatchingItemsReturnsEmptyList() {

        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(10));

        assertTrue(viewer.getItems(Set.of("seafood")).isEmpty());

    }

    @Test
    void parseFilterSplitsCommasAndIgnoresBlanks() {

        assertEquals(Set.of("dairy-eggs", "meat"), FoodInventoryViewer.parseFilter("Dairy-Eggs, meat,"));
        assertTrue(FoodInventoryViewer.parseFilter(null).isEmpty());
        assertTrue(FoodInventoryViewer.parseFilter("  ").isEmpty());

    }

}
