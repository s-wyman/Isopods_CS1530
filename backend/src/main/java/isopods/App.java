package isopods;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Scanner;

import io.javalin.Javalin;

import isopods.data.externalservices.ExternalServices;
import isopods.data.foodinventorydatabase.FoodInventoryDatabase;
import isopods.logic.foodinventoryviewer.FoodInventoryViewer;
import isopods.logic.fooditemadder.FoodItemAdder;
import isopods.logic.fooditemadder.FoodItemAdder.FoodItem;
import isopods.logic.recipeviewer.RecipeViewer;

public class App {

    private static final Scanner in = new Scanner(System.in);

    public static void main(String[] args) {

        FoodInventoryDatabase database = new FoodInventoryDatabase();
        FoodInventoryViewer viewer = new FoodInventoryViewer(database);
        RecipeViewer recipes = new RecipeViewer();
        FoodItemAdder adder = new FoodItemAdder(database);
        ExternalServices external = new ExternalServices();
        LocalDate date;
        File image;

        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "7070"));

        Javalin.create(config -> {
            config.routes.get("/api/items", ctx -> ctx.json(viewer.getItems(
                    FoodInventoryViewer.parseFilter(ctx.queryParam("foodType")))));
        }).start(port);

        System.out.println(
                "Commands: add <name> <food type> <storage location> <expiration year> <expiration month> <expiration day> <path to image (this is optional)>, view");

        while (in.hasNextLine()) {
            String[] words = in.nextLine().trim().toLowerCase().split("\\s+");
            if (words[0].equals("add") && (words.length == 7 || words.length == 8)) {
                try {
                    date = LocalDate.of(Integer.parseInt(words[4]), Integer.parseInt(words[5]),
                            Integer.parseInt(words[6]));
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
                    adder.addItem(words[1], words[2], words[3], date, image);
                    continue;
                }
                adder.addItem(words[1], words[2], words[3], date);
            } else if (words[0].equals("view")) {
                for (FoodItem item : database.getAllItems()) {
                    System.out.println("Name: " + item.getFoodName());
                    System.out.println("Food Type: " + item.getFoodType());
                    System.out.println("Storage Location: " + item.getStorageLocation());
                    System.out.println("Expiration Date: " + item.getExpirationDate());
                    System.out.println("Expiration Status: " + item.getExpirationStatus());
                    if (item.getImage() != null)
                        System.out.println("Image Path: " + item.getImage().getAbsolutePath());
                    System.out.println("");
                }
            } else
                System.out.println("Invalid command");
        }
    }
}
