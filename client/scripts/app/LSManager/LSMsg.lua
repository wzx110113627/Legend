--[[
	作用:定义所有和服务器的消息
]]

LSMsg = {}

function init( ... )
	LSMsg.MSG_CLIENT_SERVER_REQUEST_SERVERLIST = 901000001;


	LSMsg.MSG_GATEWAY_PLAY_WITH_ROLE = 902001006;

end

init()
return LSMsg;