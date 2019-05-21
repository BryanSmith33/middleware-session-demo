// importing files and packages from npm
const express = require('express')
require('dotenv').config()
const session = require('express-session')
const app = express()
const {SERVER_PORT, SESSION_SECRET} = process.env

//middleware
app.use(express.json())
// custom datelogger middleware that simply logs the request/endpoint and the date and time
const dateLogger = (req, res, next) => {
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()
  console.log(`${req.method} ${req.path} ran on ${date} at ${time}`)
  // next is crucial here. without it, we would never continue to our next middleware or callback function
  next()
}
// using dateLogger on the entire app (every request no matter what)
app.use(dateLogger)
// setting up sessions
// secret is a random string stored in our .env file
// resave defaults to true so we set it to false. 
//it will resave anytime a user interacts, with or without a change
// saveUninitialized defaults to true. Set this to false so you aren't auto create a session
// there are many other options availabe in the session object but these are pretty standard ones
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  //setting the age of our cookie. This below will set it to one hour
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}))

//custom viewCount middleware that logs the count of times someone has viewed the route
const viewCount = (req, res, next) => {
  //  session is available on req because we set it up above
  // we can set any property we want on req.session. Here we are setting one we named viewCount
  // initially check and see if there is anything called req.session.viewCount
  // if there is, add one to it
  if(req.session.viewCount){
    req.session.viewCount++
  } else {
    // if there isn't something called req.session.viewCount, set it to one
    req.session.viewCount = 1
  }
  // don't foget next so the next function can run
  next()
}

// our endpoint that is using the viewCount middleware.
// viewCount would not run on any other route unless we specified it to
app.get(`/`, viewCount, (req, res) => {
  res.send(`${req.session.viewCount}`)
})

// if you ever want to end a session before it expires, you can use the req.session.destroy method
app.get(`/logout`, (req, res) => {
	req.session.destroy(() => {
		res.send(`logged out 👋`)
	})
})

const PORT = SERVER_PORT
app.listen(PORT, () => console.log(`the magic is happening on ${PORT}`))
