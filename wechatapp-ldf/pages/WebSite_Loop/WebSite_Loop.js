//index.js
var city = require("../../utils/city.js");

Page({
  data: {
      loaddingHidden:true,
      province:['-二级地区-'],
      city: ['-三级地区-'],
      district: ['-四级地区-'],
      provinceIndex: 0,
      cityIndex: 0,
      districtIndex: 0
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
    console.log(this);
      getWebSite(this);
  },
  viewWebSiteDetail:function(e){
    var WebSiteID = e.currentTarget.dataset.websiteid;
    wx.navigateTo({
      url:'../outlest_details/outlest_details?websiteid='+WebSiteID
    })
  }
});

function getWebSite(that){
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
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
    
    wx.request({
      url: url,
      data:{
        Token:Token,
        OpenID:OpenID
      }, 
      success:function(res){
        that.setData({loaddingHidden:!that.data.loaddingHidden})
          var list = new Array();
          res.data.ReturnData.forEach(function(obj,index){
            list[index] = {
              WebSiteID:obj.WebSiteID,
              MarketName:obj.MarketName,
              Address:obj.Address,
              WebSiteName:obj.WebSiteName
            }
          });
          that.setData({list:list})
      }
    });
}