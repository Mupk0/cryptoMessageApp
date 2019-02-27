const db = require('../db');

exports.all = function (cb) {
  db.get().collection('records').find().toArray((err, docs) => {
    cb(err, docs);
  });
};

exports.findById = function (id, cb) {
  db.get().collection('records').findOne({ tag: id }, (err, doc) => {
    if (doc == undefined) {
      console.log(err);
    }
    cb(err, doc);
  });
};

exports.create = function (record, cb) {
  db.get().collection('records').insert(record, (err, result) => {
    cb(err, result);
  });
};

exports.delete = function (id, cb) {
  db.get().collection('records').deleteOne({ tag: id }, (err, result) => {
    cb(err, result);
  });
};
