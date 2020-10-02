const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
    clientSecret:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    callbackURL:'http://localhost:5000/google/callback',
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
    console.log(profile.email);

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            type: 'OAuth2',
            user: profile.email,
            clientID:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
            clientSecret:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    })
    
    var mailOptions = {
        from: profile.email,
        to: 'princeshivam162@gmail.com',
        subject: 'Testing',
        text: 'Hello World!!'
    }
    
    transporter.sendMail(mailOptions, function (err, res) {
        if(err){
            console.log('Error: ' + err);
        } else {
            console.log('Email Sent');
        }
    })

    return done(null, profile);
  }
));