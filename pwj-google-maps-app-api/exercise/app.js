const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gary_liggins:Alysha5545@cluster0.fxf9m.mongodb.net/googleMaps?retryWrites=true&w=majority', {
   useNewUrlParser : true, useUnifiedTopology: true 
});

app.use(express.json({limit: "50mb"}));

app.post("/api/stores", (req,res) => {
    let dbStores = req.body
    console.log(dbStores);
    res.send("you have posted")
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})