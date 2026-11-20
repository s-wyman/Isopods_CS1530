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

**View Food Inventory (US2):** The app's home screen lists every saved food item with its
name, food type, storage location, expiration date, and a placeholder image. Each item shows
a colored badge: Fresh (green), Expiring Soon (orange, within 3 days), or Expired (red).
Pull down to refresh the list. If the inventory is empty, the screen shows an "Add food" button
(adding from the app is coming with US1).

**Adding food (temporary):** Until US1 is built, food items are added in the backend terminal
with the `add` command. Item names can't contain spaces (use `greek-yogurt`), and items are
stored in memory, so they're cleared when the backend stops.
Use one of these food type keys: `produce`, `meat`, `seafood`, `dairy-eggs`, `bread-bakery`,
`grains-pasta`, `canned-jarred`, `condiments-sauces`, `snacks`, `sweets`, `beverages`, `other`.
Example: `add milk dairy-eggs fridge 2026 11 25`

**Filter by Food Type (US4):** Tap **Filter** above the list to choose one or more food types
(e.g., Dairy & Eggs and Meat). The list then shows only items of those types, and the button shows
how many filters are active. If nothing matches, the screen says so and offers to clear the filter.
Tap **Clear** to show all items again.

## Generative AI Usage Disclaimer

We used Generative AI to check our Deployment Diagram, create the Food Inventory Screen, and to help write the code for the food filters.
