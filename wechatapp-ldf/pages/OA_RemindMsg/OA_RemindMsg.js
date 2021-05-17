
var app = getApp()
Page({

  //顶部tab选项卡，别为我为什么这么乱，因为我是抄来了
  data: {
    /**
        * 页面配置
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
  },
  onLoad: function () {
    var that = this;

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    getMessages(that,0);
  },
  /**
     * 滑动切换tab
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

    getMessages(that,that.data.currentTab);
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    getMessages(that,that.data.currentTab);
  },

  //事件处理函数 点击按钮
  details: function () {
    wx.navigateTo({
      url: '../message_details/message_details'
    })
  },


});

function getMessages(that,type){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_OA_RemindMsg.ashx";
    wx.request({
      url: url,
      data:{
        Token:Token,
        OpenID:OpenID,
        WorkHandleStatus:type
      }, 
      success:function(res){
          console.log(res.data);
          var list = new Array();
          res.data.ReturnData.forEach(function(obj,index){
            list[index] = {
              workNo:obj.CreateTime,
              workName:obj.Description
            }
          });
          that.setData({list:list})
      }
    });
}