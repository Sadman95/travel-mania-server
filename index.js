const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');


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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server(){
    try{
        await client.connect();
        
        const database = client.db('travel-mania-users');
        const travelsCollection = database.collection('travels');

        const test = {
            igmUrl: 'https://i.ibb.co/qshPrpB/plitvice-lakesjpg.jpg',
            title: 'Plitvice Lakes, Croatia',
            details: 'The Plitvice Lakes can be found on Croatia’s Adriatic Sea coast, just lingering on the border between Zadar and the nation’s capital, Zagreb.These lakes consist of 16 bodies of water that are all joined together by a variety of cascading waterfalls and fascinating bridges, flanked by age-old emerald forests that hold wildlife aplenty: birds, wolves, bears, and more!'
        }
        const result = await travelsCollection.insertOne(test);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }
    finally{
        // await client.close();
    }
}

server().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('running travel mania server');
})

app.listen(port, () =>{
    console.log('running travel-mania at port ', port);
})

