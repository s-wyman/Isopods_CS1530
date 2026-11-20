import { useCallback, useEffect, useState } from "react";
import { fetchInventory, type FoodItemSummary } from "../api";

import FoodItemRow from "../components/FoodItemRow";

import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Shows the user's food inventory. Pull down to reload the list after items change.
 *
 * @param onAddItem shows an 'Add Food Item' button on the empty list when provided
 */

export default function FoodInventoryView({ onAddItem }: { onAddItem?: () => void }) {
  const [items, setItems] = useState<FoodItemSummary[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = useCallback(() => {
    return fetchInventory()
      .then((loadedItems) => {
        setItems(loadedItems);
        setErrorMessage(null);
      })
      .catch(() => setErrorMessage("Couldn't reach server"));
  }, []);

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
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${index}-${item.name}`}
        renderItem={({ item }) => <FoodItemRow item={item} />}
        refreshing={refreshing}
        onRefresh={refresh}
        contentContainerStyle={items.length === 0 && styles.centered}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.message}>Your inventory is empty.</Text>
            {onAddItem && <Button title="Add Food Item" onPress={onAddItem} />}
          </View>
        }
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
