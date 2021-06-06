var util = require("../../js/util.js");
Page({
  task_add: function() {
    wx.redirectTo({
      url: '../WebSiteLoop_Task/WebSiteLoop_Task'
    })
  },

  task_lists: function () {
    wx.redirectTo({
      url: '../TaskList/TaskList'
    })
  },

  details: function(e) {
    wx.redirectTo({
      url: '../task_details/task_details?taskId='+e.currentTarget.dataset.name
    })
  },
  onLoad:function(){
      getTasks(this);
  }
}); 
function getTasks(that){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetTaskList.ashx";
    wx.request({
      url: url,
      data:{
        Token:Token,
        OpenID:OpenID
      }, 
      success:function(res){
          console.log(res.data);
          var list = new Array();
          res.data.ReturnData.forEach(function(obj,index){
            list[index] = {
              DetailID:obj.DetailID,
              TaskExecutorDate:obj.TaskExecutorDate,
              WebSiteName:obj.WebSiteName,
              TaskExecutorAccoutName:obj.TaskExecutorAccoutName,
              TaskTitle:obj.TaskTitle,
              TaskID:obj.TaskID,
              ExecutorStatus:obj.TaskExecutorStatus,
              Num:obj.TaskDetailBOList.length
            }
          });
          that.setData({list:list})
      }
    });
}