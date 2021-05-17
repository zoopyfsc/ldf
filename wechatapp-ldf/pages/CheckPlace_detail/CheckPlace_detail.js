var util = require("../../utils/util.js");
Page({
  data: {
    loaddingHidden:true,
  },
  onLoad: function (options) {
      var checkPlaceID = options.checkPlaceID;
      var that = this;
      that.setData({checkPlaceID:checkPlaceID});
      getWebSiteDetail(that);
      util.getLocation(that);
  },
  submitBindPlace:function (){
    var that = this;
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_CheckPlace_Positon.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");

  //获取常用地点
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token,
            CheckPlaceID:that.data.checkPlaceID,
            GPS_X_Tencent:that.data.place.latitude,
            GPS_Y_Tencent:that.data.place.longitude,
            GPSAddress_Tencent:that.data.place.place
        },
        success: function(res) {
            that.setData({loaddingHidden:!that.data.loaddingHidden}) 
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
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetCheckPlaceDetail.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var checkPlaceID = that.data.checkPlaceID;
    url = url + "?OpenID="+OpenID+"&Token="+Token+"&checkPlaceID="+checkPlaceID
    console.log(url);
  //获取常用地点
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token,
            checkPlaceID:checkPlaceID
        },
        success: function(res) {
            that.setData({detail:res.data.ReturnData});
        }
    });
}

