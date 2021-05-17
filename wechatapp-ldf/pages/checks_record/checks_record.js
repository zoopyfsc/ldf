var util = require("../../utils/util.js");
Page({
  data: {
    loaddingHidden:true,
  },
  onLoad: function (options) {
      var that = this;
      that.setData({webSiteId:options.websiteid});
      getCheckRecords(that);
  },
  deleteRecord:function(e){
    var that = this;
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var recordid = e.currentTarget.dataset.recordid;
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_LoopDelete.ashx?1=1";
    wx.request({
        url:url,
        data:{
          Token:Token,
          OpenID:OpenID,
          ID:recordid,
        },
        success:function(res){
          that.setData({loaddingHidden:!that.data.loaddingHidden}) 
            wx.showModal({content:res.data.ReturnMsg});
            getCheckRecords(that);
        }
    });
  },
  viewDetailInfo:function(e){
    console.log(e)
    var recordid = e.currentTarget.dataset.recordid;
    wx.navigateTo({
      url:'../checks_record_details/checks_record_details?recordid='+recordid
    })
  }
})

function getCheckRecords(that){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_Loop_GetLoopList.ashx?1=1";
    wx.request({
        url:url,
        data:{
          Token:Token,
          OpenID:OpenID,
          WebSiteID:webSiteId,
        },
        success:function(res){
          console.log(res);
          var records = new Array();
          res.data.ReturnData.forEach(function(obj,index){
              records[index] = {
                SignInDatetime:new Date(obj.SignInDatetime).Format("yyyy-MM-dd"),
                Createby:obj.Createby,
                WebSiteName:obj.WebSiteName,
                ID:obj.ID,
                WebSiteID:obj.WebSiteID,
                SignOutStatus_Show:obj.SignOutStatus_Show
              } 
          });
          that.setData({records:records})
        }
    });
}