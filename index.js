const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running on port 5000");
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ugpmzsn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  const servicesCollection = client
    .db("Jerins-pourlorDB")
    .collection("Services");

  const bookedServiceCollection = client
    .db("Jerins-pourlorDB")
    .collection("BookedItems");
  const usersCollection = client
    .db("Jerins-pourlorDB")
    .collection("Users");

  app.get("/services", async (req, res) => {
    const query = {};
    const cursor = servicesCollection.find(query).limit(3)
    const services = await cursor.toArray();
    res.send(services);
  });

  app.get('/explore-all-services', async(req,res)=>{
    const query = {};
    const services = await servicesCollection.find(query).toArray();
    res.send(services)
  })

  app.post('/services',async(req,res)=>{
    const services = req.body;
    const result = await servicesCollection.insertOne(services);
    res.send(result);
  })

  app.post("/booklists", async (req, res) => {
    const bookedItems = req.body;
    const result = await bookedServiceCollection.insertOne(bookedItems);
    res.send(result);
  });
  
  app.get('/booklist', async(req,res)=>{
    const query={};
    const booked = await bookedServiceCollection.find(query).toArray()
    res.send(booked)
  });

  app.post('/users', async(req,res)=>{
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result)
  });
  app.get('/users', async(req,res)=>{
    const query = {};
    const users = await usersCollection.find(query).toArray();
    res.send(users)
  })
}
run().catch((err) => console.log(err.message));

app.listen(port, () => {
  console.log("port is running");
});
