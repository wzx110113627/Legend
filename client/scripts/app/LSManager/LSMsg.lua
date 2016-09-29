--[[
	作用:定义所有和服务器的消息
]]

LSMsg = {}

function init( ... )
	LSMsg.REQUEST_SERVER_LIST = 900000001;
	LSMsg.REQUEST_SERVER_IP = 900000002;
end

init()
return LSMsg;