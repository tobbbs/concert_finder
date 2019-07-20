const express = require('express');
const router = express.Router();
var models = require("../models");

router.get('/', function(req, res, next) {
  return res.render('index');
});

router.post('/pull_ticket', function(req, res, next){
  console.log(req.body)
  console.log(models.User)
  models.User.create({
   email: req.body.email, 
  })
  .then((rows) => {
    console.log('rows', rows.id)
    models.User_event.create({
      requestedPrice: req.body.requestedPrice,
      userId: rows.id,
    })
    res.send(200)
  })

});




module.exports = router;
