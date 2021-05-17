var util = require("../../utils/util.js");
Page({
  data: {
    aptoticAddTimeHidden:true,
    date:new Date().Format("yyyy-MM-dd hh:mm"),
    date1:new Date().Format("yyyy-MM-dd")
  },
  onLoad: function () {
    var that = this;
    var latitude;
    var longitude;
    var place;
    //获取地理位置
    wx.getLocation({
        success:function (res) {  
          latitude = res.latitude;
          longitude = res.longitude;
          that.setData({latitude:latitude});
          that.setData({longitude:longitude});
          var key = 'RFHBZ-QOSRI-NIDGO-5ZWX4-5HSS7-YDFMT';
          wx.request({
            url:'http://apis.map.qq.com/ws/geocoder/v1/',
            data:{
               location:latitude+","+longitude,
               key:key
            },
            success:function(res) {
              place = res.data.result.address;
              that.setData({address:place+'('+latitude+","+longitude+')'});
              that.setData({place:place});
            }
          })
        }
    });
    //获取常用地点
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetCheckPlaceListByMember.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    //url = url + "?OpenID="+OpenID+"&Token="+Token
    console.log(url);
    wx.request({
        url: url,
        data: {
            OpenID: OpenID,
            Token: Token
        },
        success: function(res) {
          console.log(res.data);
          var array = new Array();
          var objectArray = new Array();
          res.data.ReturnData.forEach(function(obj,index){
            array[index] = obj.CheckPlace;
            objectArray[index] = {id:obj.CheckPlaceID,
                name:obj.CheckPlace};
          });
          that.setData({
             array:array,
             objectArray:objectArray,
             index: '0',
          });

        }
    });

    getAptoticLog(OpenID,Token,that);
  },
  bindPickerChange: function(e) {
      this.setData({
          index: e.detail.value
      })
  },
  reserveSubmit:function () { 
    var that = this;
    that.setData({aptoticAddTimeHidden:!that.data.aptoticAddTimeHidden}) 
    var checkPlaceID = this.data.objectArray[this.data.index].id;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_AddTimeRecords.ashx";
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    wx.request({
        url: url,
        data: {
            Token:Token,
            OpenID:OpenID,
            CheckPlaceID:checkPlaceID,
            GPS_X_Tencent:this.data.latitude,
            GPS_Y_Tencent:this.data.longitude,
            GPSAddress_Tencent:this.data.place,
            RecordsType:'1'
        },
        success: function(res) {
          that.setData({aptoticAddTimeHidden:!that.data.aptoticAddTimeHidden}) 
          console.log(res.data);
          if(res.data.Result == '0'){
            wx.showModal({
              content:res.data.ReturnMsg,
              title: '提示'
            })
          }else{
            wx.showModal({
              content:res.data.ReturnMsg,
              title: '提示',
              success: function(res) {
                if (res.confirm) {
                  wx.redirectTo({
                      url:'../index/index'
                  });
                } 
              }
            })
          }
        }
    });
  }

});

//迁到记录
function getAptoticLog(OpenID,Token,that){
  var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_GetMemberTimeRecordsList.ashx";
  wx.request({
        url: url,
        data: {
            Token:Token,
            OpenID:OpenID,
            Signtime:new Date().Format("yyyy-MM-dd")
        },
        success: function(res) {
          var list = new Array();
          console.log(res.data);
          res.data.ReturnData.forEach(function(obj, index) {
              list[index] = {
                code:obj.RecordsTypeShow,
                text:obj.GPSAddress_Tencent,
                type: new Date((obj.Signtime).replace("T"," ")).Format("hh:mm")  
              }
          });
          that.setData({listData:list})
        }
    });
}
