const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser").json();
const elastic = require("@elastic/elasticsearch");

const products = [
  {
    id: 1,
    name: "Silon 3 cuerpos",
    categories: ["silicon", "sofa", "muebles", "living", "ecocuero"],
    description: "some product description",
  },
  {
    id: 2,
    name: "iPhone 13 pro",
    categories: ["s-series", "dova", "jar"],
    description: "A mobile phone device",
  },
  {
    id: 3,
    name: "Electric fan",
    categories: ["seiling-fan", "standing-fan", "industrial-fan"],
    description: "Electric fan",
  },
  {
    id: 4,
    name: "Fried rice",
    categories: ["fried", "regular", "boiled"],
    description: "delicious rice",
  },
  {
    id: 5,
    name: "meat",
    categories: ["chiken", "beaf", "white-meat", "red-meat"],
    description: "some delicious meat",
  },
];

//get req
router.get("/", (req, res) => {
  res.status(200).send("Welcome To Dispatch-zee Search Engine!!!");
});

const { Client } = require("@elastic/elasticsearch");
const elasticClient = new Client({
  cloud: {
    id: "dispatchz_elastic_search:==",
  },
  endpoint: { url: "http://localhost:9200/api/" },
  auth: { username: "elastic", password: "" },
});

//err logs
router.use((req, res, next) => {
  elasticClient
    .index({
      index: "logs",
      body: {
        url: req.url,
        method: req.method,
      },
    })
    .then((res) => {
      console.log("LOGS INDEX", res);
    })
    .catch((err) => console.log("LOGS ERROR", err));
  next();
});

//post products
router.post("/products", bodyParser, async (req, res) => {
  try {
    const response = await elasticClient.index({
      index: "products",
      body: req.body,
    });
    console.log("response", response)
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      msg: "Error Occured!",
      err,
    });
  }
});

//get products
router.get("/products/:id", bodyParser, async (req, res) => {
  let query = {
    index: "products",
    id: req.params.id,
  };
  try {
    const response = await elasticClient.get(query)
   return res.status(200).json({response})
  } catch (error) {
    res.status(500).json({
        msg: error,
      });
  }
});

module.exports = router;
