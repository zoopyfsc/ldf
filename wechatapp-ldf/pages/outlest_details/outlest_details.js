var util = require("../../utils/util.js");
Page({
  data: {
    loaddingHidden:true,
    imagesUrl:[],
    videosUrl:[]
  },
  onLoad: function (options) {
      var that = this;
      that.setData({webSiteId:options.websiteid});
      viewWebSiteInfo(that);
      viewSignInfo(that);
      util.getLocation(that);
  },
  signIn:function(e){
    var that = this;
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    signIn_(that); //先定位再签到
  },
  signOut:function(e){
    var that = this;
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    signOut_(that);
  },
    bindChooseImage:function(){
    var that = this;
      wx.chooseImage({
      count: 5, // 默认9
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
  uploadPhoto:function(e){
    var that = this;
    uploadSignPics(that);
  },
    bindChooseVedio:function(){
    var that = this;
      wx.chooseVideo({
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePath;
        var video = new Array();
          video[0] = {
            type:0,
            path:tempFilePath
          }
        that.setData({videosUrl:that.data.videosUrl.concat(video)})
      }
    })
  },
  uploadVideo:function(e){
    var that = this;
    uploadSignVideos(that);
  },

  viewPatrolLog:function(){
    var that = this;
    wx.navigateTo({
      url:'../checks_record/checks_record?websiteid='+that.data.webSiteId
    })
  }
});

//查询详细信息
function viewWebSiteInfo(that){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetWebSiteDetail.ashx?1=1";
    wx.request({
        url:url,
        data:{
          Token:Token,
          OpenID:OpenID,
          WebSiteID:webSiteId,
        },
        success:function(res){
            console.log(res);
            var webSiteInfo = {
              WebSiteID:res.data.ReturnData.WebSiteID,
              MarketName:res.data.ReturnData.MarketName,
              WebSiteName:res.data.ReturnData.WebSiteName,
              Address:res.data.ReturnData.Address,
              LinkMan:res.data.ReturnData.LinkMan,
              LinkPhone:res.data.ReturnData.LinkPhone
            };
            that.setData({webSite:webSiteInfo})
        }
    });
}

function viewSignInfo(that){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetWebSite_NotFinishLoop.ashx?1=1";
    wx.request({
        url:url,
        data:{
          Token:Token,
          OpenID:OpenID,
          WebSiteID:webSiteId,
        },
        success:function(res){
            var patrolLogs = res.data.ReturnData;
            console.log(patrolLogs);
            if(patrolLogs.ID != -1){
                that.setData({taskId:patrolLogs.ID});
                var imagesUrl = new Array();
                patrolLogs.ImgStrList.forEach(function(obj,index){
                  imagesUrl[index] = {
                    type:1,
                    path:obj.FilePath
                  };
                });
                that.setData({imagesUrl:imagesUrl});

                var videosUrl = new Array();
                patrolLogs.VideoStrList.forEach(function(obj,index){
                  videosUrl[index] = {
                    type:1,
                    path:obj.FilePath
                  };;
                });
                that.setData({videosUrl:videosUrl});
            }
            
        }
    });
}

function signIn_(that){
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_LoopSignIn.ashx?1=1";
    wx.request({
      url:url,
      data:{
          Token:Token,
          OpenID:OpenID,
          WebSiteID:webSiteId,
          GPS_X_Tencent:that.data.place.latitude,
          GPS_Y_Tencent:that.data.place.longitude,
          GPS_Address_Tencent:that.data.place.place
      },
      success:function(res){
        that.setData({loaddingHidden:!that.data.loaddingHidden}) 
        if(res.data.Result == '1'){
          that.setData({taskId:res.data.ReturnData.ID})
        }
        wx.showModal({content:res.data.ReturnMsg})
      }
    })
}

function signOut_(that){
    that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_LoopSignOut.ashx?1=1";
    wx.request({
      url:url,
      data:{
          Token:Token,
          OpenID:OpenID,
          WebSiteID:webSiteId,
          LoopID:that.data.taskId,
          GPS_X_Tencent:that.data.place.latitude,
          GPS_Y_Tencent:that.data.place.longitude,
          GPS_Address_Tencent:that.data.place.place
      },
      success:function(res){
        that.setData({loaddingHidden:!that.data.loaddingHidden}) 
        wx.showModal({content:res.data.ReturnMsg})
        if(res.data.Result == '1'){ 
          wx.navigateTo({
            url:'../checks_record/checks_record?websiteid='+that.data.webSiteId
          })
        }
      }
    })
}

//上传图片
function uploadSignPics(that){
        that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_LoopUploadImg.ashx?1=1";
    url = url +"&Token="+Token+"&OpenID="+OpenID+"&WebSiteID="+webSiteId+"&ID="+that.data.taskId;
    var imagesUrl = new Array();
    that.data.imagesUrl.forEach(function(obj,index){
      if(obj.type == 0){
        wx.uploadFile({
          url:url,
          method:'post',
          header: {
          "content-type": "multipart/form-data"
          },
          filePath: obj.path,
          name: 'Uploadfile',
          success:function(res){
            that.setData({loaddingHidden:!that.data.loaddingHidden}) 
            console.log(res);
            var data = JSON.parse(res.data)
            wx.showModal({content:data.ReturnMsg})
          }
        });
      }
      imagesUrl[index] = {type:1,path:obj.path};
    });
    that.setData({imagesUrl:imagesUrl});
}

//上传shipin
function uploadSignVideos(that){
        that.setData({loaddingHidden:!that.data.loaddingHidden}) 
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var webSiteId = that.data.webSiteId;
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_LoopUploadVideo.ashx?1=1";
    url = url +"&Token="+Token+"&OpenID="+OpenID+"&WebSiteID="+webSiteId+"&ID="+that.data.taskId;
    var videosUrl = new Array();
    that.data.videosUrl.forEach(function(obj,index){
      if(obj.type == 0){
        wx.uploadFile({
          url:url,
          method:'post',
          header: {
          "content-type": "multipart/form-data"
          },
          filePath: obj.path,
          name: 'Uploadfile',
          success:function(res){
            that.setData({loaddingHidden:!that.data.loaddingHidden}) 
            console.log(res);
            var data = JSON.parse(res.data)
            wx.showModal({content:data.ReturnMsg})
          }
        });
        videosUrl[index] = {type:1,path:obj.path};
      }
    });
    that.setData({videosUrl:videosUrl});
}