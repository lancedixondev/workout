const Express = require('express')      //import express frame work, store in variable.  instance becomes gate way to using express methods
const router = Express.Router()         // access expres sproperties and methods, using express variable to access router method
let validateJWT = require("../middleware/validate-jwt")
const {WorkoutModel} = require("../models")



    /* 
    =======================
      Workout Create
    =======================
    */

    router.post('/create', validateJWT, async (req, res) => {
      const { title, date, entry } = req.body.workout;
      const { id } = req.user;
      const workoutEntry = {
        title,
        date,
        entry,
        owner: id
      }
      try {
        const newWorkout = await WorkoutModel.create(workoutEntry);
        res.status(200).json(newWorkout);
      } catch (err) {
        res.status(500).json({ error: err });
      }
      WorkoutModel.create(workoutEntry)
        
    });
    
    router.get("/about", (req, res) => {
      res.send("This is the about route!")
    });


/* 
36    =======================
37      Get all workouts
38    =======================
39    */


    router.get("/", async (req, res) => {
          try {
            const entries = await WorkoutModel.findAll();
            res.status(200).json(entries);
          } catch (err) {
            res.status(500).json({ error: err });
          }
        });



     /* 
50    =======================
51     Get workouts by User
52    =======================
53    */


    router.get("/mine", validateJWT, async (req, res) => {
          let { id } = req.user;
          try {
            const userWorkouts = await WorkoutModel.findAll({
              where: {
                owner: id
              }
            });
            res.status(200).json(userWorkouts);
          } catch (err) {
            res.status(500).json({ error: err });
          }
        });


    /* 
69    =======================
70     Get workouts by title
71    =======================
72    */


    router.get("/:title", async (req, res) => {
      const { title } = req.params;
      try {
        const results = await WorkoutModel.findAll({
          where: { title: title }
        });
        res.status(200).json(results);
      } catch (err) {
        res.status(500).json({ error: err });
      }
    });

 /* 
86    =======================
87      Update a workout
88    =======================
89    */

    router.put("/update/:entryId", validateJWT, async (req, res) => {
          const { title, date, entry } = req.body.workout;
          const workoutId = req.params.entryId;
          const userId = req.user.id;
          
          const query = {
            where: {
              id: workoutId,
              owner: userId
            }
         };
       
         const updatedWorkout = {
           title: title,
           date: date,
           entry: entry
         };
       
         try {
           const update = await WorkoutModel.update(updatedWorkout, query);
           res.status(200).json(update);
         } catch (err) {
           res.status(500).json({ error: err });
         }
       });

     /* 
117   =======================
118     Delete a Workout
119   =======================
120   */
   router.delete("/delete/:id", validateJWT, async (req, res) => {
         const ownerId = req.user.id;
         const workoutId = req.params.id;
       
         try {
           const query = {
             where: {
               id: workoutId,
               owner: ownerId
             }
           };
       
           await WorkoutModel.destroy(query);
           res.status(200).json({ message: "Workout Entry Removed" });
         } catch (err) {
           res.status(500).json({ error: err });
         }
       })

module.exports = router;  // export the module for usage outside of the file