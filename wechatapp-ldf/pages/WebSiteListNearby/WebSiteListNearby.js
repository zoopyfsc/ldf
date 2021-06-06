var util = require("../../utils/util.js");
var app = getApp()
Page({
//顶部tab选项卡，别为我为什么这么乱，因为我是抄来了
  data: {
    loaddingHidden:true,
      mapHidden:false,
      info:'类型：所有  网点：不限  销售额：不限  距离：5KM'
  },
  gotoHere_:function(e){
    var ds = e.currentTarget.dataset;
     wx.openLocation({
      latitude: ds.latitude,
      longitude: ds.longitude,
      scale: 28
    })
  },
  //巡查
  outlestDetail:function(e){
    var WebSiteID = e.currentTarget.dataset.websiteid;
    wx.navigateTo({
      url:'../outlest_details/outlest_details?websiteid='+WebSiteID
    })
  },
  setType:function(e){
    var dataset = e.currentTarget.dataset;
    this.setData({typeindex:dataset.typeindex});
    this.setData({typeid:dataset.typeid});
    getWebSites(this);
  },
  setSort:function(e){
    var dataset = e.currentTarget.dataset;
    this.setData({sortindex:dataset.sortindex});
    this.setData({sortid:dataset.sortid});
    getWebSites(this);
  },
  setSale:function(e){
    var dataset = e.currentTarget.dataset;
    this.setData({saleindex:dataset.saleindex});
    this.setData({saleid:dataset.saleid});
    getWebSites(this);
  },
  setLen:function(e){ 
    var dataset = e.currentTarget.dataset;
    this.setData({lenindex:dataset.lenindex});
    this.setData({lenid:dataset.lenid});
    getWebSites(this);
  },
  onLoad: function () {
    var that = this; 

    this.fetchFilterData();
    //load data
    
    that.setData({typeid:"0"})
    util.locationCallback(getWebSites,that);

  },
  competitorDetail:function(e){
    var websiteid = e.currentTarget.dataset.websiteid;
      wx.navigateTo({
        url:'../competitor_submit/competitor_submit?websiteid='+websiteid
      })
  },
  fetchFilterData: function () { //获取筛选条件
    this.setData({
      filterdata: {
        "sort": [
          {"id": 0, "title":"不限"},
          {"id": 1, "title": "店招"},
          {"id": 2, "title": "展柜"},
          {"id": 3, "title": "I类"},
        ],
        "type": [
          {"id": 0,"title": "全部"},
          {"id": 1,"title": "公司"},
          {"id": 2,"title": "对手"},
        ],
        "sale": [
          {"id": 0,"title": "不限"},
          {"id": 1,"title": "0-1万"},
          {"id": 2,"title": "1-5万"},
          {"id": 3,"title": "5万+"},
        ],
        "len": [
          {"id": 1,"title": "5KM以内"},
          {"id": 2,"title": "10KM以内"},
        ],
      }
    })
  },
  setFilterPanel: function (e) { //展开筛选面板
    
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
    if(this.data.showfilter)
      this.setData({mapHidden:true})
    else
      this.setData({mapHidden:false})
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null,
      mapHidden:false
    })
  },
})

function getWebSites(that){
    that.setData({loaddingHidden:!that.data.loaddingHidden})
  var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetWebSiteListNearby.ashx?1=1";
  var info = ""
  if(that.data.typeid!=null){
      url = url + "&WebSiteType="+that.data.typeid;
      info = "类型:"+that.data.filterdata.type[that.data.typeid].title;
  }
  if(that.data.sortid!=null){
      url = url + "&WebSiteADOther="+that.data.sortid;
      info = info +"  网点:"+ that.data.filterdata.sort[that.data.sortid].title;
  }
  if(that.data.saleid!=null){
      url = url + "&SalesMoneyRange="+that.data.saleid;
      info = info +"  销售额:"+ that.data.filterdata.sale[that.data.saleid].title;
  }
  if(that.data.lenid!=null){
      url = url + "&Range="+that.data.lenid;
      info = info +"  距离:"+ that.data.filterdata.len[that.data.lenid-1].title;
  }
  that.setData({info:info})
  console.log(info)
  wx.request({
        url: url,
        data: {
            Token:wx.getStorageSync("Token"),
            OpenID:wx.getStorageSync("OpenID"),
            GPS_X_Tencent:that.data.place.latitude,
            GPS_Y_Tencent:that.data.place.longitude,
            GPSAddress_Tencent:that.data.place.place
        },
        success: function(res) {//zuobiaofill.png
          console.log(res.data)
          that.setData({loaddingHidden:!that.data.loaddingHidden}) 
          var list = new Array();
          var markers = new Array();
          res.data.ReturnData.forEach(function(obj, index) {
              list[index] = {
                WebSiteID:obj.WebSiteID,
                websiteName:obj.WebSiteName,
                marketName:obj.MarketName,
                place: obj.Address,
                type:obj.WebSiteType,
                GPS_X_Tencent:obj.GPS_X_Tencent,
                GPS_Y_Tencent:obj.GPS_Y_Tencent
              }
              if(obj.WebSiteType == 1){
                markers[index] = {
                  iconPath: "../../images/zuobiaofill.png",
                  latitude: obj.GPS_X_Tencent,
                  longitude: obj.GPS_Y_Tencent,
                }
             }else{
               markers[index] = {
                  iconPath: "../../images/zuobiaofill_.png",
                  latitude: obj.GPS_X_Tencent,
                  longitude: obj.GPS_Y_Tencent,
                }
             }
              
          });
          that.setData({list:list});
          that.setData({markers:markers});
        }
    });
}