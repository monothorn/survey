const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    console.log('serialize');
    done(null, user);
});
passport.deserializeUser((user, done) => {
    console.log('deserialize');
    User.findById(user.id)
        .then((user) => {
            done(null, user);
        });
    done(null, user);
});
passport.use(new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({googleId: profile.id});

        if (existingUser) {
            //record present
            return done(null, existingUser);
        } else {
            const user = await new User({
                googleId: profile.id
            }).save();
            return done(null, user);
        }
    }
    )
);