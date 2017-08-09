var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json-rpc',
        'keyname':'xx'
    };

    var transferParams = {
        query: {
            keyword: '',
            cityId: '4401',
            districtId:'',
            industryId:'',
            minArea: '',
            maxArea: '',
            minRent: null, maxRent: null, matchSuitableIndustry: '', hasPhoto: '', isBusiness: '', canEmptyTransfer: ''
        },
        pageNo: 0,
        pageSize: 20
    }

    var options = {
        url: "https://www.xw18.cn/xw/WebSiteService",
        method: 'POST',
        headers: headers,
        form: {jsonrpc:'{"method": "search_transfer", "params":transferParams, "id": 4}'}
    };


    request(options, function (error, response, body) {
        console.log("result:",body);
        res.render('index', {
            category_list:[
                {
                    id:"1",
                    name:"首页"
                },
                {
                    id:"2",
                    name:"转店"
                },
                {
                    id:"3",
                    name:"找店"
                },
                {
                    id:"4",
                    name:"资讯"
                },
                {
                    id:"5",
                    name:"新闻"
                },
                {
                    id:"6",
                    name:"关于"
                }
            ]
        });
    });

});

module.exports = router;
