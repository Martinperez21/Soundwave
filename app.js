const passport = require("passport");
const deserializeUser = require("./passport/deserializeUser.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const express = require("express");
const cors = require("cors");
const AuthController = require("./controller/AuthController.js");
const AudioController = require("./controller/AudioController.js");
const checkAuthentication = require("./passport/authMiddleware.js");
const checkUnauthentication = require("./passport/unauthMiddleware.js");
const path = require("path");
const exphbs = require("express-handlebars");
const _handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutDir: path.join(__dirname, "/views/layouts"),
    handlebars: allowInsecurePrototypeAccess(_handlebars),
  })
);

app.set("view engine", "hbs");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "/public/")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(AuthController.login));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(deserializeUser);

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

app.post("/register", AuthController.register);

app.get("/audio/:filename", checkAuthentication, AudioController.getAudioFile);

app.get("/audios", checkAuthentication, AudioController.getUserAudios);

app.post("/audio", checkAuthentication, AudioController.upload);

app.get("/", (req, res) => {
  res.render("index", {
    loggedIn: req.isAuthenticated(),
  });
});

app.get("/login", checkUnauthentication, (req, res) => {
  res.render("login", {
    loggedIn: req.isAuthenticated(),
  });
});

app.get("/subir", checkAuthentication, (req, res) => {
  res.render("subir", {
    loggedIn: req.isAuthenticated(),
  });
});

app.get("*", (req, res) => res.redirect("/"));

app.listen(4000, () => {
  console.log("Listening...");
});
