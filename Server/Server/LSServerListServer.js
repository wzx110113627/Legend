/*
*   作用:所有客户端第一次连接的服务器,该服务器负责告诉所有客户端当前的服务器名称已经状态.并且可以获取指定服务器的IP地址和端口号.
* */

var SERVER_PORT = 9980;
var CLIENT_PORT = 9710;

var LSServerMaker = require("../Manager/LSServerMaker");
var LSCONNECTION_STATE = require("../Connection/LSConnection").LSCONNECTION_STATE;
var LSServerHandler = require("../Connection/LSServerHandler").LSServerHandler;
var LSSERVER_STATE = require("../Connection/LSServerHandler").LSSERVER_STATE;
var LSLog = require("../public/LSCommondHandle").LSLog;
var MSG = require("../Connection/LSMessageDef");

require("../public/LSHelper");

function LSServerListServer()
{
    var self = this;

    function init(){
        self.serverArray = new Array();
        self.clientArray = new Array();
        self.serverMaker = new LSServerMaker(self.serverStartOn,
            self.newGateWayComein,
            self.gateWayDisConnect,
            SERVER_PORT
        );
        self.serverMaker.startListen();
    }
    //所有网关相关操作
    this.serverStartOn = function(IP,PORT)
    {
        self.serverIP = IP;
        self.serverPort = PORT;
        LSLog("ServerListStartForServerOn:"+IP + " port:"+PORT)
    }
    //新服务器连接进来,但是现在无法知道服务器的具体信息
    this.newGateWayComein = function(GateWay)
    {
        if(GateWay)
        {
            self.serverArray.push(GateWay)
            LSLog("newGateWayComein,当前数量为:"+self.serverArray.length);
            GateWay.regisit(MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,self.gateWayReportInfo)
        }
    }

    //服务器状态发生改变的时候.Info里面有服务器的名称,状态,类型等信息
    this.gateWayReportInfo = function(GateWay,Info)
    {
        if(GateWay && Info)
        {
            GateWay.setState(LSCONNECTION_STATE.LSCONNECTION_ON_CONNECTTING);
            GateWay.setServerState(Info.SERVER_STATE)
            GateWay.setServerName(Info.SERVER_NAME)
            LSLog("gateWayReportInfo:欢迎服务器 :"+Info.SERVER_NAME+" 的加入")

            var msg = {}
            msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
            msg.TEXT = "欢迎你";
            GateWay.send(msg);
        }
        //TODO:通知所有客户端,服务器状态变化
    }
    this.gateWayDisConnect = function (GateWay,Info)
    {
        if(GateWay)
        {
            if(this.serverArray.remove(GateWay))
            {
                LSLog("gateWayDisConnect: 网关:"+GateWay.getServerName()+" 关闭"+ ",剩余服务器数量:"+self.serverArray.length);
            }else{
                LSLog("gateWayDisConnect: 网关:"+GateWay.getServerName()+" 关闭失败,没有找到这个服务器"+ ",剩余服务器数量:"+self.serverArray.length);
            }

        }
    }

    //所有客户端的操作

    init();
};

LSServerListServer();