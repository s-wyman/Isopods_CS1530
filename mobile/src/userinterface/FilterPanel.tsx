import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FOOD_TYPES, FilterOption } from './filterOptions';

type FilterPanelProps = {
    visible: boolean;
    selectedFoodTypes: string[];
    onApply: (foodTypes: string[]) => void;
    onClose: () => void;
};

export default function FilterPanel({ visible, selectedFoodTypes, onApply, onClose }: FilterPanelProps) {
    const [draftFoodTypes, setDraftFoodTypes] = useState<string[]>(selectedFoodTypes);

    useEffect(() => {
        if (visible) setDraftFoodTypes(selectedFoodTypes);
    }, [visible, selectedFoodTypes]);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.header}>
                    <Text style={styles.title}>Filter</Text>
                    <Pressable onPress={() => setDraftFoodTypes([])}>
                        <Text style={styles.clearAll}>Clear all</Text>
                    </Pressable>
                </View>

                <ScrollView>
                    <FilterSection
                        title="Food type"
                        options={FOOD_TYPES}
                        selected={draftFoodTypes}
                        onChange={setDraftFoodTypes}
                    />
                    {/* US5: a "Location" FilterSection goes here */}
                </ScrollView>

                <Pressable style={styles.applyButton} onPress={() => onApply(draftFoodTypes)}>
                    <Text style={styles.applyButtonText}>Show results</Text>
                </Pressable>
            </View>
        </Modal>
    );
}

type FilterSectionProps = {
    title: string;
    options: FilterOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
};

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
    const toggle = (key: string) =>
        onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.chips}>
                {options.map((option) => {
                    const isSelected = selected.includes(option.key);
                    return (
                        <Pressable
                            key={option.key}
                            onPress={() => toggle(option.key)}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{option.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        paddingBottom: 36,
        maxHeight: '75%',
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 22, fontWeight: 'bold' },
    clearAll: { color: '#2E7D32', fontWeight: '600' },
    section: { marginTop: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
    chipSelected: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
    chipText: { color: '#333' },
    chipTextSelected: { color: '#fff', fontWeight: '600' },
    applyButton: { backgroundColor: '#2E7D32', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
    applyButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});