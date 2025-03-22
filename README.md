E-Commerce Project - README

# Project Overview--
-- This is a fully functional e-commerce application built using MongoDB, Node.js, Express, React, and Stripe Payment Integration. The project ensures stock validation and prevention of duplicate orders using MongoDB transactions (which require replication setup).

⚙️ How to Set Up & Run the Project--
1️⃣ Install Dependencies-
-- Go to both the client and server folders and run:
npm install

then create new .env file in server.js
and put this 

MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=medheerajput
NODE_ENV=development
STRIPE_SECRET_KEY = sk_test_tR3PYbcVNZZ796tH88S4VQ2u


2️⃣ Start the Project-
-- After installing dependencies, start both frontend and backend:
# In the client folder
npm start

# In the server folder
npm start

If the server starts successfully, you should see this output:
--Server running on port 5000
--MongoDB Connected: localhost
--Database seeded successfully!
# This means predefined products have been added to the database.

3️⃣ Prevent Re-Seeding the Database
- After the first successful database seeding, go to server.js and comment out this line:
// seedDB();
- This ensures products don’t get added repeatedly.

🛒 How to Use the Project
1. Register a new user
2. Login with your credentials
3. Browse products (by searching and filtering acc to price range)& add them to your cart
4. Go to the cart section
-- You can remove products from the cart
-- Click the Checkout button

5. Enter payment details
-- Use this test card for payment processing:
Card Number: 4242 4242 4242 4242
Expiration Date: 12/34
CVV: 123

6. Complete the payment
-- If successful, the order will be placed


🔄 Handling Transactions & Stock Validation
--To prevent duplicate orders and ensure stock validation, MongoDB transactions are used. MongoDB transactions require a replica set, so follow these steps to set up replication:

--Setting Up MongoDB Replication Locally

1️⃣ Stop MongoDB if it’s already running
- Open Services on Windows
- Find MongoDB
- Stop the service

2️⃣ Start MongoDB with replication
-- Open Command Prompt (CMD) and run:
- mongod --replSet rs0 --bind_ip localhost --dbpath "C:\data\db"

3️⃣ Open another CMD and initiate the replica set(use this command into command prompt)
- mongosh
- rs.initiate()

4️⃣ Verify if the replica set is working
- rs.status()

-- Once this is done, transactions will work properly in your local system.

📌 Note
-- If you find setting up replication difficult, I have recorded a short video demo of the complete project. You can check that video on GitHub.