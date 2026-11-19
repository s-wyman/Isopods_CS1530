import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import FilterPanel from './FilterPanel';
import { FOOD_TYPES, labelFor } from './filterOptions';
import { ExpirationStatus, FoodItemSummary, fetchFoodItems } from './inventoryApi';

// Text, icon, and color for each status.
const STATUS_DISPLAY: Record<ExpirationStatus, { label: string; icon: string; color: string }> = {
    FRESH: { label: 'Fresh', icon: '✓', color: '#2E7D32' },
    EXPIRING_SOON: { label: 'Expiring Soon', icon: '!', color: '#DD843C' },
    EXPIRED: { label: 'Expired', icon: '✕', color: '#C62828' },
};

export default function FoodInventoryView() {
    const [items, setItems] = useState<FoodItemSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foodTypes, setFoodTypes] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);

    const loadItems = useCallback(async () => {
        try {
            setItems(await fetchFoodItems(foodTypes));
            setError(null);
        } catch {
            setError("Couldn't reach the server. Check that the backend is running.");
        }
    }, [foodTypes]);

    // Load the list when the screen opens and again whenever the filter changes.
    useEffect(() => {
        loadItems().finally(() => setLoading(false));
    }, [loadItems]);

    // Pull down to refresh.
    const onRefresh = async () => {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const filterActive = foodTypes.length > 0;

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>My Food</Text>

            <View style={styles.filterBar}>
                <Pressable style={[styles.filterButton, filterActive && styles.filterButtonActive]} onPress={() => setFilterOpen(true)}>
                    <Text style={[styles.filterButtonText, filterActive && styles.filterButtonTextActive]}>
                        {filterActive ? `Filter (${foodTypes.length})` : 'Filter'}
                    </Text>
                </Pressable>
                {filterActive && (
                    <Pressable onPress={() => setFoodTypes([])}>
                        <Text style={styles.clearFilter}>Clear</Text>
                    </Pressable>
                )}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
            <FlatList
                data={items}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => <FoodItemRow item={item} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
                ListEmptyComponent={
                    error ? undefined : filterActive ? <NoResults onClear={() => setFoodTypes([])} /> : <EmptyInventory />
                }
            />

            <FilterPanel
                visible={filterOpen}
                selectedFoodTypes={foodTypes}
                onApply={(selected) => {
                    setFoodTypes(selected);
                    setFilterOpen(false);
                }}
                onClose={() => setFilterOpen(false)}
            />
        </View>
    );
}

function FoodItemRow({ item }: { item: FoodItemSummary }) {
    const status = STATUS_DISPLAY[item.status];
    return (
        <View style={styles.row}>
            {/* Default placeholder until photos (US11) are built */}
            <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>🍽</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subtext}>
                    {labelFor(FOOD_TYPES, item.foodType)} · {item.storageLocation}
                </Text>
                <Text style={styles.subtext}>Expires {item.expirationDate}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: status.color }]}>
                <Text style={styles.badgeText}>
                    {status.icon} {status.label}
                </Text>
            </View>
        </View>
    );
}

function EmptyInventory() {
    return (
        <View style={styles.center}>
            <Text style={styles.emptyText}>Your inventory is empty.</Text>
            {/* Not connected yet: adding items from the app is US1 */}
            <Pressable style={styles.addButton} onPress={() => { }}>
                <Text style={styles.addButtonText}>Add food</Text>
            </Pressable>
        </View>
    );
}

// Shown when a filter is on but nothing matches it.
function NoResults({ onClear }: { onClear: () => void }) {
    return (
        <View style={styles.center}>
            <Text style={styles.emptyText}>No items found for this filter.</Text>
            <Pressable style={styles.addButton} onPress={onClear}>
                <Text style={styles.addButtonText}>Clear filter</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
    filterBar: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    filterButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
    filterButtonActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
    filterButtonText: { color: '#333', fontWeight: '600' },
    filterButtonTextActive: { color: '#fff' },
    clearFilter: { color: '#2E7D32', fontWeight: '600' },
    error: { color: '#C62828', marginBottom: 12 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    imagePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    imagePlaceholderText: { fontSize: 24 },
    details: { flex: 1 },
    name: { fontSize: 17, fontWeight: '600' },
    subtext: { color: '#666', marginTop: 2 },
    badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { color: '#fff', fontWeight: '600', fontSize: 12 },
    emptyContainer: { flexGrow: 1 },
    emptyText: { fontSize: 16, color: '#666', marginBottom: 12 },
    addButton: { backgroundColor: '#2E7D32', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
    addButtonText: { color: '#fff', fontWeight: '600' },
});