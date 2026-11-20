import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import FoodInventoryView from "./src/userinterface/screens/FoodInventoryView";

export default function App() {
  return (
    <SafeAreaProvider>
      <FoodInventoryView />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
