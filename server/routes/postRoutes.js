const { test, createPost, getAllPosts, getAPost, updatePost, deletePost, postComment, editComment, deleteComment, updateReactions, addPostToCommunity } = require("../controllers/postController");

const router = require("express").Router();

const upload=require("../utils/multer")



router.get("/test", test);
router.post("/create",upload.single('image'), createPost);
router.get("/getallpost/:userId", getAllPosts);
router.get("/getapost/:id", getAPost);
router.put("/updatepost/:id",upload.single('image'), updatePost);
router.delete("/deletepost/:id", deletePost);
router.post("/postcomment/:postId", postComment);
router.patch("/updatecomment/:postId", editComment);
router.patch("/deletecomment/:postId", deleteComment);
router.patch("/updatereactions/:postId", updateReactions);
router.patch("/addposttocommunity/:postId", addPostToCommunity);




module.exports = router;