var express = require('express');//创建一个处理用户相关理由的路由中间件
var User = require('../model').User;//当require是一个文件夹的时候，会自动加载文件夹下的index.js模块
var multer = require('multer');//用来上传图片
var upload = multer({dest: 'public/'});
var auth = require('../auth');
var router = express.Router();//创建一个路由中间件实例

router.get('/signup',auth.checkNotLogin, function (req, res) {//router也是个路由的容器，里面可以定义很多路由
    res.render('user/signup', {title: "注册"})
});

router.post('/signup', auth.checkNotLogin,upload.single('avatar'), function (req, res) {//upload.single('avatar') 中间件  上传文件
    //console.log(req.body);
    //console.log(req.file);
    var user = req.body;
    user.avatar = '/' + req.file.filename;

    User.findOne({username: user.username}, function (err, doc) {//看看找没找到这个名字  有的话就是err  没有的话就doc
        if (err) {
            req.session.error = /*util.*/inspect(err);
            res.redirect('back');
        } else {
            if (doc) {
                req.session.error = '此用户名已经被占用，请选择其它用名';
                // code  fail表示失败  ok成功   data是数据
                //res.send({code:'fail',data:'此用户名被占用，请更换！'});
                //跳回上一个页面   哪来的回哪去
                res.redirect('back');
            } else {
                User.create(user, function (err, doc) {
                    if (err) {
                        req.session.error = /*util.*/inspect(err);
                        res.redirect('back');
                    } else {
                        req.session.success = "注册成功！欢迎登录！";
                        res.redirect('/user/signin');
                    }
                });
            }
        }
    });
});
router.get('/signin',auth.checkNotLogin, function (req, res) {
    res.render('user/signin', {title: "登录"})
});

router.post('/signin',auth.checkNotLogin, function (req, res) {
    var user = req.body;
    User.findOne(user, function (err, doc) {
        if (err) {
            req.session.error = /*util.*/inspect(err);
            res.redirect('back');
        } else {
            if (doc) {
                req.session.success = '登录成功！';
                req.session.user = doc;
                res.redirect('/');
            } else {
                req.session.error = "同户名和密码不正确！";
                res.redirect('back');
            }
        }
    });
    //var result = '';
    //req.on('data', function (data) {
    //    result += data;
    //});
    //req.on('end', function () {
    //    var _result = querystring.parse(result);
    //    var username = _result.username;
    //    var flag = false;
    //    users.forEach(function (item) {
    //        if (username == item['username']) {
    //            flag = true;
    //        }
    //    });
    //    if (flag) {
    //        res.redirect('/');
    //    } else {
    //        res.redirect('/user/signin');
    //    }
    //});

});
router.get('/signout',auth.checkLogin, function (req, res) {
    req.session.user = null;
    req.session.success = "已退出";
    res.redirect('/');
});
module.exports = router;
















