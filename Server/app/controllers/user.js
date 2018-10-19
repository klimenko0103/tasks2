var User = require('../models/model');
var crypto = require('crypto');
var config = require('../routes/config');
var jwt = require('jwt-simple');


/**
 * SIGN UP new user
 * При поступлении запроса типа POST эта функция шифрует пароль
 * с помощью bcrypt и сохраняет результат в БД.
 * При любых ошибках выдает статус 500 - Internal Server Error
 * При удаче - возвращает 201
 */

module.exports.post = function (req, res) {
    let params = req.body;
    var user = new User({
        username : params.username,
        age: params.age,
        email : params.email,
        login : params.login,
        password : params.password,
    });
    user.encryptPass(user.password);
    saveUser(user,res);
};

function saveUser(model, res) {
    model.save(function (err) {
        if (err) {
            res.sendStatus(500)
        }
        else {
            res.sendStatus(201)
        }
    });
    console.log('save server', model)
}

/**
 * SIGN UP token
 * При поступлении запроса типа GET эта функция
 * проверяет наличие заголовка типа x-auth, при его отсутствии
 * возвращает 401 - Unauthorized. При наличии расшифровывает токен,
 * содержащийся в заголовке с помощью jwt,
 * затем ищет пользователя с оным именем в базе данных.
 * При любых ошибках возвращает 500 - Internal Server Error
 * При успехе возвращает JSON объекта user (без пароля, естественно)
 */

module.exports.getUser = function(req, res){
   User.findOne({login: req.auth.login}, function(err, user) {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            }
            else {
                res.json(user)
            }
        })
};

/**
 * LOGIN
 * Этот модуль имеет единственный метод.
 * При получении запроса типа POST, в котором содержится логин и пароль,
 * эта функция ищет в БД пользователя с таким username,
 * получает хеш его пароля и сверяет с помощью bcrypt с полученным
 * в запросе паролем. При ошибках обработки возвращает статус 500.
 * При неправильных данных - 401 - Unauthorized.
 * При успехе возвращает токен.
 */

module.exports.postLog = function(req, res) {
    if (!req.body.login || !req.body.password) {
        return res.sendStatus(400)
    } else {
        let params = req.body;
        let login = params.login;
        User.findOne({login: login})
            .select('password')
            .exec(function (err, user) {
                if (err) {
                    return res.sendStatus(500)
                }
                if (!user) {
                    return res.sendStatus(404)
                }
                if (user.password === user.encryptPass(params.password) ){
                    let token = jwt.encode({login:login}, config.secretkey);
                    return res.send(token);
                }
                return res.sendStatus(401)
            })
    }
};

/**
 * EDIT PROFILE
*/

module.exports.put = function (req, res) {
    User.findOne({login: req.auth.login}, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        }
            if (!user) {
                return res.sendStatus(404)
            }
        else {
            User.findOne({_id: req.body._id})
                .exec(function (err, user) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500)
                    }
                    else {
                        if (req.body.gender !== '') {
                            user.gender = req.body.gender;
                        }
                        if (req.body.username !== '') {
                            user.username = req.body.username;
                        }
                        if (req.body.age !== '') {
                            user.age = req.body.age;
                        }
                        if (req.body.password !== '') {
                            user.encryptPass(req.body.password)
                            user.password = crypto.createHash('md5').update(req.body.password, 10).digest('hex');
                        }
                        saveUser(user,res)
                    }
                })
        }
    })
};

/**
 * DELETE PROFILE
 */

module.exports.delete = function (req, res) {
    User.findOne({login: req.auth.login}, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(500)
        }
        if (!user) {
            return res.sendStatus(404)
        }
        else {
            User.findOneAndDelete({_id: req.body._id}, function (err, result) {
                if (err) return res.send(err);
                res.json({message: 'Deleted'});
                console.log('delete', result);
            });
        }
    })
};

