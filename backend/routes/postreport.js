const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const PostReport = require('../models/postreport.model');

// get list of all reports
router.post('/list', async function (req, res) {
  try {
    const reportList = await sequelize.query(
      `SELECT * 
      FROM postreports`,
      {
        logging: false,
        type: QueryTypes.SELECT
      }
    );
    res.status(200).send({ id: 0, list: reportList });
  } catch (error) {
    return res.status(500).send({ id: 0, message: error.message });
  }
});

// select
router.post('/select', async function (req, res) {
  try {
    const test = await Report.findAll();

    // can modify/parse/do whatever with 'postreport' here before sending it back

    res.status(200).send(test);
  } catch (error) {
    res.status(500).send(error);
  }
});

// insert (single & multi)
router.post('/insert', async function (req, res) {
  try {
    // single insert
    await PostReport.create({ pid: req.body.pid, uid: req.body.uid, reason: req.body.reason });
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// update
router.post('/update', async function (req, res) {
  try {
    await PostReport.update({ price: 6000.00 }, {
      where: {
        title: 'Big Red Truck'
      }
    });

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete
router.post('/delete', async function (req, res) {
  try {
    await PostReport.destroy({
      where: {
        id: req.body.id
      }
    });
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});


// search for report by *LIKE* reason/createdAt
router.post('/searchLike', async function (req, res) {
  try {
    const reportList = await sequelize.query(
      `SELECT * 
      FROM postreports 
      WHERE reason LIKE "%`+ req.body.reason + `%" OR createdAt LIKE "%` + req.body.createdAt + `%" 
      ORDER BY createdAt DESC`,
      {
        logging: false,
        type: QueryTypes.SELECT
      }
    );
    if (reportList.length == 0) {
      return res.status(200).send({ id: 0, message: "No reports found" });
    }
    else {
      return res.status(200).send(reportList);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;