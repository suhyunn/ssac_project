var express = require("express");
var router = express.Router();

const authModule = require("../../modules/authModule");
const postController = require("../../controllers/postController");

router.get("/", postController.readAllPost);
router.get("/:id", postController.readDetailPost);
router.post("/", authModule.loggedIn, postController.createPost);
router.put("/:id", authModule.loggedIn, postController.updatePost);
router.delete("/:id", authModule.loggedIn, postController.deletePost);

router.put("/:id", authModule.loggedIn, postController.createComment);

module.exports = router;
