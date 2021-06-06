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
      IsNeedPage: 1,
      PageSize: 10,
      CurrentPageNum: 1,
      list:[]
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
  bindWebSiteLbs:function(e){
      var websiteid = e.currentTarget.dataset.websiteid;
      wx.navigateTo({
        url:'../outlets_summit/outlets_summit?websiteid='+websiteid
      })
  },
  loadMore:function(){
    this.setData({CurrentPageNum:this.data.CurrentPageNum+1});
    getWebSite(this);
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
   
    //分页参数
    url = url + "&IsNeedPage=1&PageSize=10&CurrentPageNum="+that.data.CurrentPageNum;
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
        that.setData({ list: that.data.list.concat(list) });
      }
    });
}
