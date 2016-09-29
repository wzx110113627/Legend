
require("app/Tools/GEnum")
require("app/LSManager/LSNotifycationCenter")



local StateCreater = {} --绑定状态名称和对应的函数

StateCreater["GAME_STATE_SERVER_LIST"] = function( PARAM )
	local state = {}
	function init( )
		state.INDEX = GEnum["GAME_STATE_SERVER_LIST"];
		state.NAME =  "GAME_STATE_SERVER_LIST";
		state.VIEW = CCBuilderReaderLoad("LSServerList.ccbi",CCBProxy:create(),state)
		LSNotifycationCenter:regisit(GET_ALL_SERVER_LIST_INFO,state,handler(state,state.serverListChanged))
		print("----------------",state.TABLE_VIEW)
	end

	function state:serverListChanged(DATA)
			LSLog("state:serverListChanged",DATA)
	end

	function state:enter(  )--被创建时候
		LSLog("state:enter","enter")
	end

	function state:update( dt ) --最顶层的状态会接受到update
		LSLog("state:enter","update")
	end

	function state:exit( ) --被销毁时候
		LSLog("state:enter","exit")
	end

	function state:becomeTop(  )--回到最顶层的时候
		LSLog("state:enter","becomeTop")
	end

	function state:leaveTop(  )--离开最顶层的时候
		LSLog("state:enter","leaveTop")
	end
	init();
	return state;
end

function createStateByName( NAME, PARAM )
	 local creater = StateCreater[NAME]
	 if creater then 
	 	return creater(PARAM)
	 else 
	 	print("")
	 end
end
