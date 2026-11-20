import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { addFoodItem, type NewFoodItem } from "../api";
import DatePicker from "./DatePicker";
import { FOOD_TYPES } from "./FilterPanel";

type AddFoodFormProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

type FieldErrors = Partial<Record<keyof NewFoodItem, string>>;

const EMPTY_FORM: NewFoodItem = {
  name: "",
  foodType: "",
  storageLocation: "",
  expirationDate: "",
};

const STORAGE_LOCATIONS = [
  "Refrigerator",
  "Freezer",
  "Pantry",
  "Countertop",
  "Cabinet",
  "Other",
] as const;

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const isLeapYear =
    year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);

  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day <= daysInMonth[month - 1];
}

function validateForm(values: NewFoodItem): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Food name is required.";
  }

  if (!values.foodType.trim()) {
    errors.foodType = "Select a food type.";
  }

  if (!values.storageLocation.trim()) {
    errors.storageLocation = "Storage location is required.";
  }

  if (!isValidDate(values.expirationDate)) {
    errors.expirationDate = "Enter a valid date (YYYY-MM-DD).";
  }

  return errors;
}

export default function AddFoodForm({
  visible,
  onClose,
  onSaved,
}: AddFoodFormProps) {
  const [form, setForm] = useState<NewFoodItem>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof NewFoodItem>(
    field: K,
    value: NewFoodItem[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    // Clear this field's error once its value is valid.
    setErrors((current) => {
      if (!current[field]) return current;

      const valid =
        field === "expirationDate"
          ? isValidDate(String(value))
          : String(value).trim().length > 0;

      if (!valid) return current;

      const updated = { ...current };
      delete updated[field];
      return updated;
    });
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setErrorMessage(null);
  }

  function handleClose() {
    if (saving) return;

    resetForm();
    onClose();
  }

  async function handleSave() {
    const validationErrors = validateForm(form);

    setErrors(validationErrors);
    setErrorMessage(null);

    // Stop here. No request is sent while any field is invalid.
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      await addFoodItem({
        name: form.name.trim(),
        foodType: form.foodType.trim(),
        storageLocation: form.storageLocation.trim(),
        expirationDate: form.expirationDate.trim(),
      });

      resetForm();
      onSaved();
      onClose();
    } catch (error) {
      // Keep the user's values so they can retry.
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save food item."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
        />

        <View style={styles.sheet}>
          <Text style={styles.title}>Add Food</Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Food name *</Text>
            <TextInput
              style={[
                styles.input,
                errors.name && styles.inputInvalid,
              ]}
              value={form.name}
              onChangeText={(value) => updateField("name", value)}
              placeholder="Food name"
            />
            {errors.name && (
              <Text style={styles.fieldError}>{errors.name}</Text>
            )}

            <Text style={styles.label}>Food type *</Text>

            <View
              style={[
                styles.chips,
                errors.foodType && styles.groupInvalid,
              ]}
            >
              {FOOD_TYPES.map((type) => {
                const selected = form.foodType === type.key;

                return (
                  <Pressable
                    key={type.key}
                    onPress={() => updateField("foodType", type.key)}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {errors.foodType && (
              <Text style={styles.fieldError}>{errors.foodType}</Text>
            )}

            <Text style={styles.label}>Storage location *</Text>

            <View
              style={[
                styles.chips,
                errors.storageLocation && styles.groupInvalid,
              ]}
            >
              {STORAGE_LOCATIONS.map((location) => {
                const selected = form.storageLocation === location;

                return (
                  <Pressable
                    key={location}
                    onPress={() => updateField("storageLocation", location)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {location}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {errors.storageLocation && (
              <Text style={styles.fieldError}>
                {errors.storageLocation}
              </Text>
            )}

            <Text style={styles.label}>Expiration date *</Text>
            <DatePicker
              value={form.expirationDate}
              onChange={(date) => updateField("expirationDate", date)}
              invalid={Boolean(errors.expirationDate)}
            />
            {errors.expirationDate && (
              <Text style={styles.fieldError}>
                {errors.expirationDate}
              </Text>
            )}

            {errorMessage && (
              <Text style={styles.fieldError}>{errorMessage}</Text>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={saving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.confirmButton,
                saving && styles.confirmButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    padding: 4,
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    maxHeight: "95%",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  inputInvalid: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },

  fieldError: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 5,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  groupInvalid: {
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 8,
    padding: 6,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  chipSelected: {
    backgroundColor: "#1B7F3B",
    borderColor: "#1B7F3B",
  },

  chipText: {
    color: "#374151",
  },

  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },

  cancelButton: {
    padding: 12,
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },

  confirmButton: {
    backgroundColor: "#1B7F3B",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 110,
    alignItems: "center",
  },

  confirmButtonDisabled: {
    opacity: 0.6,
  },

  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});