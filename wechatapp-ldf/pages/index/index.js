//index.js
//获取应用实例
// var app = getApp();
Page({
    data: {
        indexmenu: [],
        imgUrls: []
    },
    onLoad: function() {
        //OpenID
        var OpenID = wx.getStorageSync("OpenID");
        var Token = wx.getStorageSync("Token");
        this.fetchData(OpenID, Token);
    },
    fetchData: function(OpenID, Token, code) {
        var that = this;
        var url = getApp().globalData.mainUrl + "WX_MiniApps_User_GetAccoutPowerList.ashx";
        wx.request({
            url: url,
            data: {
                OpenID: OpenID,
                Token: Token
            },
            success: function(res) {
                console.log(res.data)
                var menuArray1 = new Array();
                var menuArray2 = new Array();
                var menuArray3 = new Array();
                var i = 0,
                    j = 0,
                    k = 0;
                res.data.ReturnData.forEach(function(value, index) {
                    if (value.PowerID == "VIEW") {
                        if (value.PageModel == '1') {
                            menuArray1[i] = {
                                'icon': './../../images/' + value.PageName + '.png',
                                'text': value.PageDesc,
                                'url': value.PageName
                            };
                            i++;
                        } else if (value.PageModel == '2') {
                            menuArray2[j] = {
                                'icon': './../../images/' + value.PageName + '.png',
                                'text': value.PageDesc,
                                'url': value.PageName
                            };
                            j++;
                        } else {
                            menuArray3[k] = {
                                'icon': './../../images/' + value.PageName + '.png',
                                'text': value.PageDesc,
                                'url': value.PageName
                            };
                            k++;
                        }
                    }
                });
                that.setData({
                    indexmenu1: menuArray1,
                    indexmenu2: menuArray2,
                    indexmenu3: menuArray3,
                    menu1_len:menuArray1.length,
                    menu2_len:menuArray2.length,
                    menu3_len:menuArray3.length
                });
            }
        });
    },
    changeRoute: function(url) {
        wx.redirectTo({
            url: `../${url}/${url}`
        })
    },
    onReady: function() {
        //生命周期函数--监听页面初次渲染完成
        // console.log('onReady');
    },
    onShow: function() {
        //生命周期函数--监听页面显示
        // console.log('onShow');
    },
    onHide: function() {
        //生命周期函数--监听页面隐藏
        // console.log('onHide');
    },
    onUnload: function() {
        //生命周期函数--监听页面卸载
        // console.log('onUnload');
    },
    onPullDownRefresh: function() {
        //页面相关事件处理函数--监听用户下拉动作
        // console.log('onPullDownRefresh');
    },
    onReachBottom: function() {
        //页面上拉触底事件的处理函数
        // console.log('onReachBottom');
    }
})