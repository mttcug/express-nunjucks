var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/detail/:id', function(req, res, next) {
    var oppoId=req.params.id;

    console.log("详情页面",oppoId);
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json-rpc',
        'keyname':'xx'
    };

    var transferParams = {
        sessionId: '',
        opportunityId: oppoId
    }

    var options = {
        url: "https://www.xw18.cn/xw/MerchantService",
        method: 'POST',
        headers: headers,
        json:true,
        body: JSON.stringify({"jsonrpc":"2.0","method": "opportunity_get", "params":transferParams, "id": 1})
    };


    request(options, function (error, response, body) {
        console.log("转店详情:",body.result);
        res.render('detail', {
            infoDetail:body.result
        });
    });
});

module.exports = router;
