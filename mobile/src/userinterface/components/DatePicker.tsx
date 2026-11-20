import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  invalid?: boolean;
};

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DatePicker({
  value,
  onChange,
  invalid = false,
}: DatePickerProps) {
  const [visible, setVisible] = useState(false);

  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const today = new Date();

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
  });

  const selectedDate = parseDate(value);

  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from(
    {
      length: Math.ceil((firstWeekday + daysInMonth) / 7) * 7,
    },
    (_, index) => {
      const day = index - firstWeekday + 1;

      return day >= 1 && day <= daysInMonth ? day : null;
    }
  );

  function toggleCalendar() {
    if (visible) {
      setVisible(false);
      return;
    }

    // Hide any keyboard currently open from another form field.
    Keyboard.dismiss();

    if (selectedDate) {
      setDisplayedMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }

    setVisible(true);
  }

  function changeMonth(offset: number) {
    setDisplayedMonth(
      new Date(year, month + offset, 1)
    );
  }

  function selectDate(day: number) {
    const selected = new Date(year, month, day);

    onChange(formatDate(selected));
    //setVisible(false);
  }

  return (
    <View>
      {/* Date selection button */}
      <Pressable
        style={[
          styles.dateButton,
          visible && styles.dateButtonOpen,
          invalid && styles.inputInvalid,
        ]}
        onPress={toggleCalendar}
        accessibilityRole="button"
        accessibilityLabel="Choose expiration date"
        accessibilityState={{ expanded: visible }}
      >
        <View style={styles.dateIcon}>
          <Ionicons
            name="calendar-outline"
            size={26}
            color="#1B7F3B"
          />
        </View>

        <View style={styles.dateButtonContent}>
          <Text style={styles.dateButtonTitle}>
            Expiration date
          </Text>

          <Text style={styles.dateButtonValue}>
            {selectedDate
              ? selectedDate.toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Tap to choose a date"}
          </Text>
        </View>

        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={22}
          color="#1B7F3B"
        />
      </Pressable>

      {/* Calendar */}
      {visible && (
        <View style={styles.calendar}>

          {/* Month navigation */}
          <View style={styles.monthHeader}>
            <Pressable
              onPress={() => changeMonth(-1)}
              accessibilityLabel="Previous month"
              style={styles.monthButton}
            >
              <Text style={styles.monthArrow}>‹</Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {MONTHS[month]} {year}
            </Text>

            <Pressable
              onPress={() => changeMonth(1)}
              accessibilityLabel="Next month"
              style={styles.monthButton}
            >
              <Text style={styles.monthArrow}>›</Text>
            </Pressable>
          </View>

          {/* Weekday headings */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={styles.weekday}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days */}
          {Array.from(
            { length: days.length / 7 },
            (_, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {days
                  .slice(weekIndex * 7, weekIndex * 7 + 7)
                  .map((day, dayIndex) => {
                    if (day === null) {
                      return (
                        <View
                          key={`empty-${dayIndex}`}
                          style={styles.dayCell}
                        />
                      );
                    }

                    const selected =
                      selectedDate?.getFullYear() === year &&
                      selectedDate?.getMonth() === month &&
                      selectedDate?.getDate() === day;

                    return (
                      <Pressable
                        key={day}
                        style={[
                          styles.dayCell,
                          selected && styles.selectedDay,
                        ]}
                        onPress={() => selectDate(day)}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            selected && styles.selectedDayText,
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    minHeight: 76,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFF",
    gap: 12,
  },

  dateButtonOpen: {
    backgroundColor: "#DCFCE7",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  dateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  dateButtonContent: {
    flex: 1,
    gap: 4,
  },

  dateButtonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },

  dateButtonValue: {
    fontSize: 14,
    color: "#374151",
  },

  inputInvalid: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },

  calendarHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },

  calendar: {
    marginTop: 0,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#FFFFFF",
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  monthButton: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  monthArrow: {
    fontSize: 28,
    color: "#374151",
  },

  weekRow: {
    flexDirection: "row",
  },

  weekday: {
    flex: 1,
    textAlign: "center",
    color: "#6B7280",
    fontWeight: "600",
    paddingVertical: 8,
  },

  dayCell: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    borderRadius: 20,
  },

  dayText: {
    color: "#374151",
    fontSize: 14,
  },

  selectedDay: {
    backgroundColor: "#1B7F3B",
  },

  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});