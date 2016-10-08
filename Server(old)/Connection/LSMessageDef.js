
/*
   作用：定义消息id类型以及消息结构体的内容
   说明:消息结构体都是9位数字，前三位意思如下，其他6位暂定
   100:网关和ServerList之间协议
   200:世界服务器和网关之间
   300:副本服务器和网关之间
   400:网关和支付中心之间
   500:网关和帐号中心之间
   900:所有服务器和客户端之间
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




exports.MSG_CLIENT_SERVER_REQUEST_SERVERLIST = 900000001; 
/*
   C TO S
   G2S : MSG = 900000001 

   S TO C
   {
      MSG = 900000001;
      LIST = {
         {NAME=,STATE,IP,PORT},
         {NAME=,STATE,IP,PORT},
      }
   }
*/

exports.MSG_CLIENT_SERVER_REQUEST_SERVER_IP = 900000002; 

/*
   C TO S
   G2S : MSG = 900000002 
         NAME:string

   S TO C
   {
      MSG = 900000002;
      IP:string
      PORT:int
   }
*/
