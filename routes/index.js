var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', {title:'Maicol Server'});
});

module.exports = router;
