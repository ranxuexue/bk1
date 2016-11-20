//创建一个处理用户相关理由的路由中间件
var express = require('express');
var Article = require('../model').Article;
//创建一个路由中间件实例
var router = express.Router();
var auth = require('../auth');

router.get('/add', auth.checkLogin, function (req, res) {
    res.render('article/add', {title: "发表文章"})
});
router.post('/add', auth.checkLogin, function (req, res) {
    var article = req.body;
    article.user = req.session.user._id;//吧当前会话的user属性的主键_id赋值给user属性
    article.createAt = new Date();
    Article.create(article, function (err, doc) {
        if (err) {
            req.session.error = inspect(err);
            res.redirect('back');
        } else {
            req.session.success = '恭喜，文章发表成功！';
            res.redirect('/');
        }
    });

});

router.get('/detail/:_id', function (req, res) {
    Article.findById(req.params._id, function (err, article) {
        console.log(article);
        res.render('article/detail', {title: '文章详情', article});
    })
});

router.get('/delete/:_id', auth.checkLogin, function (req, res) {
    Article.findById(req.params._id, function (err, article) {
        if (article.user == req.session.user._id) {
            Article.remove({_id: req.params._id}, function (err, result) {
                if (err) {
                    req.session.error = inspect(err);
                    res.redirect('back');
                } else {
                    req.session.success = '删除文章成功';
                    res.redirect('/');
                }
            });
        } else {
            req.session.error = '这不是你的文章，你无权删除';
            res.redirect('back');
        }
    })
});

module.exports = router;