import { StatusBar } from 'expo-status-bar';
import FoodInventoryView from './src/userinterface/FoodInventoryView';

export default function App() {
  return (
    <>
      <FoodInventoryView />
      <StatusBar style="auto" />
    </>
  );
}
