const monggose = require("mongoose");
const { urlDb } = require("../config");

monggose.connect(
  urlDb,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  async function (req, res) {
    try {
      await console.log("Connected to Database");
      console.log("ready state >>> ", monggose.connection.readyState);
    } catch (err) {
      throw err;
    }
  }
);

const db = monggose.connection;

module.exports = db;

