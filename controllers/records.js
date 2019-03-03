const Records = require('../models/records');
const simplecrypt = require('simplecrypt');
const nanoid = require('nanoid');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

exports.all = function (req, res) {
  Records.all((err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });
};

exports.create = function (req, res) {
  const sc = simplecrypt({
    password: (req.body.key)
  });
  let hashPassword = bcrypt.hashSync(req.body.key, salt);
  const record = {
    tag: nanoid(6),
    text: sc.encrypt(req.body.text),
    key: hashPassword
  };
  Records.create(record, (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      res.render('secrets', {
        link: `${record.tag}`
      });
    }
  });
};

exports.decryptText = function (req, res) {
  Records.findById(req.params.tag, (err, doc) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
     if (bcrypt.hashSync(req.body.key, salt) != doc['key']) {
       res.render('403');
     }
      const sc = simplecrypt({password: (req.body.key)});
      const textForDecrypt = sc.decrypt(doc["text"]);
      res.render('success', {
        decryptLInk: `${textForDecrypt}`,
        link : `${req.params.tag}`
     })
  })
};

exports.findById = function (req, res) {
  Records.findById(req.params.tag, (err, doc) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (doc == undefined) {
      res.render('404');
    }
    res.render('link', {
      link: `${req.params.tag}`
    });
  });
};

exports.delete = function (req, res) {
  Records.delete(
    req.params.tag,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.redirect('/')
    },
  );
};