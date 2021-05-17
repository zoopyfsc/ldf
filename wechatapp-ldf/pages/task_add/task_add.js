var util = require("../../js/util.js");
Page({
  data: {
    date:new Date().Format("yyyy-MM-dd"),
    index:0
  },
  task_add: function () {
    wx.redirectTo({
      url: '../task_add/task_add'
    })
  },

  task_lists: function () {
    wx.redirectTo({
      url: '../TaskList/TaskList'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  selectWebSite:function(e){
      wx.navigateTo({
        url:'../select_webSite/select_webSite'
      })
  },
  onLoad:function(){
    var that = this;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetMemberList.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    wx.request({
        url:url,
        data:{
          OpenID:OpenID,
          Token,Token
        },
        success:function(res){
          console.log(res)
          var list = new Array();
          var list1 = new Array();
          res.data.ReturnData.forEach(function(obj, index) {
              list[index] = {
                MemberID:obj.MemberID,
                MemberNo:obj.MemberNo,
                Name: obj.Name  
              }
              list1[index] = obj.Name;
          });
          console.log(list1)
          that.setData({list:list,list1:list1})
        }
    })
  },
  bindPickerChange:function(e){
    console.log(e);
  },
  bindTitleChnage:function(e){
    this.setData({title:e.detail.value});
  },
  bindMsgChange:function(e){  
    this.setData({msg:e.detail.value});
  },
  reserveSubmit:function(){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var TaskTitle = this.data.title;
    var TaskExecutorAccout = this.data.list[this.data.index].MemberNo;
    var TaskExecutorDate = this.data.date;
    var WebSiteIDList = '11009';
    var Note = this.data.msg;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_AddTask.ashx";
    wx.request({
        url:url,
        data:{
          Token:Token,
          OpenID:OpenID,
          TaskTitle:TaskTitle,
          TaskExecutorAccout:TaskExecutorAccout,
          TaskExecutorDate:TaskExecutorDate,
          WebSiteIDList:WebSiteIDList,
          Note:Note
        },
        success:function(res){
          if(res.data.Result == '1'){
            wx.showModal({
              content:res.data.ReturnMsg
            })
          }
        }
    });
  }
})