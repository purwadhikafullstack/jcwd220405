const { RAJA_ONGKIR, RAJA_ONGKIR_URL } = process.env;

const axios = require("axios");

module.exports = {
  getProvince: async (req, res) => {
    try {
      const response = await (
        await axios.get(`${RAJA_ONGKIR_URL}/province`, {
          headers: {
            key: RAJA_ONGKIR,
            "content-type": "application/x-www-form-urlencoded",
          },
        })
      ).data;

      return res
        .status(200)
        .json({ raw: response, result: response.rajaongkir.results });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  getCity: async (req, res) => {
    try {
      const { province_id } = req.params;
      const response = await (
        await axios.get(`${RAJA_ONGKIR_URL}/city?province=${province_id}`, {
          headers: {
            key: RAJA_ONGKIR,
            "content-type": "application/x-www-form-urlencoded",
          },
        })
      ).data;

      return res
        .status(200)
        .json({ raw: response, result: response.rajaongkir.results });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
