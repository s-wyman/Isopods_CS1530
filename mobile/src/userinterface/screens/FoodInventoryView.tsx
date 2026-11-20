import { useCallback, useEffect, useState } from "react";
import { fetchInventory, type FoodItemSummary } from "../api";

import FilterPanel from "../components/FilterPanel";
import FoodItemRow from "../components/FoodItemRow";
import AddFoodForm from "../components/AddFoodForm";

import { 
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

/**
 * Shows the user's food inventory. Pull down to reload the list after items change, or open
 * the filter panel to show only certain food types.
 *
 * @param onAddItem shows an 'Add Food Item' button on the empty list when provided
 */
export default function FoodInventoryView() {
  const [items, setItems] = useState<FoodItemSummary[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const [addFoodOpen, setAddFoodOpen] = useState(false);

  const filterActive = foodTypes.length > 0;

  const loadItems = useCallback(() => {
    return fetchInventory(foodTypes).then((loadedItems) => {
      setItems(loadedItems);
      setErrorMessage(null);
    })
    .catch(() => setErrorMessage("Couldn't reach server"));
  }, [foodTypes]);

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
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => `${index}-${item.name}`}
        renderItem={({ item }) => <FoodItemRow item={item} />}
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
            </View>
          )
        }
      />

      <Pressable
        style={[styles.addFoodButton]}
        onPress={() => setAddFoodOpen(true)}
      >
        <Ionicons name="add" size={20} color="#FFFFFF"/>
        <Text style={styles.addFoodButtonText}>Add Food</Text>
      </Pressable>

      <AddFoodForm
        visible={addFoodOpen}
        onClose={() => setAddFoodOpen(false)}
        onSaved={refresh}
      />

      <FilterPanel
        visible={filterOpen}
        selectedFoodTypes={foodTypes}
        onApply={applyFilter}
        onClose={() => setFilterOpen(false)}
      />

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

  addFoodButton: {
    marginBottom: 32,
    marginRight: 16,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1B7F3B",
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  addFoodButtonDisabled: {
    backgroundColor: "#9CA3AF"
  },

  addFoodButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
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
  }

});