"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//Database
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/database', function(err, res){
  if(err) console.log('ERROR: Cant connect to db:' + err);
  else console.log('Connected to db');
});

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));


app.get('/', (request, response) => {     
  response.render('layout', { title: 'Final project - PL' });
});


var TData = require("./models/t_data");

require('./models/routes')(app);

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});