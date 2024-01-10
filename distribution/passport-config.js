"use strict";
// Referencing week 8-9 source code
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuthentication = void 0;
const User_1 = require("./models/User");
const passport_jwt_1 = require("passport-jwt");
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "veryVeryVerySecretKey"
};
function setupAuthentication(passport) {
    passport.use(new passport_jwt_1.Strategy(opts, function (jwtPayload, done) {
        User_1.User.findOne({ _id: jwtPayload.id })
            .then(user => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
            .catch(err => {
            return done(err, false);
        });
    }));
}
exports.setupAuthentication = setupAuthentication;
