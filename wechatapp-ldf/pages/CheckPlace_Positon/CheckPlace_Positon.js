Page({
  data: {
    loaddingHidden:true,
  },
  onLoad: function () {
    var that = this;
    //获取考勤定点信息
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetCheckPlaceList.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token
        },
        success: function(res) {
          console.log(res.data)
          var list = new Array();
          res.data.ReturnData.forEach(function(obj, index) {
              list[index] = {
                  ID:obj.CheckPlaceID,
                  place:obj.CheckPlace
              }
          });
          that.setData({list:list});
        }
    });
  },
  bindPlace:function(e) {
     var checkPlaceID = e.target.dataset.id;
     wx.navigateTo({
       url:'../CheckPlace_detail/CheckPlace_detail?checkPlaceID='+checkPlaceID
     })
  },
  //search
  search:function(e){
      var that = this;
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    //获取考勤定点信息
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetCheckPlaceList.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token,
            CheckPlace:that.data.key
        },
        success: function(res) {
          that.setData({loaddingHidden:!that.data.loaddingHidden}) 
          console.log(res.data)
          var list = new Array();
          res.data.ReturnData.forEach(function(obj, index) {
              list[index] = {
                  ID:obj.CheckPlaceID,
                  place:obj.CheckPlace
              }
          });
          that.setData({list:list});
        }
    });
  },
  bindKeyChange:function(e){
    this.setData({
      key: e.detail.value
    });
  }

});