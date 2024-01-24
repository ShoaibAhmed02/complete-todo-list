const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
const cors = require('cors');
app.use(cors());

// Connect to MongoDB (make sure to replace the connection string with your own)
mongoose.connect("mongodb://0.0.0.0:27017/todo").then(()=>{
    console.log("Connected to Mongo!")
}).catch((error)=>{
    console.log("error connected : ", error)
});

// Create a MongoDB schema
const itemSchema = new mongoose.Schema({
  name: String,
  date: String,
});

// Create a MongoDB model
const Item = mongoose.model('Item', itemSchema);

app.get('/', (req, res) => {
    console.log("successful!");
  res.status(200).send({ message: "Reached!" });
});

app.post('/data', async (req, res) => {
  try {
    const {item}=req.body;
    console.log("The item is : ", item)
    // Save each item from the list into MongoDB
      const newItem = new Item({
        name: item.name,
        date: item.date,
      });
      await newItem.save();
    res.status(200).send({
      data: "Data saved successfully to MongoDB",
      message: req.body.list,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      data: "Error saving data to MongoDB",
      message: error.message,
    });
  }
});

app.get('/get-data', async (req, res) => {
    
    try {
      const data = await Item.find({});
      return res.status(200).send(data)
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error fetching data from MongoDB");
    }
  });

//Deleting the item: 
app.post("/delete-item/:id",async(req,res)=>{
try{
    const deletee = req.params.id
    const del = await Item.findOneAndDelete({_id:new mongoose.Types.ObjectId(deletee)});
    if(del){
         res.status(200).send({message:"Item is deleted Successfully!"})
    }else{
        res.status(500).send({message:"Item is not deleted Successfully!"})
    }
   
}catch(error){
    console.log("error : ", error)
    res.status(500).send({message:"Server issue: ", error})
} 
})

app.post('/edit-item/:id', async (req, res) => {
  console.log("The id is :", req.params.id)
  try {
     const data = await Item.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $set: { name: req.body.name } },
        { new: true } // To return the modified document
     );
     if (!data) {
        return res.status(404).send({ message: "Item not found" });
     }
     res.status(200).send({ message: data });
  } catch (error) {
     console.error(error.message);
     res.status(500).send({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
