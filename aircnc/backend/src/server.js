const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const mongoDBCredentials = require('../credentials/mongoDBCredentials.json');

const app = express();

mongoose.connect(
  `mongodb+srv://${mongoDBCredentials.user}:${mongoDBCredentials.password}@aircnccluster-cgl2g.mongodb.net/test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

app.listen(3333);
