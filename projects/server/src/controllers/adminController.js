const db = require("../../models");
const user = db.User;

module.exports = {
    allUser: async (req, res) => {
        try {
            const result = await user.findAll()
            // console.log(result)

            res.status(200).send(result)
        } catch (err) {
            res.status(400).send(err);
            console.log(err);
        }
    }
}