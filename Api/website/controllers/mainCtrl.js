/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var moment = require('moment');
var appmdl = require('../models/mainModel');
var http = require("https");
var fs = require('fs');
var request = require('request');
var unirest = require('unirest');
const Razorpay = require('razorpay');



process.env.SECRET_KEY = "thisismysecretkey";

// ************** Get Categories  ***************


  // texturespace
  exports.getgalleryCtrl = function (req, res) {

    appmdl.getgalleryMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getprojectdataCtrl = function (req, res) {

    appmdl.getprojectdataMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getprojectalldataCtrl = function (req, res) {

    appmdl.getprojectalldataMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}


exports.contactdatapostCtrl = function (req, res) {
    var data = req.body;
    appmdl.contactdatapostMdl(data, function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getgalleryalldataCtrl = function (req, res) {

    appmdl.getgalleryalldataMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}

exports.getdesingdataCtrl = function (req, res) {

    appmdl.getdesingdataMdl(function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}
exports.getdesingalldataCtrl = function (req, res) {
    var data = req.body;
    // console.log(data);
    appmdl.getdesingalldataMdl(data,function (err, results) {
        if (err) {
            res.send({ 'status': 500, 'data': results });
            return;
        }
        res.send({ 'status': 200, 'data': results });
    });
}