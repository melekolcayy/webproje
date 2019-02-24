var express = require('express');
var router = express.Router();

var index = function(req,res) {
	res.render('index',{'title':'main'});
}

module.exports = {index};



