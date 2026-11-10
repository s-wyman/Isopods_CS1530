package main.java.isopods.logic.fooditemadder;

import java.io.File;
import java.time.LocalDate;

import main.java.isopods.data.foodinventorydatabase.FoodInventoryDatabase;

public class FoodItemAdder {
    private FoodInventoryDatabase database;
    
    public FoodItemAdder(FoodInventoryDatabase database) {
        this.database = database;
    }

    public FoodItem addItem(String foodName, String foodType, String storageLocation, LocalDate expirationDate, File image) {
        FoodItem newItem = new FoodItem(foodName, foodType, storageLocation, expirationDate, image);
        return newItem;
    }

    public FoodItem addItem(String foodName, String foodType, String storageLocation, LocalDate expirationDate) {
        FoodItem newItem = new FoodItem(foodName, foodType, storageLocation, expirationDate);
        return newItem;
    }

    public String removeItem(FoodItem item) {
        return database.removeItem(item);
    }

    public class FoodItem {
        private String foodName;
        private String foodType;
        private String storageLocation;
        private LocalDate expirationDate;
        private boolean expirationStatus = false;
        private File image = null;

        public FoodItem(String foodName, String foodType, String storageLocation, LocalDate expirationDate, File image) {
            this.foodName = foodName;
            this.foodType = foodType;
            this.storageLocation = storageLocation;
            this.expirationDate = expirationDate;
            updateExpirationStatus(expirationDate);
            this.image = image;
        }

        public FoodItem(String foodName, String foodType, String storageLocation, LocalDate expirationDate) {
            this.foodName = foodName;
            this.foodType = foodType;
            this.storageLocation = storageLocation;
            this.expirationDate = expirationDate;
            updateExpirationStatus(expirationDate);
        }

        public String getFoodName() {
            return foodName;
        }
        
        public String getFoodType() {
            return foodType;
        }

        public String getStorageLocation() {
            return storageLocation;
        }

        public LocalDate getExpirationDate() {
            return expirationDate;
        }

        public boolean getExpirationStatus() {
            return expirationStatus;
        }

        public File getImage() {
            return image;
        }

        public void setFoodName(String foodName) {
            this.foodName = foodName;
            return;
        }

        public void setFoodType(String foodType) {
            this.foodType = foodType;
            return;
        }

        public void setStorageLocation(String storageLocation) {
            this.storageLocation = storageLocation;
            return;
        }

        public void setExpirationDate(LocalDate expirationDate) {
            this.expirationDate = expirationDate;
            updateExpirationStatus(expirationDate);
            return;
        }

        public void setImage(File image) {
            this.image = image;
            return;
        }
        
        private void updateExpirationStatus(LocalDate newExpirationDate) {
            LocalDate rightNow = LocalDate.now();
            if (rightNow.isAfter(newExpirationDate)) {
                this.expirationStatus = true;
            } else this.expirationStatus = false;
            return;
        }
    }
}