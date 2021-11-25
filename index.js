const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khkjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Run Function
const run = async () => {
  try {
    await client.connect();
    const database = client.db("Products");
    const productsCollection = database.collection("Products");
    const orderCollection = database.collection("Order");
    const reviewCollection = database.collection("Review");
    const usersCollection = database.collection("Users");

    // Post
    app.post("/products", async (req, res) => {
      const body = req.body;
      const result = await productsCollection.insertOne(body);
      res.send(result);
    });

    // Get
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).limit(6).toArray();
      res.send(result);
    });
    // Get for explore
    app.get("/explore", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });
    // Single data load
    app.get("/singleDataLoad/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    // Ordered data post
    app.post("/orderedDataPost", async (req, res) => {
      const body = req.body;
      const result = await orderCollection.insertOne(body);
      res.send(result);
    });
    // My order
    app.get("/orderedDataGet/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });
    // Delete order
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    // Manage orders
    app.get("/manageOrders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });
    // Review post
    app.post("/review", async (req, res) => {
      const body = req.body;
      const result = await reviewCollection.insertOne(body);
      res.send(result);
    });
    // Product delete form manage order
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    // Handle Shipped
    app.put("/shipped/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.updateOne(query, {
        $set: { productStatus: "Shipped" },
      });
      res.send(result);
    });
    // Save user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // Make admin
    app.put("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    // Check Admin
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });
    // Get reviews
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("All Right");
});
app.listen(port, () => {
  console.log("Listening To Port ", port);
});
