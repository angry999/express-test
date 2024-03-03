const formService = require("../service/forms.service");

/**
 * @route GET /api/forms/{formId}/filteredResponses
 * @description get filtered form list from fillout endpoint
 * @param filters
 * @return submission array
 */
const filteredResponses = async (req, res) => {
  try {
    const formId = req.params.formId;
    const response = await formService.filteredResponses(formId, req.query);

    if(response) {
      if(response.status === 'success') {
        res.status(200).send({ msg: response.msg, data: response.data });
      } else {
        res.status(400).send({ msg: response.msg });
      }
    } else {
      res.status(500).json({ msg: "Cannot get data from fillout" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  filteredResponses,
};
