const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5555;

//MIDDLEWARE:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a65gj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function server() {
  try {
    await client.connect();

    const database = client.db("travel-mania-users");
    const placesCollection = database.collection("places");
    const guidesCollection = database.collection("guides");
    const usersCollection = database.collection("users");
    const bookingsCollection = database.collection("bookings");

    // GET Places:
    app.get("/places", async (req, res) => {
      const cursor = placesCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    });

    // GET SPECIFIC PLACE:
    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const place = await placesCollection.findOne(query);
      res.json(place);
    });

    // delete SPECIFIC PLACE:
    app.delete("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const place = await placesCollection.deleteOne(query);
      res.json(place);
    });

    //POST PLACES:
    app.post("/places", async (req, res) => {
      const place = req.body;
      const result = await placesCollection.insertOne(place);
      res.json(result);
    });

    //update place:
    app.put("/places/:id", async (req, res) => {
      const id = req.params.id;
      const place = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedPlace = {
        $set: {
          title: place.title,
          imgUrl: place.imgUrl,
          details: place.details,
          cost: place.cost,
        },
      };
      const result = await placesCollection.updateOne(
        filter,
        updatedPlace,
        options
      );
      res.json(result);
    });

    // GET GUIDES:
    app.get("/guides", async (req, res) => {
      const cursor = guidesCollection.find({});
      const guides = await cursor.toArray();
      res.send(guides);
    });

    //POST GUIDES:
    app.post("/guides", async (req, res) => {
      const guide = req.body;
      const result = await guidesCollection.insertOne(guide);
      res.json(result);
    });

    //GET API FOR SPECIFIC ID:
    app.get("/guides/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await guidesCollection.findOne(query);
      res.json(result);
    });

    //UPDATE API OF SPECIFIC GUIDE:
    app.put("/guides/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateGuideDoc = {
        $set: {
          name: req.body.name,
          email: req.body.email,
          image: req.body.image,
        },
      };
      const result = await guidesCollection.updateOne(
        filter,
        updateGuideDoc,
        options
      );
      res.json(result);
    });

    //DELETE GUIDE FROM EXISTING GUIDES:
    app.delete("/guides/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await guidesCollection.deleteOne(query);
      res.json(result);
    });

    //POST USERS:
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    //GET USERS:
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //GET API FOR SPECIFIC USER:
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.json(user);
    });

    //DELETE SPECIFIC USER:
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.deleteOne(query);
      res.json(user);
    });

    //Subscribe update:
    app.put("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const options = { upsert: true };
      const updateUser = {
        $set: {
          subscribed: true,
        },
      };
      const result = await usersCollection.updateOne(
        query,
        updateUser,
        options
      );
      res.json(result);
    });

    //unsubscribe:
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
        subscribed: true,
      };

      const updateUser = {
        $set: {
          subscribed: false,
        },
      };
      const result = await usersCollection.updateOne(query, updateUser);
      res.json(result);
    });

    //GET API FOR BOOKING:
    app.get("/bookings", async (req, res) => {
      const cursor = bookingsCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    //POST BOOKINGS:
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.json(result);
    });

    //GET API FOR SPECIFIC BOOKING:
    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingsCollection.findOne(query);
      res.json(booking);
    });
    //Delete order/booking:
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

server().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running travel mania server");
});

app.listen(port, () => {
  console.log("running travel-mania at port ", port);
});
