var bodyParser = require('body-parser');
var router = require('express').Router();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));
router.use('/user', require('./user'));

module.exports = router;