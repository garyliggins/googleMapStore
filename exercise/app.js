const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const Store = require('./api/models/store');
const axios = require('axios');

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

mongoose.connect('mongodb+srv://gary_liggins:Alysha5545@cluster0.fxf9m.mongodb.net/googleMaps?retryWrites=true&w=majority', {
   useNewUrlParser : true, useUnifiedTopology: true 
});

app.use(express.json({limit: "50mb"}));

app.post("/api/stores", (req,res) => {
    let dbStores = [];
    let stores = req.body;
    stores.forEach((store) => {
      dbStores.push({
        storeName: store.name,
        phoneNumber: store.phoneNumber,
        address: store.address,
        openStatusText: store.openStatusText,
        addressLines: store.addressLines,
        location: {
          type: "Point",
          coordinates: [
            store.coordinates.longitude,
            store.coordinates.latitude
          ]
        }
      })
    })

    Store.create(dbStores, (err,stores) => {
      if(err){
        res.status(500).send(err);
      } else {
        res.status(200).send(stores)
      }
    })

})

app.get('/api/stores', (req, res) => {
  const zipCode = req.query.zip_code;

  const googleMapsURL = "https://maps.googleapis.com/maps/api/geocode/json"

  axios.get(googleMapsURL, {
    params: {
      address: zipCode,
      key: "AIzaSyAnhHmvZVM0jN_PAK02hIwQIe7b5To6o5c"
    }
  }).then((response) => {
    const data = response.data;
    const coordinates = [
      data.results[0].geometry.location.lng,
      data.results[0].geometry.location.lat
    ]
    console.log(coordinates)
  }).catch((error) =>{
    console.log(error);
  })
  Store.find({}, (err, stores) => {
    if (err){
      res.status(500).send(err)
    } else {
      res.status(200).send(stores)
    }
  })
})

app.delete('/api/stores', (req,res) => {
  Store.deleteMany({}, (err) => {
    res.status(200).send(err);
  })
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})