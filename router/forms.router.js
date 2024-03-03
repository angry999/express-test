const express = require("express");
const { filteredResponses } = require("../controller/forms.controller");
const router = express.Router();

/**
 * @route GET /api/forms/{formId}/filteredResponses
 * @description get filtered form list from fillout endpoint
 * @param filters
 * @return submission array
 */
router.get("/:formId", filteredResponses);

module.exports = router;
