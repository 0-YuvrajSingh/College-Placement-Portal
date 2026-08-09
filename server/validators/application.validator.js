const { body } = require("express-validator")
const { APPLICATION_STATUS } = require("../config/constants")

const updateStatusValidators = [
  body("status")
    .isIn([
      APPLICATION_STATUS.SHORTLISTED,
      APPLICATION_STATUS.REJECTED,
      APPLICATION_STATUS.SELECTED,
    ])
    .withMessage("Status must be shortlisted, rejected, or selected"),
  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Remarks cannot exceed 1000 characters"),
]

module.exports = { updateStatusValidators }
