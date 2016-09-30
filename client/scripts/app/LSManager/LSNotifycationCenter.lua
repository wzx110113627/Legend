--[[
	作用:用于所有游戏内部的通知
]]

function createNotifycationHandle( TARGET,HANDLER )
	 local handle = {}
	 handle.target =  TARGET;
	 handle.callback = HANDLER;
	 return handle;
end

--为了方便查找，所有的通知事件都定义在这里
GET_ALL_SERVER_LIST_INFO = "GET_ALL_SERVER_LIST_INFO" --收到了服务器列表,有变化也会走这个通知


LSNotifycationCenter = {}

function LSNotifycationCenter:regisit( NOTIFY,TARGET,HANDLE)
	LSLog("LSNotifycationCenter:regisit-->准备注册",NOTIFY,TARGET,HANDLE)
	if NOTIFY and TARGET and HANDLE then
		local curArr = self[NOTIFY]
		if not curArr then 
			curArr = {};
			self[NOTIFY] = curArr;
			--setmetatable(curArr, {__mode = "k"});
		end
		curArr[1] = HANDLE;
		LSLog("LSNotifycationCenter:regisit-->注册结果",curArr[TARGET])
	else
		LSLog("LSNotifycationCenter:regisit-->注册失败",NOTIFY,TARGET,HANDLE)
	end
end

function LSNotifycationCenter:remove( NOTIFY,TARGET)
	if NOTIFY and TARGET then
		local curArr = self[NOTIFY]
		if curArr then
			curArr[TARGET] = nil;
		end
	end
end

function LSNotifycationCenter:removeAll(TARGET)
	for i,v in ipairs(self) do
		v[TARGET] = nil;
	end
end

function LSNotifycationCenter:sendNotifyCation( NOTIFY,DATA )
	if NOTIFY and DATA then
		local curArr = self[NOTIFY]
		
		if curArr then
			LSLog("LSNotifycationCenter:sendNotifyCation-->有注册事件",NOTIFY,DATA)
			curArr[1](DATA)
			for i,v in ipairs(curArr) do
				LSLog("LSNotifycationCenter:sendNotifyCation-->分发",i,v)
				v(DATA);
			end
		end
	else
		LSLog("LSNotifycationCenter:sendNotifyCation",NOTIFY,DATA)
	end
end

return LSNotifycationCenter;