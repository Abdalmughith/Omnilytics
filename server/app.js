const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const RandExp = require('randexp');
const _ = require('lodash');
const cors = require('cors');

//alphabeticalReg realReg integerReg alphanumericReg 

const regListgen = ['[0-9]{1,10}\\.[0-9]{1,10}', '[0-9]{5,25}', '[A-Za-z]{5,25}','[A-Za-z0-9]{5,25}' ];
const regListRes = ['[0-9]*\\.[0-9]*$', '^[0-9]*$', '^[A-Za-z]*$', '^[A-Za-z0-9]*$'];

require('dotenv').config()


// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));


app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    req.getBaseUrl = function () {
        return req.protocol + "://" + req.get('host')
    }
    return next();
});

app.get('/genrate', (req, res) => {

    let data = [];
    _.each(regListgen, reg => {
        let rand = _.random([lower = 0], [upper = 70000])
        // let rand = _.random([lower = 1], [upper = 10])
        console.log(reg, "   ", rand+1);
        for (let index = 0; index < rand; index++) {
            const randexp = new RandExp(new RegExp(reg));
            const genString = randexp.gen();
            data.push(genString)
        }
    })
    const fileName = new RandExp(new RegExp('[A-Za-z0-9]{5,25}')).gen() + ".txt";
    fs.writeFileSync("./public/" + fileName, data.join(','));
    res.json({
        link: req.getBaseUrl() + "/" + fileName,
        fileName: fileName,
    }).status(200)
});

app.get('/report/:fileName', (req, res) => {
    let fileName = req.params.fileName;

    const data = fs.readFileSync('./public/' + fileName,
        { encoding: 'utf8', flag: 'r' });
    let result = {};

   regListRes.map(function (i) {
      result[i]=0
    })
    _.each(data.split(','), str => {

        _.each(regListRes, reg => {

            if (str.match(new RegExp(reg))) {
                
                result[reg] += 1;
                return false;
            }
        })
    })
    res.json({
        res: result, t: data.split(',').length,to: Object.values(result).reduce((a, b) => a + b, 0) }).status(200)
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(404).send({
    message: 'NotFound'
}));

module.exports = app;