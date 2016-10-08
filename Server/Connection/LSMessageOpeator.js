/*
	作用：负责消息的解析与反解析，并且分发给对应的对象制定的函数去处理
*/
var LSLog = require("../public/LSCommondHandle").LSLog;


function LSMessage(ID,CALLBACK)
{
	this.messageID = ID;
	this.messageHandle = CALLBACK;

	this.callFunc = function(TARGET,PARAM)
	{
		this.messageHandle(TARGET,PARAM)
	}
}

exports.LSMessageOpeator = function()
{
	var self = this;
	var seprater = String.fromCharCode(1);
	this.messageStack = {};
	this.buff = ""
	this.setTarget = function(TARGET)
	{
		self.serverTarget = TARGET;
	}
	this.regisit = function(ID,CALLBACK)
	{
		if(ID && CALLBACK)
		{
			var handle = new LSMessage(ID,CALLBACK)
			this.messageStack[ID] = handle;
		}else{
			LSLog("注册回调失败，错误的id 或 callback:"+ID+" "+CALLBACK)
		}
	}
	this.clean = function(){
		this.buff = "";
	}
	this.onData = function(Data)
	{
		if(Data && Data != "undefined")
		self.buff = self.buff + Data;
		self.analysis();
	}
	this.analysis = function()
	{
		var messageArr = self.buff.split(seprater);
		var lastChar = self.buff.charAt(self.buff.length-1);
		if(lastChar != seprater)
		{
			self.buff = messageArr.pop();
		}else{
			self.buff = ""
		}
		for (var i = 0; i < messageArr.length; i++) {
			var message = messageArr[i];
			self.distributeMessage(message);
		};
	}
	this.distributeMessage = function(MESSAGE)
	{
		var msgObj = null;
		if(MESSAGE)
		{	
			try{
				msgObj = JSON.parse(MESSAGE)
			}catch(e){
				msgObj = null;
				LSLog("错误的字符串，无法转成json对象:"+MESSAGE)
			}
			 
			if(msgObj && msgObj.MSG)
			{
				var handle = self.messageStack[msgObj.MSG] 
				if(handle)
				{
					handle.callFunc(self.serverTarget,msgObj)
				}else{
					LSLog("distributeMessage:该函数无回调函数"+msgObj.MSG);
				}
			}else{
				LSLog("distributeMessage:错误的消息体"+MESSAGE);
			}
		}
	}

}