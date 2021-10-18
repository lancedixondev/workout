const jwt = require("jsonwebtoken");  //import jwt package
const { UserModel } = require("../models");  //import models    
const validateJWT = async (req, res, next) => {
    if (req.method == "OPTIONS") { //method options is the first part of the preflighted request.  determines if its safe to send.
        next(); // if we have a preflighted request pass to the third parameter in the function (next)
        } else if (
            req.headers.authorization &&
            req.headers.authorization.includes("Bearer") // if we are dealing with POST GET PUT DELETE request we want to see if there is any data in authorization header and if it contains "Bearer"
            ) {
            const { authorization } = req.headers; //object decon to pull the value of authorization header and store in variable.
            const payload = authorization
            ? jwt.verify(  // 12-13-19 ternary that verifies if the "authorication" contains a truthy value.  if not the value is undefined and stored in the varibale "payload"
              authorization.includes("Bearer")//if we have a token that includes "bearer" we extrapolate and return just the token from the string.  if the word bearer was not included in the authorization header, then return just the token.
               ? authorization.split(" ")[1]  //13-14-15-16-17 if the token contains a truthy calue it does this.
                : authorization,                //^^ call upon JWT package and invoke the verify method.
              process.env.JWT_SECRET            //^^ the methods first parameter is our token. same variable in line 11
             )                                  //^^ the second parameter is the JWT_SECRET created in .env so the method can decrypt the token.
            : undefined;
                
            if (payload) {  //conditional statement that checks for a truthy value in payload
              let foundUser = await UserModel.findOne({ where: { id: payload.id } });  //if payload comes back as truthy value, we use sequalizes findOne method to look for a user in our UserModel where the id of user in database matches the is stored in the token then store in variable called foundUser
        
              if (foundUser) { //nested conditional statement that checks if the value of foundUser is truthy
                req.user = foundUser;  // if we find a user in the databse that matches the information from the token, we create a new property called user to ecpress request object.  the value of this new property is the information stored in the foundUSer.
                next(); //since we are creating a middleware function, we have acces to that third parameter we establshed earlier.
              } else {
                res.status(400).send({ message: "Not Authorized" });
              }
            } else {
              res.status(401).send({ message: "Invalid token" });  //if payload comes back undefined, we return a response with a 401
            }
          } else {
            res.status(403).send({ message: "Forbidden" });
          }
        };
    
module.exports = validateJWT;