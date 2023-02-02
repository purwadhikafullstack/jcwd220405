const db = require("../../models");
const journal = db.Journal;
const journal_type = db.Journal_Type;

module.exports = {
  allJournal: async (req, res) => {
    try {
      const { sort, direction, pagination } = req.query;

      const { count, rows } = await journal.findAndCountAll({
        include: [{ model: journal_type }],
        order: [[sort ? sort : "id", direction ? direction : "ASC"]],
        limit: 10,
        offset: pagination ? +pagination * 10 : 0,
      });

      res.status(200).send({ result: rows, pages: Math.ceil(count / 10) });
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
//   warehouseAdminJournal: async (req, res) => {
//     try {

//     } catch (err) {
//         res.status(400).send(err);
//         console.log(err);
//     }
//   }
};
