// routes/userRouter.js
const { Router } = require("express");
const { createUserHandler, loginUserHandler, getUserHandler } = require("../handlers/userHandler");



const   userRouter = Router();


userRouter.post("/register", createUserHandler);
userRouter.post("/login", loginUserHandler);
userRouter.get("/", getUserHandler)



module.exports = userRouter;
