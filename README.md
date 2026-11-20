# Isopods

### Team Members:

- Sydney Wyman
- Caleb Sarmiento
- Layne Krantosky
- Farouk Boudjemaa

## Project Purpose
The purpose of our project is to build a system that lets users keep track of expiration dates for their food to help them reduce waste. Users will log food items in the app and enter or scan the expiration date to attach alongside the entry. The system will store each logged food item and notify the user when expiration dates are near and when they are expired. By providing this functionality, our system will solve the problem of keeping track of many expiration dates to avoid waste.

## Implementation Details

### Tech Stack

| **Layer**                | **Technology**                        | **Justification**                                                                                                                                                                                                                                                                |
|--------------------------|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Language(s)              | Java (backend), Typescript (frontend) | Our team has the most experience with Java, so we can build the backend logic quickly. TypeScript has type checking like Java, which will help us keep the code and data consistent between the client and server.                                                               |
| Frontend                 | React Native (Expo)                   | We have some experience making UIs with React. This also allows us to easily test and package the app for both iOS and Android. React Native builds our ‘UserInterface’ subsystem, and Expo’s camera access supports the ‘CameraRollHandler’ for attaching photos to food items. |
| Backend                  | Javalin                               | There is very minimal setup to launch a server and the code is regular Java, so it will be familiar to work with.                                                                                                                                                                |
| Database                 | PostgreSQL                            | Serves as our ‘FoodInventoryDatabase’ subsystem, giving us one central database so data stays consistent. Since the client can only reach it through the backend, it supports DG3 (Security).                                                                                    |
| APIs / External Services | Expo Push Notification Service        | Expo’s push notification service allows us to easily send expiration reminders to both iOS and Android.                                                                                                                                                                          |
| Deployment / Housing     | Railway                               | The backend server and database can be hosted on a free tier, so the whole team can access the deployment. Expo already handles building the mobile app for us.                                                                                                                  |

### Subsystem Decomposition

<img width="1123" height="631" alt="image" src="https://github.com/user-attachments/assets/b27c5b5b-0c01-41b4-9652-ed94e48c5a4a" />

### Subsystem File Structure

- ExternalServices: `backend/src/main/java/isopods/data/externalservices/ExternalServices.java`
- FoodInventoryDatabase: `backend/src/main/java/isopods/data/foodinventorydatabase`
- FoodInventoryViewer: `backend/src/main/java/isopods/logic/foodinventoryviewer`
- FoodItemAdder: `backend/src/main/java/isopods/logic/fooditemadder`
- RecipeViewer: `backend/src/main/java/isopods/logic/recipeviewer`
- UserInterface: `mobile/src/userinterface`

### Deployment Diagram

<img width="1122" height="462" alt="Sprint_4_UML drawio" src="https://github.com/user-attachments/assets/1b776f74-2020-45d1-a15c-65779f9f5c69" />


## Installation Instructions
1. Install Java 25 or newer.
2. Clone this repository and open a terminal in `Isopods_CS1530/backend`.
3. Build the backend and run its tests with `.\mvnw.cmd verify` on Windows or `./mvnw verify` on Mac/Linux.
4. Start the server and console with `.\mvnw.cmd compile exec:java` on Windows or `./mvnw compile exec:java` on Mac/Linux. The food inventory list is served at http://localhost:7070/api/items.
5. Use `add <name> <food type> <storage location> <expiration year> <expiration month> <expiration day> <path to image (this is optional)>` to add FoodItem objects to the database.
6. Use view to see a list of all FoodItem objects.

### Running the mobile app
1. Start the backend (steps above) and leave it running.
2. In `mobile/`, run `npm install`, then `npx expo start`, and scan the QR code with the Expo Go app.

## Current Functionality

**Add Food (US1):** The app's home screen has a floating action button in the bottom right-hand corner labeled "+ Add Food" that when pressed, displays the "Add Food" form. This form has input fields for the new food item's name, options for food type, options for storage location, and a calendar input for the expiration date. Once all fields are filled, the user can confirm by pressing the "Confirm" button or press the "Cancel" button to go back. If the user doesn't fill out all the fields, or filled a field incorrectly, the form highlights those fields with a red outline and displays a message underneath the field.

**View Food Inventory (US2):** The app's home screen lists every saved food item with its
name, food type, storage location, expiration date, and a placeholder image. Each item shows
a colored badge: Fresh (green), Expiring Soon (orange, within 3 days), or Expired (red).
Pull down to refresh the list.

**Filter by Food Type (US4):** Tap **Filter** above the list to choose one or more food types
(e.g., Dairy & Eggs and Meat). The list then shows only items of those types, and the button shows
how many filters are active. If nothing matches, the screen says so and offers to clear the filter.
Tap **Clear** to show all items again.

**Enter Expiration Date Manually (US6):** The "Add Food" form allows the user to keep track of food item expiration dates by entering it using an intuitive calendar UI to select a valid and exact day, month, and year.

## Generative AI Usage Disclaimers

### We used Generative AI to:
- check our Deployment Diagram
- create the Food Inventory Screen
- help write the code for the food filters
- create the Add Food form UI
- help write the code for the add food functionality
