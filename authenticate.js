var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn:3600});  
        //Higher the value more days after only the user need to validate
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
// In authentication Header
opts.secretOrKey = config.secretKey; //supplies key

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT Payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err){
                return done(err, false);
            }
            else if (user){
                return done(null , user);
            }
            else {
                return done(null, false)
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false}); 
//To verify the user by calling verifyUser

exports.verifyAdmin = function(req, res, next) {
    User.findOne({admin: true})
    .then((user) => {
        if (user.admin) {
            next();
        }
        else {
            err = new Error('You\'re not authorized to perform this action!');
            err.status = 403;
            return next(err);
        } 
    }, (err) => next(err))
    .catch((err) => next(err))
}