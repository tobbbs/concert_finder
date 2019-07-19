const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  return res.render('index');
});

router.post('/pull_ticket', function(req, res, next){
  console.log(req.body)

});




module.exports = router;
