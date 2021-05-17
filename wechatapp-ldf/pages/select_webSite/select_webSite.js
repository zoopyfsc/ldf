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
  bindWebSiteLbs:function(e){
      var websiteid = e.currentTarget.dataset.websiteid;
      var websitename = e.currentTarget.dataset.websitename;
      selectedWebSites(websiteid,websitename,this);
  },
  confirmSelect:function(){
    wx.redirectTo({
      url:'../WebSiteLoop_Task/WebSiteLoop_Task?websiteid='+this.data.websiteid
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
    console.log(url)

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
              MarketName:obj.MarketName,
              Address:obj.Address,
              WebSiteName:obj.WebSiteName,
              WebSiteID:obj.WebSiteID,
              selected:0
            }
          });
          that.setData({list:list})
      }
    });
}

function selectedWebSites(websiteid,websitename,that){
  var list = new Array();
  var websiteid_ = "";
  var websitename_= "";
  that.data.list.forEach(function(obj,index){
    if(obj.selected == 1){
      if(obj.WebSiteName == websitename){
        list[index] = {
            MarketName:obj.MarketName,
            Address:obj.Address,
            WebSiteName:obj.WebSiteName,
            WebSiteID:obj.WebSiteID,
            selected:0
          }
      }else{
        list[index] = {
            MarketName:obj.MarketName,
            Address:obj.Address,
            WebSiteName:obj.WebSiteName,
            WebSiteID:obj.WebSiteID,
            selected:1
          }
         websiteid_ = websiteid_+ "," + obj.WebSiteID;
         websitename_ = websitename_+ "," + obj.WebSiteName;
      }
        
    }else{
      if(obj.WebSiteName == websitename){
        list[index] = {
              MarketName:obj.MarketName,
              Address:obj.Address,
              WebSiteName:obj.WebSiteName,
              WebSiteID:obj.WebSiteID,
              selected:1
            }
            websiteid_ = websiteid_+ "," + obj.WebSiteID;
          websitename_ = websitename_+ "," + obj.WebSiteName;
      }else{
        list[index] = {
              MarketName:obj.MarketName,
              Address:obj.Address,
              WebSiteName:obj.WebSiteName,
              WebSiteID:obj.WebSiteID,
              selected:0
            }
      }
    }
  });
  that.setData({list:list});
  that.setData({websiteid:websiteid_});
  that.setData({websitename:websitename_});
}
