const express = require('express');
const router = express.Router();
var models = require("../models");
var axios = require("axios");
var moment = require("moment");

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.STUBHUB_BEARER_TOKEN}`;

console.log(axios.defaults.headers);


router.get('/', function(req, res, next) {
  return res.render('index');
});

router.post('/pull_ticket', stubhubApi, function(req, res, next){
  console.log(req.body)
  models.User.create({
   email: req.body.email, 
  })
  models.Event.create({
    url: "dummy"
  })
  .then((rows) => {
    console.log('rows', rows.id)
    models.User_event.create({
      requestedPrice: req.body.requestedPrice,
      userId: rows.id,
      eventId: 1, //this needs to properly be defined
      fulfilled: false,
    })
    res.send(200, req.body.stubhub)
  })


});

function stubhubApi(req, res, next) {
  var today = moment(req.body.date, "YYYY-MM-DD")
  var tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD');

  axios.get('https://api.stubhub.com/sellers/search/events/v3', {
      params: {
        dateLocal: req.body.date + " TO " +tomorrow, 
        performerName: req.body.bandName
      }
  })
  .then((stubhubRes) =>{
    req.body["stubhub"] = stubhubRes.data;
    return next();
  })
}


module.exports = router;
