
require("app/Tools/GEnum")
require("app/LSManager/LSNotifycationCenter")



local StateCreater = {} --绑定状态名称和对应的函数

StateCreater["GAME_STATE_SERVER_LIST"] = function( PARAM )
	local state = {}

	function createServerListCell( TABLEVIEW )
		local item = TABLEVIEW:newItem()
		if not item.CELL_VIEW then
			 item.CELL_VIEW = CCBuilderReaderLoad("LSServerListCell.ccbi",CCBProxy:create(),item)
			 item:addContent(item.CELL_VIEW)
			 item.CELL_VIEW:setContentSize(state.TABLE_VIEW:getContentSize().width,50)
			 item.CELL_VIEW:setPosition(0,0)
		end
		return item;
	end
	function init( )
		state.INDEX = GEnum["GAME_STATE_SERVER_LIST"];
		state.NAME =  "GAME_STATE_SERVER_LIST";
		state.VIEW = CCBuilderReaderLoad("LSServerList.ccbi",CCBProxy:create(),state)
		LSNotifycationCenter:regisit(GET_ALL_SERVER_LIST_INFO,state,handler(state,state.serverListChanged))

		local tableFrameSize = state.TABLE_VIEW:getContentSize()

		local tableView = CCTableView:create(tableFrameSize)
		-- tableView:setTag(10000 + i)
		-- tableView:setTouchPriority(-1)
		tableView:setDirection(kCCScrollViewDirectionVertical)
		-- tableView:setPosition(ccp(0, 0))
		--tableView:setVerticalFillOrder(kCCTableViewFillTopDown)
		state.TABLE_VIEW:addChild(tableView)
		tableView:registerScriptHandler(handler(state, state.cellSizeForTable), CCTableView.kTableCellSizeForIndex)
		tableView:registerScriptHandler(handler(state, state.tableCellAtIndex), CCTableView.kTableCellSizeAtIndex)
		tableView:registerScriptHandler(handler(state, state.numberOfCellsInTableView), CCTableView.kNumberOfCellsInTableView)
		tableView:registerScriptHandler(handler(state, state.tableCellTouched), CCTableView.kTableCellTouched)
		tableView:reloadData()
		state.tableView = tableView;

	end

	function state:cellSizeForTable( view, idx )
		LSLog("cellSizeForTable  1")
		return 50, 710
	end
	function state:tableCellAtIndex( view, idx )
			local cell = view:dequeueCell()
		    if not cell then
		        cell = CCTableViewCell:new()
		        cell.CELL_VIEW = CCBuilderReaderLoad("LSServerListCell.ccbi",CCBProxy:create(),cell)
		        cell.CELL_VIEW:setContentSize(710,50)
		        cell:addChild(cell.CELL_VIEW)
		    end
		    local info = LSNetManager.SERVER_INFO[idx+1]
		    cell.SERVER_NAME:setString(info.NAME)
		return  cell;
	end

	function state:numberOfCellsInTableView( ... )
		if LSNetManager.SERVER_INFO then
			return #LSNetManager.SERVER_INFO
		end
		return 0;
	end

	function state:tableCellTouched(view, cell)
		LSLog("state:tableCellTouched",cell.SERVER_NAME:getString())
		LSNetManager:requestGateWayIPByName( cell.SERVER_NAME:getString() )
		
	end

	function state:serverListChanged(DATA)
		LSLog("state:serverListChanged",DATA,#DATA)
        self.tableView:reloadData();
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
