//获取应用实例
var app = getApp()
Page({
    data: {
        loginHidden:true,
        array: ["请选择用户账号类型", "销售门户账号", "综合门户账号"],
        objectArray: [{
                id: 0,
                name: '请选择用户账号类型'
            },
            {
                id: 1,
                name: '销售门户账号'
            },
            {
                id: 2,
                name: '综合门户账号'
            }
        ],
        index: 0,
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    bindUserChange: function(e) {
        this.setData({
            username: e.detail.value
        })
    },
    bindPwdChange: function(e) {
        this.setData({
            pwd: e.detail.value
        })
    },

    //事件处理函数 点击按钮
    applySubmit: function() {
        var that = this;
        this.setData({loginHidden:!this.data.loginHidden})
        var name = this.data.username;
        var pwd = this.data.pwd;
        var ind = this.data.index;

        //if(name && pwd && ind){
        wx.login({
            success: function(res) {
                wx.getUserInfo({
                    success: function(res2) {
                        bindUser(ind,name, pwd, res.code, res2.iv, res2.encryptedData);
                    }
                });
            }
        });
    },
    onLoad:function(){
      var that = this;
      this.setData({loginHidden:!this.data.loginHidden})
        var name = this.data.username;
        var pwd = this.data.pwd;
        var ind = this.data.index;
        wx.login({
            success: function(res) {
                wx.getUserInfo({
                    success: function(res2) {
                          that.setData({userInfo:res2.userInfo}); 
                          checkBind(ind,name, pwd, res.code, res2.iv, res2.encryptedData,that); 
                    }
                });
            }
        });
    }
})

//检查绑定
function checkBind(index,name, pwd, code, iv, encryptedData,that) {
    console.log(code)
    var url = getApp().globalData.mainUrl+"WX_MiniApps_User_CheckISWxBinded.ashx";
    wx.request({
        url: url,
        data: {
            Code: code,
            Iv: iv,
            EncryptedData: encryptedData
        },
        success: function(res3) {
            that.setData({loginHidden:!that.data.loginHidden})
            console.log(res3.data)
            if (res3.data.ReturnData == 0) {
                bindUserBefore(index,name, pwd);
            } else {
               getToken(that);
            }
        }
    });
}

function bindUserBefore(index,name, pwd){
    wx.login({
        success: function(res) {
            wx.getUserInfo({
                success: function(res2) {
                    bindUser(index,name, pwd, res.code, res2.iv, res2.encryptedData);
                }
            });
        }
    });
}

//绑定用户
function bindUser(index,name, pwd, code, iv, encryptedData) {
    console.log(code)
    var url = getApp().globalData.mainUrl+"WX_MiniApps_User_BindAccout.ashx";
    wx.request({
        url: url,
        data: {
            AccoutType: index,
            Accout: name,
            Password: pwd,
            Code: code,
            Iv: iv,
            EncryptedData: encryptedData
        },
        success: function(res3) {
            console.log(res3.data)
            if (res3.data.Result == 1) {
                getToken(that);
            }
        }
    });
}

//获取openid 和 token
function getToken(that) {
    wx.login({
        success: function(res) {
            wx.getUserInfo({
                success: function(res2) {
                    var url = "https://miniapp1.nedfon.info/SalesManagement/WX_MiniApps_User_GetToken.ashx";
                    wx.request({
                        url: url,
                        data: {
                            Code: res.code,
                            Iv: res2.iv,
                            EncryptedData: res2.encryptedData
                        },
                        success: function(res) {
                            that.setData({loginHidden:!that.data.loginHidden})
                            console.log(res.data);
                            var OpenID = res.data.ReturnData.OpenID;
                            var Token = res.data.ReturnData.Token;
                            if (res.data.Result == 1) {
                                wx.setStorageSync("OpenID",OpenID);
                                wx.setStorageSync("Token",Token);

                                //跳转页面到index
                                wx.redirectTo({
                                    url:'../index/index'
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}