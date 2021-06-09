const express = require('express');
const events = require('events');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

let eventEmitter = new events.EventEmitter();

var CO2chartData = []; //for(let i=0; i<24; i++) { CO2chartData.push(''); }
var minValue;
var maxValue;
var thousandChartData = [];

app.get('/', (req, res) => {
    res.render('index', {template: 'index'});
});

app.get('/esp', (req, res) => {
    updateChartData(req.query.data);
    eventEmitter.emit('chartUpdated');
    res.end();
});

app.get('/address', (req, res) => {
    res.send(req.get('host'));
    res.send(req.protocol + '://' + req.get('host'));
});

app.get('/get', (req, res) => {
    eventEmitter.once('chartUpdated', () => {
        res.json({
            CO2chartData,
            minValue,
            maxValue
        });
    });
});

app.get('/export', (req, res) => {
    res.json({
        export: thousandChartData
    });
});

app.get('/reset', (req, res) => {
    CO2chartData = [];
    minValue = null;
    maxValue = null;
    res.end();
});

app.listen(process.env.PORT || 3000, () => { console.log('listening on port 3000' )});

function updateChartData(newData) {
    if(CO2chartData.length >= 24) { CO2chartData.shift() }
    if(thousandChartData.length >= 1000) { thousandChartData.shift() }
    CO2chartData.push(newData);
    let currentDate = new Date();
    thousandChartData.push(new Array(newData, currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear() + ' - ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + ':' + currentDate.getMilliseconds()));

    if(!minValue) { minValue = newData; }
    if(!maxValue) { maxValue = newData; }
    if(CO2chartData[CO2chartData.length - 1] < minValue) { minValue = CO2chartData[CO2chartData.length - 1] }
    if(CO2chartData[CO2chartData.length - 1] > maxValue) { maxValue = CO2chartData[CO2chartData.length - 1] }
}
