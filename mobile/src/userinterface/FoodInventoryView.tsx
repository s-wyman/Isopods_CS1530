import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { ExpirationStatus, FoodItemSummary, fetchFoodItems } from './inventoryApi';

const STATUS_DISPLAY: Record<ExpirationStatus, { label: string; icon: string; color: string }> = {
  FRESH: { label: 'Fresh', icon: '✓', color: '#2E7D32' },
  EXPIRING_SOON: { label: 'Expiring Soon', icon: '!', color: '#DD843C' },
  EXPIRED: { label: 'Expired', icon: '✕', color: '#C62828' },
};

export default function FoodInventoryView() {
    const [items, setItems] = useState<FoodItemSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadItems = useCallback(async () => {
        try {
            setItems(await fetchFoodItems());
            setError(null);
        } catch (err) {
            setError("Couldn't reach the server. Check that the backend is running.");
        }
    }, []);

    useEffect(() => {
        loadItems().finally(() => setLoading(false));
    }, [loadItems]);

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

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>My Food</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <FlatList
                data={items}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => <FoodItemRow item={item} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
                ListEmptyComponent={error ? undefined : <EmptyInventory />}
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
                    {item.foodType} · {item.storageLocation}
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

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
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