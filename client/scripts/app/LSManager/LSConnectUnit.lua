
cc.utils 	= require("framework.cc.utils.init")
cc.net 		= require("framework.cc.net.init")

function tableTojson(t)  
    local function serialize(tbl)  
        local tmp = {}  
        for k, v in pairs(tbl) do
            local k_type = type(k)  
            local v_type = type(v)  
            local key = (k_type == "string" and "\"" .. k .. "\":") or (k_type == "number" and "")  
            local value = (v_type == "table" and serialize(v))  
                    or (v_type == "boolean" and tostring(v))  
                    or (v_type == "string" and "\"" .. v .. "\"")  
                    or (v_type == "number" and v)  
            tmp[#tmp + 1] = key and value and tostring(key) .. tostring(value) or nil  
        end  
        if table.maxn(tbl) == 0 then  
            return "{" .. table.concat(tmp, ",") .. "}"  
        else  
            return "[" .. table.concat(tmp, ",") .. "]"  
        end  
    end  
    assert(type(t) == "table")  
    return serialize(t)  
end 

function string.split(str, delimiter)
	if str==nil or str=='' or delimiter==nil then
		return nil
	end
	
    local result = {}
    for match in (str..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match)
    end
    return result
end

function createConnectUnit( IP,PORT,ON_CONNECT,ON_CLOSE)
	local LSConnectUnit = {}

	local init = function(  )
		LSConnectUnit.BUFF = "";
		LSConnectUnit.callBacks = {}
		LSConnectUnit.serverIP = IP;
		LSConnectUnit.serverPort = PORT;
		LSConnectUnit.socket = nil;
		LSConnectUnit.spater = string.char(1);
	end

	function LSConnectUnit:regisit( MSG,HANDLE )
		if MSG and HANDLE then
			self.callBacks[MSG] = HANDLE;
		end
	end

	function LSConnectUnit:connect( )
		if not self.socket then 
			print("crete socket ------------",self.serverIP,self.serverPort)
			self.socket = cc.net.SocketTCP.new(self.serverIP, self.serverPort, false);
			self.socket:addEventListener(cc.net.SocketTCP.EVENT_CONNECTED, handler(self, self.onConnected))
			self.socket:addEventListener(cc.net.SocketTCP.EVENT_CLOSE, handler(self,self.onStatus))
			self.socket:addEventListener(cc.net.SocketTCP.EVENT_CLOSED, handler(self,self.onStatus))
			self.socket:addEventListener(cc.net.SocketTCP.EVENT_CONNECT_FAILURE, handler(self,self.onStatus))
			self.socket:addEventListener(cc.net.SocketTCP.EVENT_DATA, handler(self,self.onData))
		end
		self.socket:connect();
	end
	function LSConnectUnit:onStatus( EVENT )
		print("socket status: %s", EVENT.name)
	end

	function LSConnectUnit:onConnected( EVENT )
		print("socket onConnected: %s", EVENT.name)
		local sendOBJ = {}
		sendOBJ["MSG"] = 900000001;
		ON_CONNECT(self)

	end
	function LSConnectUnit:onData( EVENT )
		self.BUFF = self.BUFF .. EVENT.data;
		self:analys()
	end

	function LSConnectUnit:analys(  )
		local buffLength = string.len(self.BUFF);
		local lastStr = string.sub(self.BUFF,buffLength,buffLength)
		local msgArr = string.split(self.BUFF,self.spater)
		if lastStr ~= self.spater then
			self.BUFF = msgArr[#msgArr] or "";
			table.remove(msgArr,#msgArr);		
		end
		for i=1,#msgArr do
			local msg = json.decode(msgArr[i])
			if msg then 
				if msg.MSG then 
					self:distribution(msg)
				else
					LSLog("LSConnectUnit:analys:","该消息缺少消息id:",msgArr[i])
				end
			end
		end
	end

	function LSConnectUnit:distribution( MSG )
		local callBack = self.callBacks[MSG.MSG]
		if callBack then
			callBack(MSG)
		else
			LSLog("LSConnectUnit:distribution:","消息没响应函数,ID为:",MSG.MSG)
		end
	end

	function LSConnectUnit:close( )
		self.socket.close();
	end

	function LSConnectUnit:send( DATA )
		if DATA then 
			local sendText = tableTojson(DATA)
			self.socket:send(sendText..self.spater)
		end
	end

	init();
	return LSConnectUnit;
end

