const Sequelize = require('sequelize');    
 //import sequelize, and create and instance for use in the module with the variable

const sequelize = new Sequelize("postgres://postgres:lance88@localhost:5432/workout-log");   
//used contructor to make a new seq object, takes in a string that uses all the pertinent data required to connect to a database (uri connection)

module.exports = sequelize; 
// export the module to be used outside this file