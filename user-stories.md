# E1: Food Inventory Management
Users can add, view, update, delete, and organize food items in their inventory.

## US1: Add Food Item
As a user, I want to add a food item to my inventory so that I can keep track of the food I have at home.
FR: FR1, FR4, FR11
Priority: Must
MVP: yes

- [ ] The form to add a new food item includes required fields for the item's name, food type, storage location, and expiration date, with the option to attach an image.
- [ ] The system prevents submission when a required field is missing, highlights the invalid fields, and preserves valid ones.
- [ ] After the user submits, the new item appears in the inventory list.
- [ ] If the user doesn't upload an image, the food item uses a default placeholder when displayed.

## US2: View Food Inventory
As a user, I want to view my logged food items so that I know what food I currently have available.
FR: FR2
Priority: Must
MVP: yes

- [ ] The user can open a list of their saved food items.
- [ ] Each listed item displays its name, food type, storage location, expiration date, and either its user-uploaded image or a default placeholder.
- [ ] Each item's expiration status is shown as "Fresh", "Expiring Soon" (within 3 days), or "Expired" using text, an icon, and color.
- [ ] If the inventory is empty, the system displays a button for the user to add new items.
- [ ] When the inventory is viewed again after an item is added, updated, or deleted, the list reflects that change.
- [ ] The list loads within two seconds when the user has up to 100 items.

## US3: Delete Food Item
As a user, I want to delete food items from my inventory so it only shows food I still have.
FR: FR3
Priority: Must
MVP: yes

- [ ] The user can select an existing food item to delete.
- [ ] The system requests confirmation before deleting the selected item.
- [ ] If the user confirms, the item is removed from the stored inventory and displayed list.
- [ ] If the user cancels, the item stays in the inventory unchanged.
- [ ] A deleted item no longer generates future expiration notifications.

## US4: Filter Food Items by Food Type
As a user, I want to filter my inventory by food type so that I can find items in a particular category.
FR: FR10
Priority: Should
MVP: yes

- [ ] The user can select a food type, such as meat, produce, dairy, or grains as a filter.
- [ ] When a filter is active, only items belonging to that category are displayed.
- [ ] If no items match the selected food type, the system displays a message that no results were found.
- [ ] The user can clear the filter to view items of all food types again.

## US5: Filter Food Items by Storage Location
As a user, I want to filter my inventory by storage location so that I can find items stored in a particular place.
FR: FR6
Priority: Should
MVP: yes

- [ ] The user can select a storage location, such as refrigerator, freezer, or pantry as a filter.
- [ ] When a filter is active, only items assigned to that location are displayed.
- [ ] If no items match the selected location, the system displays a message that no results were found.
- [ ] The user can clear the filter to view items from all storage locations again.

# E2: Expiration Tracking
Users can record, edit, sort, and receive reminders about food expiration dates to help reduce waste.

## US6: Enter Expiration Date Manually
As a user, I want to enter a food item's expiration date manually so that I can track when the item should be used.
FR: FR4
Priority: Must
MVP: yes

- [ ] When adding a food item, the user can pick an expiration date from a date picker, so only valid dates can be entered.
- [ ] The selected date is saved with the food item and shown alongside the item in the inventory.

## US7: Enter Expiration Date Using an Image
As a user, I want to take a photo of a food item's printed expiration date so that I can record the date without entering it manually.
FR: FR4
Priority: Could
MVP: no

- [ ] When adding a food item, the user can take a photo or upload an image showing the printed expiration date.
- [ ] The system attempts to extract the expiration date from the image and displays it to the user for confirmation.
- [ ] If the extracted date is incorrect or not found, the user can manually enter the correct date.
- [ ] The confirmed expiration date is saved with the food item and shown alongside the item in the inventory.

## US8: Edit Expiration Date
As a user, I want to edit a saved food item's expiration date so that I can correct mistakes.
FR: FR5
Priority: Must
MVP: yes

- [ ] The user can select an existing food item to update.
- [ ] The user can choose a replacement expiration date using a date picker.
- [ ] After saving, the new expiration date replaces the previous one and the food item's expiration status updates to reflect the change.
- [ ] If the user cancels the edit, the original expiration date remains unchanged.
- [ ] Future expiration notifications reflect the updated date.

## US9: Sort Food Items by Expiration Date
As a user, I want to sort my food inventory by expiration date so that I can decide what to eat first.
FR: FR7
Priority: Should
MVP: yes

- [ ] The user can sort their inventory in ascending order to display items with the earliest expiration dates first.
- [ ] The user can sort their inventory in descending order to display items with the latest expiration dates first.
- [ ] Sorting changes the display order without modifying any stored information.

## US10: Receive Upcoming Expiration Notifications
As a user, I want reminders when my food is approaching its expiration date so that I can use it before then.
FR: FR9
Priority: Must
MVP: yes

- [ ] When one or more food items expire within three days, the user receives a single push notification listing them.
- [ ] The notification identifies each expiring food item and its expiration date.
- [ ] If no food items expire within three days, no notification is sent.
- [ ] The system sends no more than one expiration summary notification per day.
