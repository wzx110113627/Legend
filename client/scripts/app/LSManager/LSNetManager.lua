--[[
  作用:负责网络的所有功能
]]
require("app/LSManager/LSConnectUnit")
require("app/LSManager/LSMsg")
require("app/LSManager/LSNotifycationCenter")
LSNetManager = {}

function init(  )
	LSNetManager.SERVER_INFO = {};
	LSNetManager.serverListIP   = nil; --连接列表服务器的地址
	LSNetManager.serverListPort = 0;
	LSNetManager.gateWayIP   = nil; --选择的服务器网关的IP
	LSNetManager.gateWayPort = 0;
	LSNetManager.battleSocket = nil;--连接 serverList
	LSNetManager.gateWaySocket = nil;--连接gateWay的socket
	LSNetManager.infoSocket = nil; --主要和战斗相关服务器连接的socket
end

function LSNetManager:convertAddressToIP(  )--为后续准备，从域名转成ip，而不是直接写ip地址。
	self:reciveIPAndPort("10.2.40.195",48562)
end

---ServerList
function LSNetManager:reciveIPAndPort(IP,PORT)
	self.serverListIP = IP;
	self.serverListPort = PORT;
	self.infoSocket = createConnectUnit(self.serverListIP,self.serverListPort,handler(self,self.serverListDidConnect),handler(self,self.serverListDicClose))
	self.infoSocket:regisit(LSMsg.REQUEST_SERVER_LIST,handler(self,self.serverListReportServerList))
	self.infoSocket:regisit(LSMsg.REQUEST_SERVER_IP,handler(self,self.serverListReportGateWayInfo))
	self.infoSocket:connect()
end

function LSNetManager:connectServerList(  )
	if not self.serverListPort or not self.serverListIP then
		self:convertAddressToIP();
	else
		self.infoSocket:connect()
	end
end

function LSNetManager:serverListDidConnect(  ) --连接上了ServerList
	LSLog("LSNetManager:serverListDicConnect")
end

function LSNetManager:serverListDicClose(  ) --从ServerList端开
	LSLog("LSNetManager:serverListDicClose")
end

function LSNetManager:serverListReportServerList( MSG )
	 self.SERVER_INFO = MSG.LIST;
	 LSNotifycationCenter:sendNotifyCation("GET_ALL_SERVER_LIST_INFO",self.SERVER_INFO)
end

function LSNetManager:serverListReportGateWayInfo( MSG ) --收到服务器传来的消息
	self.gateWayIP = MSG.IP;
	self.gateWayPort = MSG.PORT;
	self:connectToGateWay();
end

----GateWay
function LSNetManager:connectToGateWay(  )
	if self.gateWayIP and self.gateWayPort then
		self.gateWaySocket = createConnectUnit(self.gateWayIP,self.gateWayPort,handler(self,self.gateWayDidConnect),handler(self,self.serverListDicClose))
		self.gateWaySocket:connect()
	end
end

function LSNetManager:gateWayDidConnect(  )
	LSLog("LSNetManager:gateWayDidConnect")
	self.infoSocket:close();
end

function LSNetManager:serverListDicClose(  )
	LSLog("LSNetManager:serverListDicClose")
end



init()
return LSNetManager;
