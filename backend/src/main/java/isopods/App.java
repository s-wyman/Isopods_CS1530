package main.java.isopods;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Scanner;

import main.java.isopods.data.externalservices.ExternalServices;
import main.java.isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import main.java.isopods.logic.foodinventoryviewer.FoodInventoryViewer;
import main.java.isopods.logic.fooditemadder.FoodItemAdder;
import main.java.isopods.logic.fooditemadder.FoodItemAdder.FoodItem;
import main.java.isopods.logic.recipeviewer.RecipeViewer;

public class App {
    private static final Scanner in = new Scanner(System.in);

    public static void main(String[] args) {
        FoodInventoryViewer viewer = new FoodInventoryViewer();
        RecipeViewer recipes = new RecipeViewer();
        FoodInventoryDatabase database = new FoodInventoryDatabase();
        FoodItemAdder adder = new FoodItemAdder(database);
        ExternalServices external = new ExternalServices();
        LocalDate date;
        File image;
        // Faking database functionality for now.
        ArrayList<FoodItemAdder.FoodItem> fakeDatabase = new ArrayList<>();

        System.out.println(
                "Commands: add <name> <food type> <storage location> <expiration year> <expiration month> <expiration day> <path to image (this is optional)>, view");
        while (in.hasNextLine()) {
            String[] words = in.nextLine().trim().toLowerCase().split("\\s+");
            if (words[0].equals("add") && (words.length == 7 || words.length == 8)) {
                try {
                    date = LocalDate.of(Integer.parseInt(words[4]), Integer.parseInt(words[5]), Integer.parseInt(words[6]));
                } catch (DateTimeException e) {
                    System.out.println(e);
                    continue;
                } catch (NumberFormatException e) {
                    System.out.println(e);
                    continue;
                }
                if (words.length == 9) {
                    try {
                        image = new File(words[7]);
                    } catch (NullPointerException e) {
                        System.out.println("Image not found. Proceeding without image. ");
                        adder.addItem(words[1], words[2], words[3], date);
                        continue;
                    }
                    FoodItem newItem = adder.addItem(words[1], words[2], words[3], date, image);
                    fakeDatabase.add(newItem);
                    continue;
                }
                FoodItem newItem = adder.addItem(words[1], words[2], words[3], date);
                fakeDatabase.add(newItem);
            }
            else if (words[0].equals("view")) {
                for (int i = 0; i < fakeDatabase.size(); i++) {
                    System.out.println("Name: " + fakeDatabase.get(i).getFoodName());
                    System.out.println("Food Type: " + fakeDatabase.get(i).getFoodType());
                    System.out.println("Storage Location: " + fakeDatabase.get(i).getStorageLocation());
                    System.out.println("Expiration Date: " + fakeDatabase.get(i).getExpirationDate());
                    System.out.println("Expiration Status: " + fakeDatabase.get(i).getExpirationStatus());
                    if (fakeDatabase.get(i).getImage() != null) System.out.println("Image Path: " + fakeDatabase.get(i).getImage().getAbsolutePath());
                    System.out.println("");
                }
            } else System.out.println("Invalid command");
        }
    }
}
