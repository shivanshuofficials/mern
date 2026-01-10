if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// console.log(process.env.secret);

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(cookieParser());
app.use(express.json());



//mongoose
const mongoose = require("mongoose");
const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URL);
}

//ejs 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine(".ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use(session(sessionOption));
app.use(flash());

//passport middleware
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User({
                        email: profile.emails[0].value,
                        username: profile.displayName,
                        googleId: profile.id
                    });
                    user = await newUser.save();
                    return done(null, user);
                }
            } catch (err) {
                return done(err, null);
            }
        }));
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'emails']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ facebookId: profile.id });
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new User({
                        email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`,
                        username: profile.displayName,
                        facebookId: profile.id
                    });
                    user = await newUser.save();
                    return done(null, user);
                }
            } catch (err) {
                return done(err, null);
            }
        }));
}

// Apple Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy({
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        callbackURL: "/auth/apple/callback",
        passReqToCallback: true
    },
        async (req, accessToken, refreshToken, idToken, profile, done) => {
            try {
                const appleId = idToken.sub;
                let user = await User.findOne({ appleId: appleId });
                if (user) {
                    return done(null, user);
                } else {
                    // Apple only returns name/email on first login
                    const email = profile ? profile.email : `${appleId}@apple.com`;
                    const username = profile && profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : `Apple User`;

                    const newUser = new User({
                        email: email,
                        username: username,
                        appleId: appleId
                    });
                    user = await newUser.save();
                    return done(null, user);
                }
            } catch (err) {
                return done(err, null);
            }
        }));
}


//flash messages 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.mapToken = process.env.MAP_TOKEN;
    next();
});

//demo user
app.get("/make-user", async (req, res) => {
    let user = new User({ email: "shivam@gmail.com", username: "shivam" });
    let registeredUser = await User.register(user, "password");
    res.send(registeredUser);
});

//routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// 404 handler (NO path)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// error handler (ALWAYS LAST)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { statusCode, message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
}); 
