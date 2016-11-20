var express = require('express');
var router = express.Router();
var Article = require('../model').Article;
router.get('/', function (req, res) {
    //希望articles中的user属性总字符串转换成对象，populate用来讲对应的属性从ObjectId转换成对应的对象
    Article.find({}).populate('user').exec(function (err, articles) {
        //用外键吧其他表的主键变成对象来用，
        /*articles.forEach(function (article) {
            User.findById(article.user, function (err, userObj) {  //userObj：当前id那一条信息
                article.user = userObj;
            })
        });*/
        res.render('index', {title: '首页', articles});//articles:articles
    });
});
module.exports = router;