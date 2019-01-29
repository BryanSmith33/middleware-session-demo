# Middleware && Sessions

__Middleware__: Functionality that we can either install or custom create. We can use it on our entire application by using `app.use(MIDDLEWARENAME)` or use it per route with
```js
  app.get(`/`, MIDDLEWARENAME, (req, res) => {
    //ACTION
  })
```

If we are creating custome middleware, don't foget the `next()` function. `next()` essentially says go to the next middleware/function/matching route.

```js
  const dateLogger = (req, res, next) => {
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()
  console.log(` ${req.method} ${req.path} ${date} ${time}`)
  // next is crucial here. without it, we would never continue to our next middleware or callback function
  next()
}
```

__Sessions__: Sessions allow us to persist date across requests and lengths of time. Think about when you log into the gram. You don't have to sign in every time. If you are inactive for a period of time, it may logout you. Your bank (hopefully) logs you out after several minutes of inactivity.

We will use the session middleware on our entire app. It takes in an object with some key/value pairs.

```js
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false
  }))
```

* **secret** - Our super secret phrase of random words
* **resave** - Saves our session everytime, with or without change. Defaults to true. We put false so the session is only saved when something is modified on the session (like viewCount)
* **saveUnitialized** - Will automatically create a session without the users consent. Illegal in the UK.