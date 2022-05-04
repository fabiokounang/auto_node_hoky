const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const database = require('./util/database');

const emoney = require('./routes/emoney');
const emoneyuser = require('./routes/emoneyuser');
const emoneymutation = require('./routes/emoneymutation');
const ovo = require('./routes/ovo');
const gopay = require('./routes/gopay');
const transaction = require('./routes/transaction');

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(morgan('combined'));

app.use('/api', transaction);
app.use('/emoney', emoney);
app.use('/emoneyuser', emoneyuser);
app.use('/emoneymutation', emoneymutation);
app.use('/ovo_emoney', ovo);
app.use('/gopay_emoney', gopay);

database.getConnection().then((database) => {
  console.log('Connected to database ' + database.config.database);
  app.listen(port, () => {
    console.log('Auto node is listening to port ' + port);
  });
}).catch(err => console.log(err));