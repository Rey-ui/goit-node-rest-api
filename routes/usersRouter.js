import express from "express";
import usersControllers from "../controllers/usersControllers.js";
//import authMiddleware from "../middlewares/auth.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
const usersRouter = express.Router();
const jsonParser = express.json();
usersRouter.post("/users/register", jsonParser, usersControllers.register);
usersRouter.post("/users/login", jsonParser, usersControllers.login);
usersRouter.post("/users/logout", auth, usersControllers.logout);
usersRouter.get("/users/current", auth, usersControllers.currentUser);
usersRouter.patch(
  "/users/avatars",
  auth,
  upload.single("avatar"),
  usersControllers.changeAvatar
);
usersRouter.get(
  "/users/verify/:verificationToken",
  usersControllers.verifyEmail
);
usersRouter.post(
  "/users/verify",
  jsonParser,
  usersControllers.resendVerificationEmail
);
export default usersRouter;
