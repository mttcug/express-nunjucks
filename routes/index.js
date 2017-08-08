var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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

module.exports = router;
