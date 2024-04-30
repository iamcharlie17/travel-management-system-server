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

    //travel collection
    const travelCollection = client
      .db("travelDB")
      .collection("travelCollection");

    //countries collection

    const countryCollection = client
      .db("countryDB")
      .collection("countryCollection");

    //post tourist spots
    app.post("/all-tourist-spots", async (req, res) => {
      const info = req.body;
      console.log(info);
      const result = await travelCollection.insertOne(info);
      res.send(result);
    });

    //post countries

    const countries = [
      {
        imageUrl: "https://i.ibb.co/0ZMF4xY/bangladesh.jpg",
        countryName: "Bangladesh",
        shortDescription:
          "Bangladesh, a South Asian country, is known for its lush greenery, rich history, and vibrant culture.",
      },
      {
        imageUrl: "https://i.ibb.co/7QWNqtP/thailand.jpg",
        countryName: "Thailand",
        shortDescription:
          "Thailand, a Southeast Asian country, is famous for its ornate temples, beautiful beaches, and delicious cuisine.",
      },
      {
        imageUrl: "https://i.ibb.co/0G0TWRT/indonesia.jpg",
        countryName: "Indonesia",
        shortDescription:
          "Indonesia, an archipelago in Southeast Asia, is renowned for its diverse landscapes, ancient temples, and rich biodiversity.",
      },
      {
        imageUrl: "https://i.ibb.co/WkkC4XM/malaysia.jpg",
        countryName: "Malaysia",
        shortDescription:
          "Malaysia, a Southeast Asian country, is known for its modern cities, stunning islands, and multicultural society.",
      },
      {
        imageUrl: "https://i.ibb.co/4tN5c6s/vietnam.jpg",
        countryName: "Vietnam",
        shortDescription:
          "Vietnam, a Southeast Asian country, is famous for its lush countryside, bustling cities, and delicious street food.",
      },
      {
        imageUrl: "https://i.ibb.co/HpmxYgs/combodia.webp",
        countryName: "Cambodia",
        shortDescription:
          "Cambodia, a Southeast Asian country, is home to ancient temples, lush jungles, and a rich cultural heritage.",
      },
    ];

    const result = await countryCollection.insertMany(countries);
    console.log(`${result.insertedCount} documents were inserted`);

    //get countries
    app.get("/countries", async (req, res) => {
      const result = await countryCollection.find().toArray();
      res.send(result);
    });

    //get tourist spots
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
      const result = await travelCollection.updateOne(
        filter,
        updatedSpot,
        options
      );
      res.send(result);
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
