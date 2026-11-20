import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { parseIsoDate } from "../utils/dates";

import type { FoodItemSummary } from "../api";

import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  item: FoodItemSummary;
  onSave: (expirationDate: Date) => void;
  onCancel: () => void;
};

/**
 * iOS bottom sheet for choosing a new expiration date. Android opens the system date
 * dialog from the inventory screen instead.
 */
export default function ExpirationDatePicker({ item, onSave, onCancel }: Props) {
  
  const [date, setDate] = useState(() => parseIsoDate(item.expirationDate));

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Expiration date</Text>
        <Text style={styles.subtitle}>{item.name}</Text>

        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          onValueChange={(_event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
          }}
        />

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.saveButton]} onPress={() => onSave(date)}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 36,
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 16, color: "#4B5563", textTransform: "capitalize", marginBottom: 8 },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
  button: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#D1D5DB" },
  saveButton: { backgroundColor: "#1B7F3B", borderColor: "#1B7F3B" },
  cancelText: { color: "#374151", fontWeight: "600", fontSize: 16 },
  saveText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
});
