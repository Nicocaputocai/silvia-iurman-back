const app = require('express')();
app.get('/', (req, res) => res.send('Test Passenger'));
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
  app.listen('passenger');
} else {
  app.listen(3000);
}
module.exports = app;