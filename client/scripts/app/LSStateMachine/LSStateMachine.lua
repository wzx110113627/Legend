

require("app/LSStateMachine/LSState")
require("app/LSManager/LSNotifycationCenter")


LSStateMachine = {}
LSStateMachine.stack = {};

function LSStateMachine:update( dt ) 
	local topState = self:top();
	if topState then 
		topState:update(dt);
	end	
end

function LSStateMachine:pushByName(NAME) 
	local state = createStateByName(NAME)
	if state then 
		self:push(state);
		self.ROOT_VIEW:addChild(state.VIEW)
		state.VIEW:setZOrder(state.INDEX)
	end
end

function LSStateMachine:push(STATE) 
	if STATE then 
		local curState = self.stack[#self.stack];
		if curState then 
			curState.leaveTop()
		end
		self.stack[#self.stack+1] = STATE;
		STATE.enter();
	end
end

function LSStateMachine:top() 
	return self.stack[#self.stack];
end
function LSStateMachine:topType() 
	local state =  self.stack[#self.stack];
	if state then return state.INDEX end;
	return nil;
end

function LSStateMachine:pop() 
	local state =  self.stack[#self.stack];
	if state then 
		state.exit()
		state.VIEW:removeFromParent();
		state = nil;
		table.remove(self.stack, #self.stack)
	end
	state =  self.stack[#self.stack];
	if state then 
		state.becomeTop()
	end
end

function LSStateMachine:popTo(NAME)
	local intValue = GEnum[NAME]
	if not intValue then 
		LSLog("LSStateMachine:popTo:","无效的状态名称:",NAME)
		return 
	end;
	for i = #self.stack,1,-1 do
		local curType = self:topType();
		if curType and curType ~= intValue then
			self:pop();
		end
	end
end

function LSStateMachine:popAll()
	for i = #self.stack,1,-1 do
		local state = self.stack[i];
		state.exit()
		state.VIEW:removeFromParent();
		state = nil;
		table.remove(self.stack, i)
	end
end

function LSStateMachine:isHave(NAME)
	for i,v in ipairs(self.stack) do
		if  GEnum[NAME] == v.INDEX then
			return true;
		end
	end
	return false;
end

return LSStateMachine;
