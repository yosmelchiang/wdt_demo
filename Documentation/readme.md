# We Deliver Tech™

# Sprints
Design Phase (duration 1 week)
- Core Design
- Core functionalities

Finisher Phase (duration 1 week)
- Documentation
- Testing
- Additional features

# Web Application

## Core Design:
- Application
    -  Main page: index.html
        - Core elements and layout
            - Navbar
            - Company logo and header
            - Staff table
            - Schedule table
            - Delivery table
            - Digital clock
            - Toast notification
        -  Additional components
            - Map
            - GeoSearch
    -  Scripts: 
        -  Main
            - ./src/wdt_app.js
        -  Imports
            -  ./api
                - wdt_api.js - User data and current location
            -  ./classes
                -  wdt_employee.js - Employee
                    -  wdt_staff.js - Staff
                    -  wdt_delivery.js - Delivery
                    - ***(create a clas diagram and put it somewhere)***
            -  ./components
                -  wdt_map.js - Interactive map
                -  wdt_toast.js - Toast notification
            -  ./events
                -  wdt_event.js - Row selection and schedule input enter key
            -  ./utilities
                -  wdt_time.js - Digital clock and time conversion
                -  wdt_utility.js - Prompts, input validation and DOM manipulation

## Sources
-  Internal
    -  Main CSS: style.css
        -  Core table and buttons
        -  Navbar animation
        -  Applied company logo and styling rules
    -  Main JS: app.js
-  External
    -  Styling
        -  Styling and toast: Bootstrap
        -  Icons: Font Awesome
    -  Map
        -  Toggle map: leaflet
        -  GeoSearch: leaflet-geosearch
    -  API
        -  Get Staff User data: https://randomuser.me
        -  Get current location: https://nominatim.openstreetmap.org
    

# Core functionality

## Employee
- ***Name***: Name of the employee
- ***Surname***: Surname of the employee

## Staff
Staff class, inherits **Employee** name and surname properties.

### Staff map
- ***Staff key***: id based on *Name.Surname*
- ***Staff value***: Individual class instances created by **staffUserGet** function that makes the API calls.

### Staff Table
- ***Events***: The **Staff Map** will be used to validate the existance of instances, this is used for validations, row selection and more.
- ***Buttons***:
    - ***Out***: Interacts with the selected class instance properties and methods.
    - ***In***: Interacts with the selected class instance properties and methods.

### Funtions
- ***staffUserGet***: Triggered by page load, creates classes instances and populate rows accordingly.
- ***staffOut***: Triggered by **out** button. Creates one or more classes instances, assigns **user duration** and uses utility functions to calculate **outTime**, **duration** and **expected return time** and assign those values to the instance properties. Finally initialises **staffMemberIsLate** method to trigger a notification if an instance becomes late and updates DOM elements on the table row.
- ***staffIn***: Triggered by **in** button. Checks if the selected row has an instance then uses this instance method **staffIn** which changes the instance status to **In**. By design, the **staffMemberIsLate** triggers only if an instance has an **Out** status, therefore an instance with status **In** will not showing a late notification.
- ***staffMemberIsLate***: Triggered by instance method **staffMemberIsLate**. Uses an interval to check if the instance status property is **equals** to **out** and expected return time is **greater** than current time. If the condition passes, it creates and shows a toast notification that the user must close manually as the toast autohide attribute is set to false to fit the requirements.

## Delivery
Delivery class, inherits **Employee** name and surname properties.

### Delivery map
- ***Delivery key***: id based on *Name.Surname*
- ***Delivery value***: Individual class instances created by **addDelivery** function that uses the input field values.

### Schedule Delivery and Delivery Board Table
- ***Events***: The **Delivery Map** will be used to validate the existance of instances, this is used for validations, row selection and more.
- **Selection**: 
- ***Buttons***:
    - ***Add***: Validates if the Delivery ID exists, if not, create a new instance and populate the Delivery Board as well as initialises this instances ***deliveryDriverIsLate*** method. We are also making sure that only unique instances are created and populated to the Delivery Board.
    - ***Clear***: Clears the selected class instance properties and methods. Multiple rows on the Delivery Board can be cleared at once, we achieved this by setting and retrieving a class on each row. A confirmation box will appear to confirm that the selected driver('s) should be cleared.

### Functions
- ***addDelivery***: Triggered by **add** button. It validates every input field individually, then checks if this delivery already exists. If it doesnt, it creates a Delivery class instance and initializes the **deliveryDriverIsLate** method as well as populate the **Delivery Board** table and clears the table.

## Toast Notification
Toast notifications are individually created by each instance method: **staffMemberIsLate** and **deliveryDriverIsLate**. The main html contains only a toast header, with the purpose of dynamically creating toast notifications as instances are created and thereby being able to stack notifications. The toast auto-hide feature has been set to false so that the user must close them manually. When a toast notification is closed, the div element is also deleted from the DOM. This provides reusability.

### Staff
The toast notification for the staff will show the staff **profile picture**, **name**, **surname**, and how much **time** they are late by.
### Delivery
The toast notification for the delivery will show the delivery **name**, **surname**, what was the **return** time, **phone**, **adress** and how much **time** they are late by.

## Date and time
- Real time date and time visibility
- Time conversions


## readme.md
