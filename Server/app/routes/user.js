var router = require('express').Router() ;
var postUser = require('../controllers/user').post;
var auth = require('../controllers/auth').auth;
// const userCtrl = require('../controllers/user');
var getUser = require('../controllers/user').getUser;
var putProfile =  require('../controllers/user').put;
var postLogin = require('../controllers/user').postLog;
var deleteUser = require('../controllers/user').delete;


// console.log(userCtrl)
router.post('/', postUser);
router.post('/login', postLogin);
// router.get('/',auth , userCtrl.getUser);
router.get('/',auth , getUser);
router.put('/profile', putProfile);
router.delete('/profile', deleteUser);

module.exports = router;


