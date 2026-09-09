// routes/index.js
const { Router } = require("express");
const turnosRouter = require("./turnosRouter");
const userRouter = require("./userRouter");




const mainRouter = Router();



mainRouter.use("/turnos", turnosRouter); 
mainRouter.use("/user", userRouter);




module.exports = mainRouter;
