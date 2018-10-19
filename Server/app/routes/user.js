var router = require('express').Router() ;
var postUser = require('../controllers/user').post;
var auth = require('../controllers/auth').auth;
var getUser = require('../controllers/user').getUser;
var putProfile =  require('../controllers/user').put;
var postLogin = require('../controllers/user').postLog;
var deleteUser = require('../controllers/user').delete;


router.post('/', postUser);
router.post('/login', postLogin);
router.get('/',auth , getUser);
router.put('/profile',auth, putProfile);
router.delete('/profile',auth, deleteUser);

module.exports = router;


