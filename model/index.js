var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.dbUrl);
//�û�
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar:String
}, {collection: 'user'});//����
var User = mongoose.model('User', UserSchema);
exports.User = User;
//����
var ObjectId = mongoose.Schema.Types.ObjectId;
var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    //�����Ƕ���ID���ͣ�ref:��ʾ�����Ǹ�ģ�ͣ�ID���ĸ����ϵ�id
    user:{type:ObjectId,ref:'User'},
    createAt:{type:String,default:new Date()}
},{collection:'article'});
exports.Article = mongoose.model('Article', ArticleSchema);


