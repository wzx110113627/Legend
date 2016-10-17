--[[
  作用:负责网络的所有功能
]]
require("app/LSManager/LSConnectUnit")
require("app/LSManager/LSMsg")
require("app/LSManager/LSNotifycationCenter")
LSNetManager = {}

function init( )
	LSNetManager.SERVER_INFO = {};
	LSNetManager.serverListIP   = nil; --连接列表服务器的地址
	LSNetManager.serverListPort = 0;
	LSNetManager.gateWayIP   = nil; --选择的服务器网关的IP
	LSNetManager.gateWayPort = 0;

	LSNetManager.battleSocket = nil;--主要和战斗相关服务器连接的socket
	LSNetManager.gateWaySocket = nil;--连接gateWay的socket
	LSNetManager.infoSocket = nil; --连接 serverList
	LSNetManager.chatSocket = nil; --聊天服务器
end

function LSNetManager:convertAddressToIP(  )--为后续准备，从域名转成ip，而不是直接写ip地址。
	self:reciveIPAndPort("10.2.40.195",9710)
end

---ServerList
function LSNetManager:reciveIPAndPort(IP,PORT)
	self.serverListIP = IP;
	self.serverListPort = PORT;
	self.infoSocket = createConnectUnit(self.serverListIP,self.serverListPort,handler(self,self.serverListDidConnected),handler(self,self.serverListDidClose))
	self.infoSocket:regisit(LSMsg.MSG_CLIENT_SERVER_REQUEST_SERVERLIST,handler(self,self.serverListReportServerList))
	self.infoSocket:connect()
end

function LSNetManager:connectServerList(  )
	if not self.serverListPort or not self.serverListIP then
		self:convertAddressToIP();
	else
		self.infoSocket:connect()
	end
end

function LSNetManager:serverListDidConnected(  ) --连接上了ServerList
	LSLog("LSNetManager:serverListDidConnect")
	local msg = {}
	msg.MSG = LSMsg.MSG_CLIENT_SERVER_REQUEST_SERVERLIST
	self.infoSocket:send(msg)
end

function LSNetManager:serverListDidClose(  ) --从ServerList端开
	LSLog("LSNetManager:serverListDidClose")
	if not self.gateWaySocket then
		self.infoSocket:connect()
	end
end

function LSNetManager:requestGateWayIPByName( NAMNE )
	if NAMNE then
		local msg = {}
		msg.MSG = LSMsg.REQUEST_SERVER_IP;
		msg.NAME = NAMNE;
		self.infoSocket:send(msg)
	end
end

function LSNetManager:serverListReportServerList( MSG )
	 LSLog("LSNetManager:serverListReportServerList",MSG.LIST)
	 self.SERVER_INFO = MSG.LIST;
	 LSNotifycationCenter:sendNotifyCation("GET_ALL_SERVER_LIST_INFO",self.SERVER_INFO)
end

function LSNetManager:setGateWayIPandPort( IP,PORT )--连接选中的服务器 
	if IP and PORT then
		self.gateWayIP = IP;
		self.gateWayPort = PORT;
		self:connectToGateWay();
		LSLog("LSNetManager:setGateWayIPandPort")
	end
end

----GateWay
function LSNetManager:connectToGateWay(  )
	LSLog("LSNetManager:connectToGateWay")
	if self.gateWayIP and self.gateWayPort then
		self.gateWaySocket = createConnectUnit(self.gateWayIP,self.gateWayPort,handler(self,self.gateWayDidConnected),handler(self,self.gateWayDidDidClose))
		self.gateWaySocket:regisit(LSMsg.MSG_GATEWAY_PLAY_WITH_ROLE,handler(self,self.onGateWayReportLocation))
		self.gateWaySocket:connect()
	else
		LSLog("LSNetManager:connectToGateWay",self.gateWayIP,self.gateWayPort)
	end
end

function LSNetManager:gateWayDidConnected(  )
	LSLog("LSNetManager:gateWayDidConnected")
	
	local msg = {}
	msg.MSG = LSMsg.MSG_GATEWAY_PLAY_WITH_ROLE;
	self.gateWaySocket:send(msg)
	self.infoSocket:close();

end

function LSNetManager:gateWayDidDidClose(  )
	LSLog("LSNetManager:gateWayDidDidClose")
end

function LSNetManager:onGateWayReportLocation( MSG )
	LSLog("LSNetManager:onGateWayReportLocation:",MSG);
	for k,v in pairs(MSG) do
		print(k,v)
	end
	self.battleSocket = createConnectUnit(MSG.IP,MSG.PORT,handler(self,self.onWorldServerConnected),handler(self,self.onWorldServerDidClose))
	--self.battleSocket:regisit(LSMsg.MSG_CLIENT_SERVER_REQUEST_SERVERLIST,handler(self,self.serverListReportServerList))
	self.battleSocket:connect()
end
function LSNetManager:onWorldServerConnected(  )
	LSLog("LSNetManager:onWorldServerConnected")

end

function LSNetManager:onWorldServerDidClose(  )
	-- body
end

init()
return LSNetManager;
