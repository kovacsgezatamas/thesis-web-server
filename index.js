const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes/router');

const app = express();
const apiPort = 8099;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/api', router);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
