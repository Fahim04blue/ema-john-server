const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

//dotenv
require("dotenv").config();
// console.log(process.env.DB_PASS);

//MongoDB

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n7osx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emajohnDB").collection("products");
  const ordersCollection = client.db("emajohnDB").collection("orders");
  // perform actions on the collection object
  console.log("DB connected");

  app.post("/addProducts", (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });
  app.get("/products", (req, res) => {
    productsCollection
      .find({})
      .limit(20)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    productsCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(process.env.PORT || 5000, () => console.log("Listening to 5000"));
