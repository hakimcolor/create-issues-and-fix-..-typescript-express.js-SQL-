import express from "express";
import { signup } from "../controller/auth.signup.js";
import { login } from "../controller/auth.login.js";
import { auth } from "../middleware/auth.middle.js";
import { createIssue } from "../modules/issue.createIssue.js";
import { getAllIssues } from "../modules/issue.getAllIssues.js";
import { getSingleIssue } from "../modules/issue.getSingleIssue.js";
import { updateIssue } from "../modules/issue.updateIssue.js";
import { deleteIssue } from "../modules/issue.deleteIssue.js";

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.route('/issues')
.post( auth, createIssue)
.get(getAllIssues);

router.route('/issues/:id')
.get(getSingleIssue)
.patch( auth, updateIssue)
.delete(auth, deleteIssue);

export default router;