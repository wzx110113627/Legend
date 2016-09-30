require("app/Tools/GEnum")
require("app/Tools/LSLog")
require("app/LSStateMachine/LSStateMachine")
require("app/LSManager/LSNetManager")

MainScene = class("MainScene", function()
    return display.newScene("MainScene")
end)

function MainScene:ctor()
	LSLog("MainScene:ctor():","进入场景")
    LSStateMachine.ROOT_VIEW = self;
	LSStateMachine:pushByName("GAME_STATE_SERVER_LIST")
   
   LSNetManager:connectServerList();

    -- -- ui.newTTFLabel({text = "Hello, World", size = 64, align = ui.TEXT_ALIGN_CENTER})
    -- --     :pos(display.cx, display.cy)
    -- --     :addTo(self)
    -- local  node  = CCBuilderReaderLoad("MainScene.ccbi",CCBProxy:create(),self)
    -- node:addTo(self)

    -- local serverListSocket = createConnectUnit("10.2.40.195",48562)
    -- serverListSocket:connect()

end

function MainScene:onEnter()
end

function MainScene:onExit()

end

return MainScene
