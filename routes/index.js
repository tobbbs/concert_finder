const express = require('express');
const router = express.Router();
const models = require("../models");
const axios = require("axios");
const moment = require("moment");

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.STUBHUB_BEARER_TOKEN}`;


router.get('/', function(req, res, next) {
  return res.render('index');
});

router.post('/pull_ticket', stubhubApi, function(req, res, next){
  res.send(200, req.body.stubhub)

});

router.post('/data_input', function(req, res, next) {
  models.User.findOne({
    where:{
      email: req.body.email
    }
  })
  .then((foundUser) =>{
    if (!foundUser) {
      return new Promise((resolve, reject) => {
        models.User.create({
          email: req.body.email, 
        })
        .then((createdUser) => {
          resolve(createdUser);
        });
      })
      
    } else{
      return foundUser;
    }
  })
  .then((userRow) => {
    console.log('here in userRow', userRow);
    models.Event.findOne({
      where: {
        url: `https://www.stubhub.com/event/${req.body.eventId}`
      }
    })
    .then((foundEvent) => {
      if (!foundEvent) {
        return new Promise((resolve, reject) => {
          models.Event.create({
            url: `https://www.stubhub.com/event/${req.body.eventId}`
          })
          .then((createdEvent) => {
            resolve ([createdEvent, userRow]);
          });  
        })
        
      } else {
        return [foundEvent, userRow];
      }
    })
    .then(([eventRow, userRow]) => {
      console.log('eventRow:', eventRow.dataValues);
      console.log('userRow:', userRow.dataValues);
      models.User_event.findOne({
        where:{
          userId: userRow.id,
          eventId: eventRow.id,
        }
      })
      .then((foundUserEvent) => {
        if (!foundUserEvent) {
          return new Promise((resolve, reject) => {
            models.User_event.create({
              requestedPrice: req.body.requestedPrice,
              userId: userRow.id,
              eventId: eventRow.id, 
              fulfilled: false,
            })
            .then((createdUserEvent) => {
              resolve()
            })
          })
        } else {
          return 
        }
      })
     
    })
    .then(() => {
      res.send(200, req.body.stubhub)
    });
  })
});

function stubhubApi(req, res, next) {
  var today = moment(req.body.date, "YYYY-MM-DD")
  var tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD');

  axios.get('https://api.stubhub.com/sellers/search/events/v3', {
      params: {

        dateLocal: req.body.date + " TO " + tomorrow, 
        performerName: req.body.bandName
      }
  })
  .then((stubhubRes) =>{
    req.body["stubhub"] = stubhubRes.data;
    return next();
  })
}


module.exports = router;
