const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Store = require('./api/models/store');
const axios = require('axios');
const GoogleMapsService = require('./api/services/googleMapsService');
const googleMapsService = new GoogleMapsService;
// const StoreService = require('./api/services/storeService');
// const storeService = new StoreService();
require('dotenv').config()


app.use(express.json({limit: '50mb'}));

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

mongoose.connect('mongodb+srv://gary_liggins:Alysha5545@cluster0.fxf9m.mongodb.net/googleMaps?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});



app.post('/api/stores', (req, res)=>{
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
                type: 'Point',
                coordinates: [
                store.coordinates.longitude,
                store.coordinates.latitude
                ]
            }
        })
    })

    Store.create(dbStores, (err, stores)=> {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(stores)
        }
    })
//   console.log(dbStores)
//   res.send("you have posted")
})

app.get('/api/stores', (req, res)=>{
    const zipCode = req.query.zip_code;
   googleMapsService.getCoordinates(zipCode).then((coordinates) => {
       Store.find({
            location: {
                $near: {
                    $maxDistance: 3218,
                    $geometry: { 
                        type: "Point",
                    coordinates: coordinates
                }
                }
            }
        }, (err, stores) => {
            if(err){
                res.status(500).send(err);
            } else {
                res.status(200).send(stores);
            }
        })

        console.log(coordinates);
    }).catch((error) => {
        console.log(error);
      });
    })


app.delete('/api/stores', (req, res)=> {
  Store.deleteMany({}, (result)=>{
      res.status(200).send(result);
  });
})
const port = process.env.PORT || 3000

app.listen(port, ()=> console.log(`Listening on port ${port}`))