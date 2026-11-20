package isopods.logic.foodinventoryviewer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import isopods.logic.fooditemadder.FoodItemAdder;
import isopods.model.FoodItem;

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
        FoodItem milk = adder.addItem("Milk", "Dairy", "Fridge", expirationDate);

        FoodItemSummary expected = new FoodItemSummary(milk.getId(), "Milk", "Dairy", "Fridge", expirationDate.toString(), ExpirationStatus.FRESH);
        assertEquals(List.of(expected), viewer.getAllItems());

    }

    @Test
    void noFilterReturnsEveryItem() {

        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(10));
        adder.addItem("rice", "grains-pasta", "pantry", LocalDate.now().plusDays(10));

        assertEquals(2, viewer.getItems(Set.of(), SortOrder.NONE).size());

    }

    @Test
    void multipleFoodTypesShowItemsOfEitherType() {

        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(10));
        adder.addItem("chicken", "meat", "freezer", LocalDate.now().plusDays(10));
        adder.addItem("rice", "grains-pasta", "pantry", LocalDate.now().plusDays(10));

        List<String> names = viewer.getItems(Set.of("dairy-eggs", "meat"), SortOrder.NONE)
                .stream()
                .map(FoodItemSummary::name)
                .toList();

        assertEquals(List.of("milk", "chicken"), names);

    }

    @Test
    void noMatchingItemsReturnsEmptyList() {
        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(10));
        assertTrue(viewer.getItems(Set.of("seafood"), SortOrder.NONE).isEmpty());
    }

    @Test
    void parseFilterSplitsCommasAndIgnoresBlanks() {
        assertEquals(Set.of("dairy-eggs", "meat"), FoodInventoryViewer.parseFilter("Dairy-Eggs, meat,"));
        assertTrue(FoodInventoryViewer.parseFilter(null).isEmpty());
        assertTrue(FoodInventoryViewer.parseFilter("  ").isEmpty());
    }

    @Test
    void ascendingSortShowsSoonestFirst() {
        addThreeItems();
        assertEquals(List.of("bread", "milk", "rice"), names(viewer.getItems(Set.of(), SortOrder.ASCENDING)));
    }

    @Test
    void descendingSortShowsLatestFirst() {
        addThreeItems();
        assertEquals(List.of("rice", "milk", "bread"), names(viewer.getItems(Set.of(), SortOrder.DESCENDING)));
    }

    @Test
    void sortingDoesNotChangeStoredOrder() {
        addThreeItems();
        viewer.getItems(Set.of(), SortOrder.ASCENDING);
        assertEquals(List.of("milk", "bread", "rice"), names(viewer.getAllItems()));
    }

    @Test
    void parseSortAcceptsAscAndDescOnly() {
        assertEquals(SortOrder.ASCENDING, SortOrder.parse("ASC"));
        assertEquals(SortOrder.DESCENDING, SortOrder.parse("desc"));
        assertEquals(SortOrder.NONE, SortOrder.parse(null));
        assertEquals(SortOrder.NONE, SortOrder.parse("sideways"));
    }

    private void addThreeItems() {
        adder.addItem("milk", "dairy-eggs", "fridge", LocalDate.now().plusDays(5));
        adder.addItem("bread", "bread-bakery", "pantry", LocalDate.now().plusDays(1));
        adder.addItem("rice", "grains-pasta", "pantry", LocalDate.now().plusDays(30));
    }

    private static List<String> names(List<FoodItemSummary> items) {
        return items.stream().map(FoodItemSummary::name).toList();
    }

}
