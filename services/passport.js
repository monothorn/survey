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
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id})
            .then((existingUser) => {
                if (existingUser) {
                    //record present
                    done(null, existingUser);
                } else {
                    new User({
                        googleId: profile.id
                    })
                        .save()
                        .then((user) => {
                            done(null, user);
                        });
                }
            });
    }
    )
);