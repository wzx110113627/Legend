
/*
   作用：定义消息id类型以及消息结构体的内容
   说明:消息结构体都是9位数字，前三位意思如下，其他6位暂定
   100:网关和ServerList之间协议
   200:世界服务器和网关之间
   300:副本服务器和网关之间
   400:网关和支付中心之间
   500:网关和帐号中心之间
   900:900以上的数字所有服务器和客户端之间
       901 LSServerList和客户端之间的通信
       902 LSGateWay和客户端的通信
       903 LSWordServer和客户端的通信
       904 LSDungeonServer和客户端的通信

   所有服务器回复客户端的通信消息里面都带有返回结果R
   R = 0;表示正常处理
   R > 0;表示有错误;

   这里所有的通信不含有cdn服务器的通信,cdn服务器后期设计时候应该走HTTP
*/

var  ERROR_CODE = {}
exports.ERROR_CODE = ERROR_CODE

//LSServerList 返回的错误类型有

//选择服务器相关
ERROR_CODE.ERROR_SERVERLIST_SERVER_UNAVALABLE = 10000;//所选择服务器暂时不可用

//登录
ERROR_CODE.ERROR_GATEWAY_LOGIN_BAD_ACCOUNT    = 20101;//登录账户不存在
ERROR_CODE.ERROR_GATEWAY_LOGIN_BAD_PWD 	      = 20102;//登录密码不正确
//帐号注册
ERROR_CODE.ERROR_SERVERLIST_REGISIT_SAME_USER_NAME = 20201;//注册重复用户名
ERROR_CODE.ERROR_SERVERLIST_REGISIT_BAD_USER_NAME  = 20202;//注册用户名不合法
ERROR_CODE.ERROR_SERVERLIST_REGISIT_BAD_USER_PSD   = 20203;//注册密码不合法
ERROR_CODE.ERROR_SERVERLIST_REGISIT_BAD_ROLE_NAME  = 20304;//角色名称不合法
ERROR_CODE.ERROR_SERVERLIST_REGISIT_SAME_ROLE_NAME = 20305;//角色名称重复

//更新
ERROR_CODE.ERROR_CLIENT_NEED_UPDATE = 10001;//所选择服务器暂时不可用


//客户端和LSServerList的通信

exports.MSG_CLIENT_SERVER_REQUEST_SERVERLIST = 901000001;
/* //客户端向LSServerList请求当前可用的服务器列表以及状态
 C TO S
 {
	MSG = 901000001
 }

 S TO C
 {//服务器更变也走这一条主动推给可用在线的客户端.
	MSG = 901000001;
	LIST = {
		{NAME=,STATE = ,IP=,PORT=},
		{NAME=,STATE =,IP=,PORT=},
	}
	R = 0;
 }
 */


//客户端和LSGateWay之间的通信

exports.MSG_GATEWAY_CLIENT_SHOULD_UPDATE = 902000001;
/* //客户端向LSServerList请求看是否需要更新客户端.
 C TO S
 {
 MSG = 902000001
 VERSION:string
 }

 S TO C
 {//服务器更变也走这一条主动推给可用在线的客户端.
 	MSG = 902000001;
 	UODATE_ADDRESS:string;//到这个地方下载资源包.zip的.下好了解压缩.
 	R = 0;//不需要更新, > 0 找下载地址更新资源
 }

 备注:每发布一个版本,服务器上都会生成各个版本到当前版本的所有补丁.然后根据客户端发来的版本好,返回一个正确的补丁下载地址给客户端下载.
 之所以让客户端向 LSGateWay询问,而不是向LSServerist询问,是因问不同服务器之间的版本可能会不一样.
 */


exports.MSG_GATEWAY_ACCOUNT_LOGIN = 902001002;
/*注册登录
 C TO S
 {
	 MSG = 902001002
	 USR_NAME:string(三放登录,这个地方就是三放的UID)
 	 USR_PWD:string(三放登录,这个地方是三放的token)
	 LOGIN_TTPE:1 用我们的系统登录  2:微信登录  3:其他再说,例如新浪微博什么的
	 R = 0;
 }
 S TO C
 {
 	MSG = 902001002;
	ROLE_INFO:{
		//如果ROLE_INFO==nil,说明没有角色
	};
	R = 0;
	TOKEN:string 我们的令牌,合法用户的唯一认证
 }
 */


exports.MSG_GATEWAY_REGISIT_ACCOUNT = 902001003;
/*注册帐号
 C TO S
 {//注册帐号肯定不是三放登录
 	MSG = 902001003
 	USR_NAME:string
 	USR_PWD:string
 	R = 0;
 }
 S TO C
 {
	 MSG = 902001003;
	 R = 0;
	 TOKEN:string 我们的令牌,合法用户的唯一认证
	 备注:注册成功等于登录成功
 }
 */


exports.MSG_GATEWAY_CREATE_ROLE = 902001004;
/*创建角色
 C TO S
 {//创建角色
 	MSG = 902001004
 	TOKEN:string
 	ROLE_TYPE:
 	ROLE_NAME:
 }

 S TO C
 {
 	MSG = 902001004;
 	ROLE_INFO:{

 	}
 	R = 0;
 }
 */

exports.MSG_GATEWAY_DELETE_ROLE = 902001005;
/*创建角色
 C TO S
 {//创建角色
 	MSG = 902001005
 	TOKEN:string
 	ROLE_GUID:
 }

 S TO C
 {
 	MSG = 902001005;
    ROLE_GUID://被删除的角色GUID
 	R = 0;
 }
 */

exports.MSG_GATEWAY_PLAY_WITH_ROLE = 902001006;
/*创建角色
 C TO S
 {//创建角色
 	MSG = 902001006
 	TOKEN:string
 	ROLE_GUID:
 }

 S TO C
 {
	 MSG = 902001006;
	 IP:
	 PORT:
	 ROLE_GUID:
	 R:
 }
 */



//网关告诉serverList服务器我是谁
exports.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO = 100000001; 
/*
	G2S : MSG = 100000001  ,SERVER_ID(int) SERVER_NAME = string
*/

exports.MSG_GATEWAY_TO_SERVERLIST_TEST = 100000002; 
/*
	G2S : MSG = 100000001  ,TEXT = string
*/



exports.MSG_WORDSERVER_TO_GATEWAY_WORDSERVERINFO = 200000001; 
/*
	G2S : MSG = 200000001  ,SERVER_TYPE(int) SERVER_NAME = string
*/

exports.MSG_WORDSERVER_TO_GATEWAY_TEST = 200000002; 
/*
	G2S : MSG = 200000001  ,TEXT = string
*/



