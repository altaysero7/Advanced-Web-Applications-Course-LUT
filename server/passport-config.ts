// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024

import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { userAccount } from './mongodb/models/User';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "veryVeryVerySecretKey"
};

// Setting up authentication strategy
function setupAuthentication(passport: PassportStatic): void {
    passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
        userAccount.findOne({ _id: jwtPayload.id })
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch((err: Error) => {
                return done(err, false);
            });
    }));
}

export { setupAuthentication };
