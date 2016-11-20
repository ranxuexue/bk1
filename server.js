var express = require('express');
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
var session = require('express-session');//会话中间件
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var path = require('path');
global.inspect = require('util').inspect;//var util = require('util');
var app = express();
//当渲染模板的时候没有指定后缀的时候，自动添加此后缀，来查找模板
app.set('view engine', 'html');
//指定模板存放目录
app.set('views', path.join(__dirname, 'views'));
//指定对什么类型的文件以何种方法来渲染
app.engine('.html', require('ejs').__express);

//静态文件中间件,指定静态文件存放的根目录的绝对路径
app.use(express.static(path.join(__dirname, 'public')), function (req, res, next) {

    next();
});

app.use(bodyParser.urlencoded({extended: true}));
//使用session中间件之后会在 req.session 上挂属性  eg: req.session.username
var config = require('./config');
app.use(session({
    secret: 'rxx',//加密cookie的秘钥
    cookie: {httpOnly: true},//httpOnly =true时，客户端js无法读取cookie
    resave: true, //每次客户端访问服务器的时候都会重新保存一次会话对象
    saveUninitialized: true,//保存未使用过的session对象
    store:new MongoStore({//指定话话存储位置
        url:config.dbUrl
    })
}));
//会判断请求的url是否以/user开头，是的话执行user中间件函数，不是跳过  路径：/user/signin
app.use(function (req, res, next) {
    //res.locals是真正渲染模板的对象
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    //吧会话对象中的user属性取出来给res.locals
    res.locals.user = req.session.user;
    req.session.success = req.session.error = null;
    next();
});
app.use('/', index);
app.use('/user', user);
app.use('/article', article);
app.listen(9000);
