const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

const app = express();

// tells your server where the partials reside.
hbs.registerPartials(`${__dirname}/views/partials`);
// http://expressjs.com/en/guide/using-template-engines.html
// Note: you can omit the file extension because we set the view engine
app.set('view engine', 'hbs');
// our custom middleware. Won't proceed until next() is called!
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', `${log}\n`, (err) => {
    if (err) console.log('Unable to append to server.log');
  });

  next();
});
// Stuck in Maintenance mode because next() is never called!
// comment this out to remove "maintenance mode"
// app.use((req, res, next) => {
//   res.render('maintenance');
// });
// .use is how you register Middleware
app.use(express.static(`${__dirname}/public`));
// registers a helper function to run from a View.
hbs.registerHelper('getFullYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
  res.render('welcome', {
    title: 'Welcome',
    welcomeMessage: 'Welcome to my website powered by Express.js!',
  });
});

app.get('/about', (req, res) => {
  // defaults to looking in thew /views directory
  res.render('about', {
    title: 'About',
    text: 'Cool dynamic text!',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to display page',
  });
});

app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
