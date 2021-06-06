var util = require("../../utils/util.js");
Page({
  data: {
    loaddingHidden:true,
    date:new Date().Format("yyyy-MM-dd hh:mm"),
    date1:new Date().Format("yyyy-MM-dd"),
    imagesUrl:[],
    website:'请单击选择网点'
  },
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var websiteid = options.websiteid;
    if(websiteid){
       that.setData({website:options.websitename})
       that.setData({websiteid:options.websiteid})
    }

    
    util.getLocation(that);
    
    getAptoticLog(that);
  },
  bindReasonChange: function(e) {
      this.setData({
          reason: e.detail.value
      })
  },
  selectWebSite:function(e){
      wx.redirectTo({
        url:'../select_webSite_1/select_webSite'
      })
  },
  bindChooseImage:function(){
    var that = this;
      wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imagesUrl = new Array();
        for(var i=0;i<tempFilePaths.length;i++){
          imagesUrl[i] = {
            type:0,
            path:tempFilePaths[i]
          }
        }
        that.setData({imagesUrl:that.data.imagesUrl.concat(imagesUrl)})
      }
    })
  },
  reserveSubmit:function(){
    var that = this;
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_HR_AddTimeRecords.ashx";
    wx.request({
      url: url,
      //filePath: this.data.imageUrl,
      //name: 'UploadFiles',
      data:{
        Token:Token,
        OpenID:OpenID,
        GPS_X_Tencent:this.data.latitude,
        GPS_Y_Tencent:this.data.longitude,
        GPSAddress_Tencent:this.data.place.place,
        RecordsType:'2',
        WebSiteID:this.data.websiteid,
        OutWorkReason:this.data.reason
      },
      success: function(res){
       that.setData({loaddingHidden:!that.data.loaddingHidden}) 
        console.log(res)
        if(res.data.Result == '1'){
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
          }else{
            wx.showModal({
              content:res.data.ReturnMsg,
            title: '提示'});
          }
      }
    })
  }
})


//迁到记录
function getAptoticLog(that){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
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
                type: obj.Signtime.substr(11,5) 
              }
          }); 
          that.setData({listData:list})
          console.log(list)
        }
    });
}