import express from "express";

import { body, validationResult } from "express-validator";
import { Record } from "../models/records.js";

const router = express.Router();

const areDatesOrdered = (endDate, { req }) => {
  if (new Date(endDate) < new Date(req.body.startDate)) {
    throw new Error("endDate must be greater than or equal to startDate");
  }
  return true;
};

const areCountsOrdered = (maxCount, { req }) => {
  if (parseInt(maxCount, 10) < parseInt(req.body.minCount, 10)) {
    throw new Error("maxCount must be greater than or equal to minCount");
  }
  return true;
};

const dateFormat = {
  format: "YYYY-MM-DD",
  strictMode: true,
  delimeters: ["-"],
};

router.post(
  "/api/v1/keys/totals",
  [
    body("startDate")
      .isDate(dateFormat)
      .withMessage("startDate must in YYYY-MM-DD format."),
    body("endDate")
      .isDate(dateFormat)
      .withMessage("endDate must in YYYY-MM-DD format."),
    body("endDate")
      .custom(areDatesOrdered)
      .withMessage("endDate must be greater than or equal to startDate."),
    body("minCount")
      .isInt({ min: 0 })
      .withMessage("minCount must be a positive integer."),
    body("maxCount")
      .isInt({ min: 0 })
      .withMessage("maxCount must be a positive integer."),
    body("maxCount")
      .custom(areCountsOrdered)
      .withMessage("maxCount must be greater than or equal to minCount."),
  ],
  (req, res) => {
    console.log("Got request to get key totals...");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, msg: errors.array()[0].msg });
    }

    const { startDate, endDate, minCount, maxCount } = req.body;

    Record.getKeyTotalCounts({ startDate, endDate, minCount, maxCount })
      .then((records) => {
        res.send({
          code: 0,
          msg: "Success",
          records,
        });
      })
      .catch((err) => {
        console.log("problem in mongo");
        console.log(err);
        res.status(500).send("Internal server error!");
      });
  }
);

export { router as keysRouter };
