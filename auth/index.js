//编写一个中间件，如果此用户没有登录，则可能继续访问路由，如果已经登录，就弹回首页。并告诉你已经登陆了，不要在重复登录
exports.checkNotLogin = function (req,res,next) {
    if(req.session.user){//有值  已经登录
        req.session.error = '此链接不需要登录后再访问，你已经是登录状态了！';
        res.redirect('/');
    }else{
        next();
    }
};
//如果登录可以访问路由。如果没有登录，则调到登录页让用户登录
exports.checkLogin = function (req,res,next) {
    if(req.session.user){//
        next();
    }else{
        req.session.error = '此链接需要登录后访问，请登录！';
        res.redirect('/user/signin');
    }
};