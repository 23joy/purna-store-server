require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 7001;

app.use(cors())
app.use(express.json());


const client = new MongoClient(
  process.env.AUTH_DB_URL,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

async function startServer() {
  try {
    await client.connect();

    const db = client.db('Products')
    const productCollection = db.collection('product')
    const whyChooseCollection=db.collection('choose')

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/choose',async(req,res)=>{
      const cursor=whyChooseCollection.find();
      const result=await cursor.toArray();
      res.send(result)
    })

    app.get('/product/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)}
      const product=await productCollection.findOne(query)
      res.send(product);
    })


    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB Atlas connected successfully!');

  } finally {
    //await client.close();
  }
}

startServer();