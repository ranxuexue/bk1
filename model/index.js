var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbUrl);
//用户
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar:String
}, {collection: 'user'});//表名
var User = mongoose.model('User', UserSchema);
exports.User = User;
//文章
var ObjectId = mongoose.Schema.Types.ObjectId;
var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    //类型是对象ID类型，ref:表示引用那个模型，ID是哪个集合的id
    user:{type:ObjectId,ref:'User'},
    createAt:{type:String,default:new Date()}
},{collection:'article'});
exports.Article = mongoose.model('Article', ArticleSchema);


