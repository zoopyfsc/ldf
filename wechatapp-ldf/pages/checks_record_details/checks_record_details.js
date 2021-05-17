//index.js
//获取应用实例
var util = require("../../utils/util.js");
var app = getApp()
Page( {
  data: {
    isShow: true,
    currentTab: 0,
  },
   
    swichNav: function (e) {
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else { 
            var showMode = e.target.dataset.current == 0;
            this.setData({
                currentTab: e.target.dataset.current,
                isShow: showMode
            })
        }
    },
    onLoad:function (options) {  
        var that = this;
        var recordid = options.recordid;
        var OpenID = wx.getStorageSync("OpenID");
        var Token = wx.getStorageSync("Token");
        var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_Loop_GetLoopDetail.ashx?1=1";
        wx.request({
            url:url,
            data:{
                Token:Token,
                OpenID:OpenID,
                ID:recordid,
            },
            success:function(res){
                var detail = res.data.ReturnData;
                console.log(detail)
                var webSite = {
                    SignInDatetime:new Date(detail.SignInDatetime).Format("yyyy-MM-dd HH:mm"),
                    SignOutDatetime:new Date(detail.SignOutDatetime).Format("yyyy-MM-dd HH:mm"),
                    WebSiteName:detail.WebSiteName,
                    Createby:detail.Createby,
                    Createon:new Date(detail.Createon).Format("yyyy-MM-dd")
                }
                that.setData({webSite:webSite,detail:detail});
            }
        });
  }
})