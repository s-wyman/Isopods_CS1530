import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

import type { ComponentProps } from "react";
import type { FoodItemSummary, ExpirationStatus } from "../api";

import { FOOD_TYPES, labelFor } from "./FilterPanel";
import { formatDate } from "../utils/dates";

type StatusDisplay = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  background: string;
};

/**
 * Each status uses a label, an icon, and a color so it never relies on color alone (NFR3).
 * Each text color keeps at least 4.5:1 contrast on its tinted background.
 */

const EXPIRATION_STATUSES: Record<ExpirationStatus, StatusDisplay> = {
  FRESH: { label: "Fresh", icon: "checkmark-circle", color: "#1B7F3B", background: "#E8F5EC" },
  EXPIRING_SOON: { label: "Expiring Soon", icon: "alert-circle", color: "#B45309", background: "#FEF3C7" },
  EXPIRED: { label: "Expired", icon: "close-circle", color: "#B91C1C", background: "#FEE2E2" },
};

export default function FoodItemRow({ item, onPress }: { item: FoodItemSummary; onPress: () => void }) {
  
  const { label, icon, color, background } = EXPIRATION_STATUSES[item.status];

  return (

    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityHint="Changes the expiration date"
    >

      <View style={styles.imagePlaceholder}>
        <Ionicons name="fast-food-outline" size={28} color="#6B7280" />
      </View>

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {labelFor(FOOD_TYPES, item.foodType)} · {item.storageLocation}
        </Text>
      </View>

      <View style={styles.expiration}>
        <View style={[styles.badge, { backgroundColor: background }]}>
          <Ionicons name={icon} size={14} color={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.expirationDate)}</Text>
      </View>
    </Pressable>

  );

}

const styles = StyleSheet.create({ 

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D5DB" 
  }, 

  rowPressed: {
    backgroundColor: "#F9FAFB" 
  }, 

  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center" 
  }, 

  details: {
    flex: 1,
    gap: 2 
  }, 

  name: {
    fontSize: 17,
    fontWeight: "600",
    textTransform: "capitalize" 
  },

  meta: {
    fontSize: 14,
    color: "#4B5563",
    textTransform: "capitalize" 
  },

  expiration: {
    alignItems: "flex-end",
    gap: 4 
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999 
  },

  label: {
    fontSize: 13,
    fontWeight: "600" 
  }, 

  date: { 
    fontSize: 13, 
    color: "#4B5563" 
  } 
});