const { test, createPost, getAllPosts, getAPost, updatePost, deletePost, postComment, editComment, deleteComment, updateReactions, addPostToCommunity } = require("../controllers/postController");

const router = require("express").Router();

const upload = require("../utils/multer")

const { checkLogin } = require("../middlewares/authMiddleware");

router.get("/test", test);
router.post("/create", upload.single('image'), createPost);
router.get("/getallpost/:userId", getAllPosts);
router.get("/getapost/:id", getAPost);
router.put("/updatepost/:id", upload.single('image'), updatePost);
router.delete("/deletepost/:id", deletePost);
router.post("/postcomment/:postId", checkLogin, postComment);
router.patch("/updatecomment/:postId", checkLogin, editComment);
router.patch("/deletecomment/:postId", checkLogin, deleteComment);
router.patch("/updatereactions/:postId", checkLogin, updateReactions);
router.patch("/addposttocommunity/:postId", addPostToCommunity);




module.exports = router;