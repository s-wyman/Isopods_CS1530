# Isopods_CS1530
## Team Name: Isopods

## Team Members
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
