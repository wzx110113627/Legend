/*
*   租用:工具函数
* */

function LSHelper()
{//为数组添加2个方法
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
            return true;
        }
        return false;
    };
}
LSHelper();