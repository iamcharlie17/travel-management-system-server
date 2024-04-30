const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// travelMaster
// S39eOEVcT6R6EJTt

// const uri = "mongodb+srv://<username>:<password>@cluster0.x7zkge4.mongodb.net/?retryWrites=true&w=majority";
const uri =
  "mongodb+srv://travelMaster:S39eOEVcT6R6EJTt@cluster0.x7zkge4.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const travelCollection = client
      .db("travelDB")
      .collection("travelCollection");

    app.post("/all-tourist-spots", async (req, res) => {
      const info = req.body;
      console.log(info);
      const result = await travelCollection.insertOne(info);
      res.send(result);
    });

    app.get("/all-tourist-spots", async (req, res) => {
      const cursor = travelCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get data for update
    app.get("/update-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await travelCollection.findOne(query);
      res.send(result);
    });
    //update method
    app.put("/update-details/:id", async (req, res) => {
      const id = req.params.id;
      const spot = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedSpot = {
        $set: {
          userName: spot.userName,
          email: spot.email,
          touristSpotName: spot.touristSpotName,
          countryName: spot.countryName,
          location: spot.location,
          shortDescription: spot.shortDescription,
          averageCost: spot.averageCost,
          season: spot.season,
          travelTime: spot.travelTime,
          visitorsPerYear: spot.visitorsPerYear,
          imageUrl: spot.imageUrl,
        },
      };
      const result = await travelCollection.updateOne(filter, updatedSpot, options)
      res.send(result)
    });

    //read data for mylist
    app.get("/my-list/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const query = { email: email };
      const result = await travelCollection.find(query).toArray();
      res.send(result);
    });

    // delete a tourist spot
    app.delete("/tourist-spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await travelCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Travel server is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
