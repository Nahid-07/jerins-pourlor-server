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
  app.get("/services", async (req, res) => {
    const query = {};
    const services = await servicesCollection.find(query).toArray();
    res.send(services);
  });
  app.post("/booklists", async (req, res) => {
    const bookedItems = req.body;
    const result = await bookedServiceCollection.insertOne(bookedItems);
    res.send(result);
  });
  
  app.get('/booklist', async(req,res)=>{
    const query={};
    const booked = await bookedServiceCollection.find(query).toArray()
    res.send(booked)
  })
}
run().catch((err) => console.log(err.message));

app.listen(port, () => {
  console.log("port is running");
});
