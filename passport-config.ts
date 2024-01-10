// Referencing week 8-9 source code

import { User } from './models/User';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "veryVeryVerySecretKey"
};

function setupAuthentication(passport: any) {
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        User.findOne({ _id: jwtPayload.id })
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => {
                return done(err, false);
            });
    }));
}

export { setupAuthentication };
