//--------------------------
//         Imports
//--------------------------
var express = require('express');
var app = express();
const cors = require('cors');
const User = require("../db/dbConfig");
var bodyParser = require('body-parser');

//--------------------------
//      Configurations
//--------------------------
app.options('*', cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//--------------------------
//          APIs
//--------------------------
app.get('/', (req, res) => {
    return res.json({
        message: "Welcome to Meeting Time Voter",
        availableEndpoints: [
             'POST /basic/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
             'POST /advance/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
             'GET /basic/data',
             'GET /advance/data',
             'GET /basic/result?para1=value1',
             'GET /advance/result?para1=value1&para2=value2',
        ]
    });
});

app.get("/reset", (req, res, next) => {
    User.resetTable((err, result) => {
        if (err) { 
            console.log(err);
            res.status(400).send({ 'error': err.message || 'Server Error', 'code': 400 });
            return;
        };
        res.send({ result: result });
        res.status(200).end({ 'result': 'success' }); 
    });
});

//1) Data Viewer
app.get("/basic/data", (req, res, next) => {  
    const { meetingId1A, participantId1A, page1, pageSize1 } = req.query
    const pag = {
        meetingId1A: meetingId1A || 0,
        participantId1A: participantId1A || 0,
        page1: page1 || 0,
        pageSize1: pageSize1 || 0
    };
    User.readTableA(pag, (err, results) => {   
        if (err) { 
            console.log(err);
            res.status(500).send({ 'error': err.message || 'Server Error', 'code': 500 });
            return;
        };
        res.send(results);
        res.status(201).end({ 'result': 'success' }); 
    });
});

app.get("/advance/data", (req, res, next) => {  
    const { meetingId1U, participantId1U, page2, pageSize2 } = req.query
    const pag = {
        meetingId1U: meetingId1U || 0,
        participantId1U: participantId1U || 0,
        page2: page2 || 0,
        pageSize2: pageSize2 || 0
    };
    User.readTableU(pag, (err, results) => {  
        if (err) {  
            console.log(err);
            res.status(500).send({ 'error': err.message || 'Server Error', 'code': 500 });
            return;
        };
        res.send(results);
        res.status(201).end({ 'result': 'success' }); 
    });
});

//2) Insert Data
app.post("/basic/insert", (req, res, next) => {  
    console.log(req.body);
    if (!req.body.data) {
        res.status(400).send({ 'error': 'Invalid Input', 'code': 400 });
    } 
    User.addtoTable(req.body.data, (err, results) => { 
        if (err) {  
            if (err.code === '23505') { 
                res.status(400).send({ 'error': 'Duplicate Entry', 'code': 400 });
                return;
            };
            console.log(err);
            res.status(500).send({ 'error': err.message || 'Internal Server Error', 'code': 500 });
            return;
        } else {
            res.status(201).send({ 'result': 'success' }); 
        };
    });
});

app.post("/advance/insert", (req, res, next) => { 
    console.log(req.body);
    if (!req.body.data) {
        res.status(400).send({ 'error': 'Invalid Input', 'code': 400 });
    } 
    User.addtoTable(req.body.data, (err, results) => { 
        if (err) {  
            if (err.code === '23505') { 
                res.status(400).send({ 'error': 'Duplicate Entry', 'code': 400 });
                return;
            };
            console.log(err);
            res.status(500).send({ 'error': err.message || 'Internal Server Error', 'code': 500 });
            return;
        } else {
            res.status(201).send({ 'result': 'success' }); 
        };
    });
});

//3) Result Viewer 
app.get("/basic/result", (req, res, next) => {  
    const { meetingId, participantId, page, pageSize } = req.query;
    if (!participantId && !page && !pageSize) {
        const meetingId = req.query.meetingId
        User.resultA(meetingId, (err, results) => { 
            if (err) {  
                console.log(err);
                res.status(500).send({ 'error': err.message || 'Server Error', 'code': 500 });
                return;
            };
            res.send({ result: results });
            res.status(201).end({ 'result': 'success' }); 
        });
    } else {
        const input = {
            meetingId: meetingId || 0,
            participantId: participantId || 0,
            page: page || 0,
            pageSize: pageSize || 0
        };
        User.readTableA(input, (err, results) => { 
            if (err) {  
                console.log(err);
                res.status(500).send({ 'error': err.message || 'Server Error', 'code': 500 });
                return;
            };
            res.send({ result: results });
            res.status(201).end({ 'result': 'success' });
        });
    };
});

app.get("/advance/result", (req, res, next) => {  
    const { meetingId, participantId, page, pageSize, fromTime, toTime } = req.query

    if (!participantId && !page && !pageSize) {
        const input = {
            meetingId: meetingId,
            fromTime: fromTime,
            toTime: toTime
        };
        if (input.fromTime == null) {  
            res.status(500).send({ "error": "result requires property fromTime", 'code': 500 });
            return;
        };
        if (input.toTime == null) {
            res.status(500).send({ "error": "result requires property toTime", 'code': 500 });
            return;
        };
        if (input.fromTime == null && input.toTime == null) {
            res.status(500).send({ "error": "result requires property toTime and fromTime", 'code': 500 });
            return;
        }
        User.resultU(input, (err, results) => { 
            if (err) {  
                console.log(err);
                res.status(500).send({ 'error': err.message || 'Server Error', 'code': 500 });
                return;
            };
            res.send({ result: results });
            res.status(201).end({ 'result': 'success' });
        });
    } else {
        const input = {
            meetingId: meetingId || 0,
            participantId: participantId || 0,
            page: page || 0,
            pageSize: pageSize || 0
        };
        User.readTableU(input, (err, results) => {  
            if (err) {  
                console.log(err);
                res.status(500).send({ 'error': err.message || 'Server Error', 'code': 500 });
                return;
            };
            res.send({ result: results });
            res.status(201).end({ 'result': 'success' });
        });
    }
});

module.exports = app;