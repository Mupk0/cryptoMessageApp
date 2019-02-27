const express = require('express');
const bodyParser = require('body-parser');
const parseError = require('parse-error');
const pug = require('pug');
const methodOverride = require('method-override');
const db = require('./db');
const recordsController = require('./controllers/records');

const router = express.Router();
const path = `${__dirname}/views/`;

const app = express();

app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.get('/', (req, res) => {
  res.render(`${path}index`);
});

app.get('/secrets/:tag', recordsController.findById);

app.post('/secrets/:tag', recordsController.decryptText);

app.post('/secrets', recordsController.create);

app.delete('/secrets/:tag', recordsController.delete);

app.get('/allrecords', recordsController.all);


db.connect('mongodb://localhost:27017/myapi', (err) => {
  if (err) {
    return console.log(err);
  }
  app.listen(3012, () => {
    console.log('API app started');
  });
});

process.on('uncaughtException', (e) => {
  const data = parseError(e);
  console.log(data);
});

app.use(express.static(`${__dirname}/script`));
app.use(express.static(`${__dirname}/public`));
app.use('*', (req, res) => {
  res.render(`${path}404`);
});
