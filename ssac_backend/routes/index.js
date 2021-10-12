var express = require("express");
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const authRouter = require("./auth/index");
const postRouter = require("./post/index");

router.use("/auth", authRouter);
router.use("/posts", postRouter);

module.exports = router;
