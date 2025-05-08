module.exports = require('express')()
  .get('/', (req, res) => res.send('Works without DB'));