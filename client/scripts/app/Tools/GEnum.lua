

GEnum = {}

function GEnum:regisit( ENUM,NAME)
	if ENUM and NAME then 
		local GEnumUnit = self[ENUM];
		if not GEnumUnit then
			GEnumUnit = {}
			self[ENUM] = GEnumUnit
		end
		local index = #GEnumUnit+1;
		GEnumUnit[index] = NAME;
		GEnum[NAME] = index;
	end
end

function GEnum:name( ENUM,INDEX )
	local GEnumUnit = self[ENUM];
	if not GEnumUnit then return "" end;
	INDEX = INDEX or -1;
	return GEnumUnit[INDEX] or "错误枚举["..ENUM.."]:"..INDEX ;
end

GEnum:regisit("GAME_STATE","GAME_STATE_SERVER_LIST")--查询服务器列表状态
GEnum:regisit("GAME_STATE","GAME_STATE_LOGIN")		--登陆状态



return GEnum;