
function init(that){
    var bindProvinceChange = function(e){
        //加载三级
        getcity(that,'3',that.data.province_[e.detail.value].code)

        that.setData({provinceIndex:e.detail.value});
    };
    var bindCityChange = function(e){
        getcity(that,'4',that.data.city_[e.detail.value].code)
        that.setData({cityIndex:e.detail.value});
    };
    var bindDistrictChange = function(e){
        that.setData({
            districtIndex: e.detail.value
        });
    };
    that['bindProvinceChange']=bindProvinceChange;
    that['bindCityChange'] = bindCityChange;
    that['bindDistrictChange'] = bindDistrictChange;
}

function getcity(that,level,code){
    var OpenID = wx.getStorageSync("OpenID");
    var Token = wx.getStorageSync("Token");
    var url = getApp().globalData.mainUrl + "WX_MiniApps_WebSite_GetTerritoryList.ashx";
    wx.request({
      url: url,
      data:{
        Token:Token,
        OpenID:OpenID,
        TargetTerritoryCodeLevel:level,
        ParentTerritoryCode:code
      }, 
      success:function(res){
          if(level == '3'){
                var list = new Array();
                var list1 = new Array("-三级地区-");
                res.data.ReturnData.forEach(function(obj,index){
                    list[index+1] = {
                    name:obj.Name,
                    code:obj.Value
                    };
                    list1[index+1] = obj.Name;
                });
                that.setData({city_:list})
                that.setData({city:list1}); 
          }else if(level == '4'){
                var list = new Array();
                var list1 = new Array("-四级地区-");
                res.data.ReturnData.forEach(function(obj,index){
                    list[index+1] = {
                    name:obj.Name,
                    code:obj.Value
                    };
                    list1[index+1] = obj.Name;
                });
                that.setData({district_:list})
                that.setData({district:list1}); 
          }else{
                var list = new Array();
                var list1 = new Array("-二级地区-");
                res.data.ReturnData.forEach(function(obj,index){
                    list[index+1] = {
                    name:obj.Name,
                    code:obj.Value
                    };
                    list1[index+1] = obj.Name;
                });
                that.setData({province_:list}) 
                that.setData({province:list1}); 
          }
      }
    });
}

module.exports={
    init:init,
    getcity:getcity
}
