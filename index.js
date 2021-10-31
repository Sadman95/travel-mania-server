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

//DB INFO:
/* 
user: travel-mania_db
pass: pRdeZQ3d8tts9zB6
 */

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
    const usersCollection = database.collection('users');

    // GET Places:
    app.get("/places", async (req, res) => {
      const cursor = placesCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    });

    //POST Places:
    app.post("/places", async (req, res) => {
      const place = req.body;
      const result = await placesCollection.insertOne(place);
      res.json(result);
    });
    // GET Guides:
    app.get("/guides", async (req, res) => {
      const cursor = guidesCollection.find({});
      const guides = await cursor.toArray();
      res.send(guides);
    });

    //POST Guides:
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
    app.post('/users', async(req, res) =>{
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
    })

    //GET USERS:
    app.get('/users', async(req, res) =>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    })

    //GET API FOR SPECIFIC USER:
    app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await usersCollection.findOne(query);
        res.json(user);
      });
    
    //DELETE SPECIFIC USER:
    app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const user = await usersCollection.deleteOne(query);
        res.json(user);
    })

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
