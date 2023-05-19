## Delivery Fee Calculator

The goal of the assignment is to showcase your coding skills and ability to develop features. We DON'T expect you to build production quality code. This is a highly important part of the hiring process so it's crucial to put effort into this without making it too bloated. Reviewers will put weight on three main aspects: code quality, maintainability, and testing. Based on the results of the assignment review, we will make the decision on proceeding to the technical interview.

Your task is to write a delivery fee calculator. This code is needed when a customer is ready with their shopping cart and we’d like to show them how much the delivery will cost. The delivery price depends on the cart value, the number of items in the cart, the time of the order, and the delivery distance.

### Specification
Rules for calculating a delivery fee
* If the cart value is less than 10€, a small order surcharge is added to the delivery price. The surcharge is the difference between the cart value and 10€. For example if the cart value is 8.90€, the surcharge will be 1.10€.
* A delivery fee for the first 1000 meters (=1km) is 2€. If the delivery distance is longer than that, 1€ is added for every additional 500 meters that the courier needs to travel before reaching the destination. Even if the distance would be shorter than 500 meters, the minimum fee is always 1€.
  * Example 1: If the delivery distance is 1499 meters, the delivery fee is: 2€ base fee + 1€ for the additional 500 m => 3€
  * Example 2: If the delivery distance is 1500 meters, the delivery fee is: 2€ base fee + 1€ for the additional 500 m => 3€
  * Example 3: If the delivery distance is 1501 meters, the delivery fee is: 2€ base fee + 1€ for the first 500 m + 1€ for the second 500 m => 4€
* If the number of items is five or more, an additional 50 cent surcharge is added for each item above four
  * Example 1: If the number of items is 4, no extra surcharge
  * Example 2: If the number of items is 5, 50 cents surcharge is added
  * Example 3: If the number of items is 10, 3€ surcharge (6 x 50 cents) is added    
* The delivery fee can __never__ be more than 15€, including possible surcharges.
* The delivery is free (0€) when the cart value is equal or more than 100€. 
* During the Friday rush (3 - 7 PM UTC), the delivery fee (the total fee including possible surcharges) will be multiplied by 1.1x. However, the fee still cannot be more than the max (15€).

### The task

Build a delivery fee calculator web app using **React and TypeScript**, which calculates a delivery fee based on user input and shows the calculated delivery fee to the user.

#### Input fields

| Field             | Type      | Description                                                                                             | Example value                             |
|:---               |:---       |:---                                                                                                     |:---                                       |
|Cart value         |Float      |Value of the shopping cart in euros.                                                                     |__20__                                     |
|Delivery distance  |Integer    |The distance between the store and customer’s location __in meters__.                                    |__2235__ (2235 meters = 2.235 km)          |
|Number of items    |Integer    |The __number of items__ in the customer's shopping cart.                                                 |__4__ (customer has 4 items in the cart)   |
|Order time         |Date + Time|The date/time when the order is being made (see rules-section how rush hours affect the delivery price)  |You can choose the most suitable format    |
