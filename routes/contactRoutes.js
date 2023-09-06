const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContact,
} = require("../controllers/contactController");

router.use(validateToken);
router.get("/", getContacts);
router.post("/", createContact);
router.get("/:id", getContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
