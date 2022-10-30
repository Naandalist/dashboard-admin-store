const monggose = require("mongoose");

const { urlDb } = require("../config");

monggose.connect(urlDb, {
//   useUnifiedTopology: true,
//   useFindAndModify: true,
//   useCreateIndex: true,
});

const db = monggose.connection;

module.exports = db;
