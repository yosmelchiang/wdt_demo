# Jira Project

# Sprint Plan (4 weeks)
In this project, we are going to use 4 weeks to develop our application for the We Deliver Tech  application, each focusing on a set of epics, issues and tasks.

## Sprint 1 (18 Nov - 24 Nov) - Design Phase (1 week)
### Goal
Set up the development environment, structure the project and implement core features.

### Overview: 
We want to establish the foundational components for the project, focusing on dependencies, layout, navigation and creating core tables with styling. This sprint is aimed to complete all the essential groundwork.

This sprint is categorized in the following main focus areas:

- ![alt text](epics.png) Environment Design covers application structure, dependencies as well as internal and external libraries.
- ![alt text](epics.png) Application Design covers the design of the application itself, main componenets and elements required for our application to function without any specific functionality added.
- ![alt text](epics.png) API Integration covers the API call functionality needed for our Staff users to be created and populated into our Staff Management application.

### Epics
- ![alt text](epics.png) Environment Design
    - Issues
    1. ![alt text](tasks.png) Define application structure 
        - The directory structure for this project will be based on a logical and modular structure. We want want to have the main application easily accessible for our client while dependencies are placed inside our `src` folder, their in their own folder: 
        - `/api`: API-related scripts.
        - `/classes`: Reusable class definitions and functions.
        - `/components`: User Interface elements, such as toasts or additional features.
        - `/events`: Event management, such as row selection.
        - `/styles`: Stylesheets.
        - `/utilities`: Utility functions and shared resources.
    2. ![alt text](tasks.png) Create main application
        - The main application will consist of a HTML file that is going to be used to structure the content of the webpage. This page will mostly consist of text, images, tables and images.
        - The path to the main application is: `/Web Application/index.html`


    3. ![alt text](tasks.png) Set up project core dependencies and external libraries.
        - We are going to use CSS stylesheets for the styling and positioning of our web elements. We are also going to rely on JavaScript for the manipulation of web elements, for example populating the tables, selecting rows and also time and date conversion as well as conditional logic for the notification to show up on the screen when staffs or deliveries are late. Finally we are going to use Bootstrap for our toast notification, but also some additional styling and use of Icons. While Bootstrap provides us with a wide variaty of icons, we are also going to use Font Awesome for more icon options.
            - Overview of Core Dependencies
                - CSS: Stylesheet: `/Web Application/src/styles/wdt_style.css`
                - JS: Main script: `/Web Application/src/wdt_app.js`
                - Frameworks (these are all linked through CDN in the HEAD of our `index.html` application.): 
                    - Bootstrap (CSS, JS and Icons CDN)
                    - Font Awesome (Icons)
- ![alt text](epics.png) Application Design
    - Issues
    1. ![alt text](tasks.png) Create main HTML layout structure
        - Our main goal for the application layout is to have a main container with divs in it, this way we can position and have a consistent structure over the individual divs inside the container.
        - HTML HEAD: device viewport support and core dependencies.
        - HTML BODY:
            - Main div container
                - Navbar
                - Logo and header
                - Staff
                - Schedule
                - Delivery
                - Footer (digital clock)
    2. ![alt text](tasks.png) Build the navigation bar layout
        - Our nav will consist of 3 items:
        - `Dashboard`: A link that will redirect the user to the front page.
        - `Inventory`: A link with no reference
        - `Orders`: A link with no reference, hovering over this will activate a dropdown of the same sub-items as `Inventory`.
    3. ![alt text](tasks.png) Implement hidden sub-menus (Inventory and Orders)
        - For our navbar, we want to have additional functionality for future use, `Inventory` and `Orders` should have sub-items that we can use.
        - `Inventory`: Hovering with the mouse will activate a dropdown of sub-items, `Search`, `Add` and `Remove`. These sub-items have no reference at the moment, will have added functionality in future updates.
        - `Orders`: Hovering with the mouse will activate a dropdown of the same sub-items as `Inventory`.
        - The hovering effect are applied through our `/Web Application/src/styles/wdt_style.css` stylesheet. The sub-items are initially hidden and activated on mouse hover.
    4. ![alt text](tasks.png) Set the default page to the Dashboard
        While our `Dashboard` element of the Navbar, has no dropdown functionality, we want our user to be able to navigate back to the frontpage. We have therefore set the link reference to (`index.html`).
    5. ![alt text](tasks.png) Add hover animations for Navbar sub-menus (Inventory and Orders)
        - We want the sub-menus to appear with a nice opacity change from 0% to 100% on mouse hover, as well as change background color from #3e3c3c to #83d1e1 (company branding)
    6. ![alt text](tasks.png) Apply company branding to Navbar
        - We want our Navbar to follow the company branding rules of font, text color and background color.
        - Navbar
            - `font-family: 'Consolas'`
        - Navbar Menu items
            - `background-color: #0e8ea8;`
            - `color: #fff`
        - Navbar Sub-menu items:
            - `background-color: #83d1e1`
            - `color: #212529`
    7. ![alt text](tasks.png) Build the company logo and header
        - We want the company logo and header be on top of the page, but positioned under the navbar as well as centered.
        - These will follow company branding rules set to all web page text elements
    8. ![alt text](tasks.png) Apply company branding to web page text elements
        - `font-family: 'Calibri'`
        - `color: #212529`
    9. ![alt text](tasks.png) Design the Staff Management Dashboard layout
        - Our Staff dashboard will consist a table of 8 columns, and will be populated by 5 rows. The header of our table being `Picture`, `Name`, `Surname`, `Email adress`, `Status`, `Out Time`, `Duration` and `Expected Return Time`. The table body will remain empty, as this will be populated by fetched API data from `https://randomuser.me/api/`, each row for a unique user.
    10. ![alt text](tasks.png) Design the Schedule Delivery Board Table layout
        - Our Schedule table will consist of 6 columns and only 1 row, where we will place the inputs for the user to type in the user to schedule a delivery for. The headers for this table will be as follow: `Vehicle`, `Name`, `Surname`, `Phone`, `Adress` and `Return time`. These inputs will be validated for empty fields and wrong formats.
        - Our Delivery board will have the same headers as the Schedule table, but with no rows. The rows will be added as by the receptionist interacts with the Schedule table.
    11. ![alt text](tasks.png) Add table buttons
        - Our staff table will have an `In` and `Out` button for clocking Staffs.
        - Our schedule delivery table will have an `Add` button.
        - Our delivery board will have a `Clear` button.
    12. ![alt text](tasks.png) Implement company branding to tables and buttons
        - As the style requirements are quite extensive, we are not going to list them here, but we are going to make sure for company branding compliance for these elements as well.
    13. ![alt text](tasks.png) Design digital clock
        - There is no much to design here, but we are going to use a footer to place our digital clock, so we apply this at the end of our page.
    

- ![alt text](epics.png) Staff: API Integration
    - Issues
    14. ![alt text](tasks.png) Implement class structure (base class (employee), inheritance for staff)
        - As we fetch users from the API, we will be creating instances for each user. Each user will have its own instance and a row will be generated from that. We will have a base class, employee with no methods, only name and surname while our staff class will inherit from employee, it will have specific unique properties for this dashboard, such as `email adress`, `status`, `Out Time` and so on... As well as unique methods for `Clocking Out` and `Clocking In`.
    15. ![alt text](tasks.png) Create the staffUserGet function to fetch 5 unique staff members
        - We are using a `Map` to store our user instances, this way we can access them later in our code and interact with its properties and methods. 
        - Here is how the `staffUserGet` function works:
            - `staffUsreGet`: Fires up the API call and waits for a response.
            - `New instance`: Creates an instance for every fetched user
            - `Map` Stores this instance in our `Map`
            - `Populate Row`: Populates the staff table with this new instance.
    16. ![alt text](tasks.png) Populate the Staff table with API data
        - Our `populateRow` takes care of the table elements. This function will be called from `staffUserGet` function, create a new row with the HTML elements for each user and append it to our `staffTableBody`.

## Screenshots and explanation

### Backlog
![alt text](image.png)

### Explanation
We have decided to prioritze these epics and issues first in order to cover as much groundwork as possible and cover the basic structure of our application. From here we can make sure we are happy with how things look, but also fit together and gain a wider perspective on where things could be improved from a design point of view.

## Sprint 2 (18 Nov - 24 Nov) - Staff Functionality (1 week)
### Goal
The goal of this sprint is to lay down the core functionality for managing staff attendance.

### Overview: 
The API integration epic in the Application Design sprint took care of the user `picture`, `name`, `surname` and `email adress`. What this sprint will be based on is adding functionality to the `Out` button, which will prompt the receptionist with a time duration and then fill in the `Status`, `Out Time`, `Duration` and `Expected Return Time` based on this input.

This sprint is categorized in the following focus areas:
- ![alt text](epics.png) Staff Clocking System covers the selecting a row and being able to clock the staff in/out functionality.
- ![alt text](epics.png) Notifications for late staff members covers the triggering of a toast notification that fires when expected return time less than current time in our digital clock.

### Epics
- ![alt text](epics.png) Staff Clocking System
    - Issues
    1. ![alt text](tasks.png) Implement row selection functionality
        - `enableRowSelection`: This function applies a specific class for mouse selected rows, that will be used for styling as well as an element identifier. The selection of either table rows should not conflict. The styling of this class will consist will be the following:
        - `background-color:#198754;`
        - `color: white;`
    2. Add validation for Out Time duration input.
    3. Implement staffOut functionality (update object, calculate duration/return time, update table).
    4. Implement staffIn functionality (clear Out Time, Duration, Expected Return Time, update status).
    5. Implement staffmemberIsLate function for toast notification if a staff member is late.
    6. Design and style toast notifications (popup, close button and text elements).
    7. 

# Reflection Report
        

