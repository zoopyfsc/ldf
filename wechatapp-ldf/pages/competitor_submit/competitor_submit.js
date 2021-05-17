var util = require("../../utils/util.js");
Page({
  data: {
    
  },
  onLoad: function (options) {
      var websiteid = options.websiteid;
      var that = this;
      that.setData({websiteid:websiteid});
      getWebSiteDetail(that);
      util.getLocation(that);
  },
  submitBindPlace:function (){
    var that = this;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSiteCompetitor_Modify.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");

  //获取常用地点
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token,
            WebSiteID:that.data.websiteid,
            GPS_X_Tencent:that.data.place.latitude,
            GPS_Y_Tencent:that.data.place.longitude,
            GPSAddress_Tencent:that.data.place.place
        },
        success: function(res) {
          console.log(res);
            wx.showModal({
              content:res.data.ReturnMsg,
              title: '提示'
            });  
        }
    });
}

});

function getWebSiteDetail(that){
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetCompetitorWebSiteDetail.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");

  //获取常用地点
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token,
            WebSiteID:that.data.websiteid
        },
        success: function(res) {
            console.log(res)
           that.setData({website:res.data.ReturnData})
        }
    });
}

