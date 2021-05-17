var util = require("../../utils/util.js");
Page({
  data: {
    loaddingHidden:true,
    date:new Date().Format("yyyy-MM-dd"),
    index:0,
    websitenum:'默认该用户绑定的定点位置，可选择'
  },
  task_add: function () {
    wx.navigateTo({
      url: '../task_add/task_add'
    })
  },

  task_lists: function () {
    wx.navigateTo({
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
  onLoad:function(options){
    var that = this;
    that.setData({loaddingHidden:!that.data.loaddingHidden})
    var websiteid = options.websiteid;
    if(websiteid){
      websiteid = websiteid.substring(1);
      var websiteids = websiteid.split(",");
      that.setData({websitenum:websiteids.length+"个"})
      that.setData({websiteid:websiteid})
    }
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetAccountList.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    wx.request({
        url:url,
        data:{
          OpenID:OpenID,
          Token,Token
        },
        success:function(res){
          that.setData({loaddingHidden:!that.data.loaddingHidden})
          console.log(res)
          var list = new Array();
          var list1 = new Array();
          res.data.ReturnData.forEach(function(obj, index) {
              list[index] = {
                MemberID:obj.MemberID,
                MemberNo:obj.Accout,
                Name: obj.AccoutName  
              }
              list1[index] = obj.AccoutName;
          });
          console.log(list1)
          that.setData({list:list,list1:list1})
        }
    })
  },
  bindPickerChange:function(e){//选人员
    this.setData({index:e.detail.value})
  },
  bindTitleChnage:function(e){
    this.setData({title:e.detail.value});
  },
  bindMsgChange:function(e){  
    this.setData({msg:e.detail.value});
  },
  reserveSubmit:function(){
    var that = this;
    that.setData({loaddingHidden:!that.data.loaddingHidden})
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var TaskTitle = this.data.title;
    var TaskExecutorAccout = this.data.list[this.data.index].MemberNo;
    var TaskExecutorDate = this.data.date;
    var WebSiteIDList = this.data.websiteid;
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
          that.setData({loaddingHidden:!that.data.loaddingHidden})
          console.log(res.data)
          if(res.data.Result == '1'){
            wx.showModal({
              content:res.data.ReturnMsg
            })
          }
        }
    });
  }
})