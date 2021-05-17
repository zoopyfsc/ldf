Page({
  data: {
    
  },
  onLoad: function (options) {
    var that = this;
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var taskId = options.taskId;
    that.setData({taskId:taskId});
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetTaskDetail.ashx";
    wx.request({
      url: url,
      data:{
        Token:Token,
        OpenID:OpenID,
        TaskID:taskId
      }, 
      success:function(res){
        console.log(res)
          var data = res.data.ReturnData.TaskDetailBOList;
          var polyline_ = new Array();
          var markers = new Array();
          var tasks = new Array();
          data.forEach(function(obj,index){
              markers[index] = {
                  iconPath: "../../images/zuobiaofill.png",
                  latitude: obj.GPS_X_Tencent,
                  longitude: obj.GPS_Y_Tencent,
              };
              polyline_[index] = {
                latitude:obj.GPS_X_Tencent,
                longitude:obj.GPS_Y_Tencent
              }; 
              tasks[index] = {
                ExecutorStatus_Show:obj.ExecutorStatus_Show,
                WebSiteName:obj.WebSiteName,
                ExecutorStatus:res.data.ReturnData.TaskExecutorStatus
              }
              that.setData({latitude:obj.GPS_X_Tencent})
              that.setData({longitude:obj.GPS_Y_Tencent})
          });
          var polyline = [{
            points: polyline_,
            color: "#FF0000",
            width: 3,
            dottedLine: true
          }]
          that.setData({polyline:polyline})
          that.setData({tasks:tasks})
          that.setData({markers:markers})
      }
    });
  },
  deleteTask:function(e){
    var taskId = e.currentTarget.dataset.task;
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_DeleteTask.ashx";
      wx.request({
        url: url,
        data:{
          Token:Token,
          OpenID:OpenID,
          TaskID:taskId
        }, 
        success:function(res){
            if(res.data.Result == '1'){
              wx.showModal({
                content:res.data.ReturnMsg,
                title: '提示',
                success:function (res1) { 
                    if (res1.confirm) {
                      wx.redirectTo({
                          url:`../TaskList/TaskList`,
                          complete:function (res2) {  
                            console.log(res2)
                          }
                      });
                    } 
                }
              });
            }
        }
      });
  }

})