var jwt = require('jwt-simple');
var config = require('../routes/config');

module.exports.auth = function(req, res, next){
    if(!req.headers['x-auth']) {
        return res.sendStatus(401)
    }
    try {
        var auth = jwt.decode(req.headers['x-auth'], config.secretkey);
        req.auth = auth;
        next();
    } catch (err) {
        return  res.sendStatus(401)
    }
};
