const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");
const validation = require("./validation");

router.get("/wikis/:wikiId/collaborators", collaboratorController.show);
router.post("/wikis/:wikiId/collaborators/create", collaboratorController.create);
//router.post("/topics/:topicId/posts/:postId/comments/:id/destroy", commentController.destroy);

module.exports = router;
