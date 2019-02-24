var express = require('express');
var router = express.Router();


var hakkinda = function(req,res) {
	res.render('hakkinda',{'title':'Hakkında'});
}

module.exports = {hakkinda};



