const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectionUrl } = require("../middleware");
const userController = require("../controller/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectionUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.route("/logout")
    .get(userController.logout);

// Google Auth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback",
    saveRedirectionUrl,
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    userController.login
);

// Facebook Auth
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/auth/facebook/callback",
    saveRedirectionUrl,
    passport.authenticate("facebook", { failureRedirect: "/login", failureFlash: true }),
    userController.login
);

// Apple Auth
router.get("/auth/apple", passport.authenticate("apple"));
router.post("/auth/apple/callback",
    saveRedirectionUrl,
    passport.authenticate("apple", { failureRedirect: "/login", failureFlash: true }),
    userController.login
);

module.exports = router;