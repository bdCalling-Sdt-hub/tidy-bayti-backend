import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import homeControllers from "../controllers/home.controller.js";
router.post("/", auth(USER_ROLE.HOMEOWNER), homeControllers.createHome);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  homeControllers.getAllHomes
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  homeControllers.getSingleHome
);
router.patch("/:id", auth(USER_ROLE.HOMEOWNER), homeControllers.updateHome);
router.delete("/:id", auth(USER_ROLE.HOMEOWNER), homeControllers.deleteHome);
const homeRoutes = router;
export default homeRoutes;
