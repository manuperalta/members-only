const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(res.locals.currentUser)
  res.render('index', { title: 'Members only!!!', user: res.locals.currentUser });
});

//GET signup form
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign up as a Member' });
});

//POST request to add user to database
router.post('/signup',
  body('username').isEmail(),
  body('password').exists().isLength({ min: 5, max: 16 }),
  body('confirmpassword', 'Both password fields must have the same value').exists()
    .custom((confirmpassword, { req }) =>  confirmpassword === req.body.password ),
  body('firstname').isAlpha('en-US', { ignore: ' ' }),
  body('lastname').isAlpha('en-US', { ignore: ' ' }),
  function (req, res, next) {
    const errors = validationResult(req)
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) { return next(err) }
      const user = new User({
        username: req.body.username,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        isMember: false,
        isAdmin: false
      });
      if (!errors.isEmpty()) {
        //There are errors. Render the form again.
        return res.render('signup', { errors: errors.array() })
      }
      user.save(err => {
        if (err) return next(err);
        res.redirect('/')
      })
    })
  })

//GET login form
router.get('/login', (req, res, next) => {
  res.render('login')
})

//POST request to log in
router.post('/login',
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
)

//GET request to enter the secret password
router.get('/jointheclub', (req, res, next) => {
  res.render('jointheclub')
})
router.get('/admin', (req, res, next) => {
  res.render('adminprivileges')
})
//POST request to check password and join as official member
router.post('/jointheclub',
  function (req, res, next) {
    if (!req.user) res.render('jointheclub', { error: new Error('You need to be logged in to enter the secret password!') })

    if (req.body.secretpassword == process.env.MEMBERSHIP_PASSWORD) {
      User.findOneAndUpdate({ username: res.locals.currentUser.username }, { $set: { isMember: true } },
        (err, user) => {
          if (err) { return next(err) }
          res.render('joinsuccessful', { user: user.username })
        })
    }
  }
)
router.post('/admin',
  function (req, res, next) {
    if (!req.user) res.render('adminprivileges', { error: new Error('You need to be logged in to enter the secret password!') })

    if (req.body.adminpassword == process.env.ADMIN_GRANT_PASSWORD) {
      User.findOneAndUpdate({ username: res.locals.currentUser.username }, { $set: { isAdmin: true } },
        (err, user) => {
          if (err) { return next(err) }
          res.redirect('/')
        })
    }
  }
)
//GET request to log out
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err) }
    res.redirect("/");
  });
});


module.exports = router;
