# WEB103 Project 4 - Bolt Bucket 🏎️

Submitted by: **Thai**

About this web app: **Bolt Bucket is a DIY custom car builder application. It enables users to customize a sleek sports car across four distinct categories: paint color, roof style, wheel selection, and interior design. The app recalculates prices dynamically, renders the vehicle profile using a custom-tailored SVG vector, highlights and blocks incompatible option selections (e.g., locking out incompatible combinations in real time), and provides full CRUD capabilities (create, read, update, delete) synchronized with a Render PostgreSQL database.**

Time spent: **5** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table (`custom_cars` and `car_options`).**
  - [ ] **NOTE: Add a screenshot of your Render dashboard demonstrating that your Postgres database is available below in the Walkthrough section.**
  - [ ] **NOTE: Add a terminal screenshot demonstrating your table contents using `SELECT * FROM custom_cars;` in the Walkthrough section.**
- [x] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [x] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [x] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
- [x] **The visual interface changes in response to at least one customizable feature.**
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [x] **Users can view a list of all submitted `CustomItem`s.**
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**

The following **optional** features are implemented:

- [x] **Selecting particular options prevents incompatible options from being selected even before form submission (Early Warning Incompatibility Rules)**

The following **additional** features are implemented:

- [x] **Interactive SVG Vector Car Preview**: Developed a custom `CarPreview` component that dynamically adjusts SVG path fills, roof styling elements, and wheel rim spoke geometries based on options selected in real time.
- [x] **Modular Utilities Module**: Extracted complex price calculation and validation constraints into `calcprice.js` and `validation.js` utility helper files, keeping React page controllers clean and DRY.
- [x] **Modern Dark UI Design**: Handled responsive grid layouts, hover states, clear visual indicators for blocked selections, and detailed price listings for premium design aesthetics.

---

## Video Walkthrough & Screenshots

### App Walkthrough GIF
Here's a walkthrough of the implemented required and optional features:

<div>
    <a href="https://www.loom.com/share/d9bbafc334ff4a1296a51b1232019041">
      <p>BoltBucket Car Customizer Walkthrough and Operations - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/d9bbafc334ff4a1296a51b1232019041">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/d9bbafc334ff4a1296a51b1232019041-acd00a321b0dafe9-full-play.gif#t=0.1">
    </a>
  </div>
