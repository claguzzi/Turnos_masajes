// routes/index.js
const { Router } = require("express");
const turnosRouter = require("./turnosRouter");
const emailRouter = require("./emailRouter");
const userRouter = require("./userRouter");
const mpRouter = require("./mpRouter");




const mainRouter = Router();



mainRouter.use("/turnos", turnosRouter); 
mainRouter.use("/email", emailRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/pago", mpRouter);




module.exports = mainRouter;
