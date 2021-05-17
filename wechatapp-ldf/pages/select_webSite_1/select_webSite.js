//index.js
var city = require("../../utils/city.js");

Page({
  data: {
      province:['-二级地区-'],
      city: ['-三级地区-'],
      district: ['-四级地区-'],
      provinceIndex: 0,
      cityIndex: 0,
      districtIndex: 0,
      websitename:'',
      websiteid:''
  },
  onLoad: function () {
    var that = this;
    city.getcity(that,'','')
    city.init(that); 
  },
  bindMarketChange:function(e){
    this.setData({
      market:e.detail.value
    })
  },
  bindWebSiteChange:function(e){
    this.setData({
      webSite:e.detail.value
    })
  },
  applySubmit:function(){
      getWebSite(this);
  },
  bindWebSiteSelect:function(e){
      var websiteid = e.currentTarget.dataset.websiteid;
      var websitename = e.currentTarget.dataset.websitename;
      wx.redirectTo({
        url:'../OutAddTimeRecord/OutAddTimeRecord?websiteid='+websiteid+'&websitename='+websitename
      })
  }
});

function getWebSite(that){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetWebSiteList.ashx?1=1";
    if(that.data.provinceIndex!=0){
      url = url + "&TerritoryCode2="+that.data.province_[that.data.provinceIndex].code;
    }
    if(that.data.cityIndex!=0){
      url = url + "&TerritoryCode3="+that.data.city_[that.data.cityIndex].code;
    }
    if(that.data.districtIndex!=0){
      url = url + "&TerritoryCode4="+that.data.district_[that.data.districtIndex].code;
    }
    if(that.data.market){
      url = url + "&MarketName="+that.data.market;
    }
    if(that.data.webSite){
        url = url + "&WebSiteName="+that.data.webSite;
    }
    console.log(url)

    wx.request({
      url: url,
      data:{
        Token:Token,
        OpenID:OpenID
      }, 
      success:function(res){
          var list = new Array();
          res.data.ReturnData.forEach(function(obj,index){
            list[index] = {
              MarketName:obj.MarketName,
              Address:obj.Address,
              WebSiteName:obj.WebSiteName,
              WebSiteID:obj.WebSiteID
            }
          });
          that.setData({list:list})
      }
    });
}
