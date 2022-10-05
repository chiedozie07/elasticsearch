const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser").json();
const elastic = require("@elastic/elasticsearch");

const articles = [
  {
    id: 1,
    name: "Silon 3 cuerpos",
    categories: ["silicon", "sofa", "muebles", "living", "ecocuero"],
    description: "some articles description",
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
    id: process.env.ELASTICSEARCH_CLOUD_ID,
  },
   endpoint: { url: process.env.ENDPOINT_URL },
   auth: {
     username: process.env.AUTH_USERNAMR, 
   password: process.env.AUTH_SECRET
   },
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

//post articles
router.post("/articles", bodyParser, async (req, res) => {
  try {
    const response = await elasticClient.index({
      index: "knowledge-base",
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

router.get("/articles/:id", bodyParser, async (req, res) => {
  let query = {
    index: "knowledge-base",
    id: req.params.id,
  };
  elasticClient.get(query).then((resp)=> {
    if(!resp) {
     return res.status(400).json({
      articles: resp
     })
    }
    return res.status(200).json({
      articles: resp
  })
}) .catch ((error) => {
  res.status(500).json({
      msg: error,
    });
});
})
router.delete("/articles/:id", bodyParser, async (req, res) => {
  let query = {
    index: "knowledge-base",
    id: req.params.id,
  };
  elasticClient.delete(query).then((resp)=> {
    if(!resp) {
     return res.status(400).json({
      articles: resp
     })
    }
    return res.status(200).json({
      articles: resp
  })
}) .catch ((error) => {
  res.status(500).json({
      msg: error,
    });
});
})
router.get("/articles", bodyParser, async (req, res) => {
  let query = {
    index: "knowledge-base",
  };
    console.log("LOG HERE =>", req.query);
  if (req.query.articles){
     query.q = `*${req.query.articles}*`;
    }
  elasticClient.search(query)
  .then((resp)=> {
    return res.status(200).json({
      articles: resp.hits.hits
  })
}) .catch ((error) => {
  res.status(500).json({
      msg: error,
    });
});
})
module.exports = router;
