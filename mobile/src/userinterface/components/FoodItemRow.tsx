import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

import type { ComponentProps } from "react";
import type { FoodItemSummary, ExpirationStatus } from "../api";

import { FOOD_TYPES, labelFor } from "./FilterPanel";

type StatusDisplay = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
};

/**
 * Each status uses a label, an icon, and a color 
 * so it never relies on color alone (NFR3).
 */

const EXPIRATION_STATUSES: Record<ExpirationStatus, StatusDisplay> = {
  FRESH: { label: "Fresh", icon: "checkmark-circle", color: "#1B7F3B" },
  EXPIRING_SOON: { label: "Expiring Soon", icon: "alert-circle", color: "#B45309" },
  EXPIRED: { label: "Expired", icon: "close-circle", color: "#B91C1C" },
};

export default function FoodItemRow({ item }: { item: FoodItemSummary }) {

  const { label, icon, color } = EXPIRATION_STATUSES[item.status];

  return (

    <View style={styles.row}>

      <View style={styles.imagePlaceholder}>
        <Ionicons 
          name="fast-food-outline" 
          size={28} 
          color="#6B7280" 
        />
      </View>

      <View style={styles.details}>

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{labelFor(FOOD_TYPES, item.foodType)} - {item.storageLocation}</Text>
        <Text style={styles.meta}>Expires {formatDate(item.expirationDate)}</Text>
        
        <View style={styles.badge}>
          <Ionicons name={icon} size={16} color={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>

      </View>

    </View>
    
  );

}

const styles = StyleSheet.create({ 

  row: {
    flexDirection: "row", 
    gap: 12, 
    padding: 16, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: "#D1D5DB" 
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

  badge: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4 
  }, 

  label: { 
    fontSize: 14, 
    fontWeight: "600" 
  } 

});

/**
 * Formats an ISO date such as "2026-11-20" in the phone's locale. The date is built from its
 * parts because parsing the ISO string directly treats it as UTC and can shift it by a day.
 */

function formatDate(isoDate: string): string {

  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });

}