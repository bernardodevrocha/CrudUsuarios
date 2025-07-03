var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require('../controllers/UserController');
var adminAuth = require('../middleware/AdminAuth');

router.get('/', HomeController.index);
router.post('/users', UserController.create);
router.get('/users', adminAuth, UserController.index);
router.get('/users/:id', adminAuth, UserController.findUser);
router.put("/users", adminAuth, UserController.edit);
router.delete("/users/:id", adminAuth, UserController.remove);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);
router.post("/validate", adminAuth, HomeController.validate);

module.exports = router;