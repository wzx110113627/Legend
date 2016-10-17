/*
*   作用:服务器的事件队列
* */

require("../public/LSHelper");

module.exports = LSEventQueue;

var LSEVENT_TYPE = {}
module.exports.LSEVENT_TYPE = LSEVENT_TYPE;//事件类型
LSEVENT_TYPE.LOGIN_SERVER_EVENT = 1;//角色连接新服务器的事件
LSEVENT_TYPE.CREATE_SERVER_EVENT = 2;//创建服务器
var LSEvent = function (TYPE) { //事件对象
    this.type = TYPE;
    this.setUserInfo = function (INFO) {
        this.userInfo = INFO;
    }
}
module.exports.LSEvent = LSEvent;

function LSEventQueue()
{
    var self = this;
    function init(){
        self.events = new Array()
    }
    this.addEvents = function (Event) {
        if(Event)
        {
            self.events.push(Event)
        }
    }
    this.getLoginEvents = function (ServerID) {
        var arr = new Array()
        for(var i = self.events.length - 1 ; i>=0 ;i--)
        {
            var event = self.events[i];
            if(event.type == LSEVENT_TYPE.LOGIN_SERVER_EVENT && event.userInfo && event.userInfo.serverID == ServerID)
            {
                arr.push(event);
                self.events.slice(i,1);
            }
        }
        return arr;
    }
    this.removeEvents = function (ARRAY) {
        if(ARRAY)
        {
            for(var i = ARRAY.length - 1 ; i>=0 ;i--)
            {
                self.events.remove(ARRAY[i])
            }
        }
    }

    this.removeEvent = function (Event) {
        if(Event)
        {
            self.events.remove(Event)
        }
    }
    this.getCreateServerEvent = function(serverID)
    {
        for(var i = self.events.length - 1 ; i>=0 ;i--)
        {
            var event = self.events[i];
            if(event.type == LSEVENT_TYPE.CREATE_SERVER_EVENT && event.userInfo ==serverID )
            {
                return event;
            }
        }
        return null;
    }
    init();
};


