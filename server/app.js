require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");  //variable that imports db file.

app.use(require("./middleware/headers"))

app.use(Express.json())

const controllers = require("./controllers");    //import the controllers as a bundle through object we made in index.js

app.use("/workout", controllers.workoutController);  //we call app use, and first dir url /journal, then pass controllers object with dot notation to acces desired locaiton

app.use("/user", controllers.userController);

app.use(require("./middleware/validate-jwt"));

dbConnection.authenticate()
// use db variable to acces db file, call authenticate method.  asynchronus method that runs SELECT 1+1 AS result.  this method returns a promise
.then(() => dbConnection.sync())
//promise resolver to access the returned promise and call sync().  this method defines all models to the database
.then(() => {
    app.listen(3000, () => {
        console.log('[SERVER]: app is listening on 3000')
    })
})
//promise resolver to access the returned promise from sync() method and fire off the fuction that shows if we are connected

.catch((err) => {
    console.log(`[SERVER]: server crashed. err = ${err}`)
})
//promise rejection that shows errors

app.use('/test', (reg, res) => {
    res.send('this is a message from the test endpoint on the server!')
})