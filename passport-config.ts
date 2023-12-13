// Referencing week 7 source code

const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcrypt';
import { User } from './routes/users';

function setupAuthentication(passport: any, getUserbyName: any, getUserById: any) {
    const authenticateUser = async (username: string, password: string, done: any) => {
        const user = getUserbyName(username);
        if (user == null) {
            return done(null, false);
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    }
    passport.use('local', new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));
    passport.serializeUser((user: User, done: any) => done(null, user.id));
    passport.deserializeUser((id: number, done: any) => {
        return done(null, getUserById(id))
    });
}

module.exports = setupAuthentication;
