import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { fetchInventory, updateExpirationDate, type FoodItemSummary, type SortOrder } from "../api";
import { parseIsoDate, toIsoDate } from "../utils/dates";

import ExpirationDatePicker from "../components/ExpirationDatePicker";
import FilterPanel from "../components/FilterPanel";
import FoodItemRow from "../components/FoodItemRow";

const NEXT_SORT: Record<SortOrder, SortOrder> = { 
  none: "asc", 
  asc: "desc", 
  desc: "none" 
};

const SORT_LABELS: Record<SortOrder, string> = {
  none: "Sort by date",
  asc: "Soonest first",
  desc: "Latest first" 
};

/**
 * Shows the user's food inventory. Pull down to reload the list after items change, open the
 * filter panel to show only certain food types, sort by expiration date, or tap an item to
 * change its expiration date.
 *
 * @param onAddItem shows an 'Add Food Item' button on the empty list when provided
 */

export default function FoodInventoryView({ onAddItem }: { onAddItem?: () => void }) {
  
  const [items, setItems] = useState<FoodItemSummary[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortOrder>("none");
  const [editingItem, setEditingItem] = useState<FoodItemSummary | null>(null);

  const filterActive = foodTypes.length > 0;
  const sortActive = sort !== "none";

  const loadItems = useCallback(() => {
    return fetchInventory(foodTypes, sort)
      .then((loadedItems) => {
        setItems(loadedItems);
        setErrorMessage(null);
      })
      .catch(() => setErrorMessage("Couldn't reach server"));
  }, [foodTypes, sort]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const refresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const retry = () => {
    setErrorMessage(null);
    setItems(null);
    loadItems();
  };

  const applyFilter = (selected: string[]) => {
    setFoodTypes(selected);
    setFilterOpen(false);
  };

  const saveExpirationDate = async (item: FoodItemSummary, expirationDate: Date) => {
    setEditingItem(null);
    try {
      await updateExpirationDate(item.id, toIsoDate(expirationDate));
    } catch {
      Alert.alert("Couldn't save", `The expiration date for ${item.name} was not changed.`);
      return;
    }
    await loadItems();
  };

  const editExpirationDate = (item: FoodItemSummary) => {
    if (Platform.OS === "android")
      DateTimePickerAndroid.open({
        value: parseIsoDate(item.expirationDate),
        mode: "date",
        onValueChange: (_event, selectedDate) => {
          if (selectedDate) saveExpirationDate(item, selectedDate);
        },
      });
    else setEditingItem(item);
  };

  if (errorMessage)
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>{errorMessage}</Text>
        <Button title="Try Again" onPress={retry} />
      </SafeAreaView>
    );

  if (items === null)
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  return (

    <SafeAreaView style={styles.screen}>

      <Text style={styles.title}>My Food</Text>

      <View style={styles.filterBar}>

        <Pressable
          style={[styles.filterButton, filterActive && styles.filterButtonActive]}
          onPress={() => setFilterOpen(true)}
        >
          <Text style={[styles.filterButtonText, filterActive && styles.filterButtonTextActive]}>
            {filterActive ? `Filter (${foodTypes.length})` : "Filter"}
          </Text>
        </Pressable>

        {filterActive && (
          <Pressable onPress={() => setFoodTypes([])}>
            <Text style={styles.clearFilter}>Clear</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.filterButton, styles.sortButton, sortActive && styles.filterButtonActive]}
          onPress={() => setSort(NEXT_SORT[sort])}
        >
          <Text style={[styles.filterButtonText, sortActive && styles.filterButtonTextActive]}>
            {SORT_LABELS[sort]}
          </Text>
        </Pressable>

      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodItemRow item={item} onPress={() => editExpirationDate(item)} />}
        refreshing={refreshing}
        onRefresh={refresh}
        contentContainerStyle={items.length === 0 && styles.centered}
        ListEmptyComponent={
          filterActive ? (
            <View style={styles.empty}>
              <Text style={styles.message}>No items found for this filter.</Text>
              <Button title="Clear Filter" onPress={() => setFoodTypes([])} />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.message}>Your inventory is empty.</Text>
              {onAddItem && <Button title="Add Food Item" onPress={onAddItem} />}
            </View>
          )
        }
      />

      <FilterPanel
        visible={filterOpen}
        selectedFoodTypes={foodTypes}
        onApply={applyFilter}
        onClose={() => setFilterOpen(false)}
      />

      {editingItem && (
        <ExpirationDatePicker 
          item={editingItem}
          onSave={(date) => saveExpirationDate(editingItem, date)}
          onCancel={() => setEditingItem(null)}
        />
      )}

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({ 

  screen: {
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  }, 

  centered: {
    flexGrow: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 24, 
    backgroundColor: "#FFFFFF" 
  }, 

  title: {
    fontSize: 28, 
    fontWeight: "700", 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  }, 

  filterBar: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    paddingHorizontal: 16, 
    marginBottom: 8 
  }, 

  filterButton: {
    borderWidth: 1, 
    borderColor: "#D1D5DB", 
    borderRadius: 16, 
    paddingHorizontal: 14, 
    paddingVertical: 6 
  }, 

  filterButtonActive: {
    backgroundColor: "#1B7F3B", 
    borderColor: "#1B7F3B" 
  }, 

  filterButtonText: {
    color: "#374151", 
    fontWeight: "600" 
  }, 

  filterButtonTextActive: {
    color: "#FFFFFF" 
  }, 

  clearFilter: {
    color: "#1B7F3B", 
    fontWeight: "600" 
  }, 

  empty: {
    alignItems: "center", 
    gap: 12 
  }, 

  message: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#4B5563", 
    marginBottom: 12 
  }, 
  
  sortButton: {
    marginLeft: "auto" 
  } 
  
});