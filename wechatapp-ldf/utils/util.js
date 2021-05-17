/**
* 格式化时间 
* @param {String} date 原始时间格式
* 格式后的时间：yyyy/mm/dd hh:mm:ss
**/
const formatTime = (date) => {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n){
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
* 从一个数组中随机取出若干个元素组成数组
* @param {Array} arr 原数组
* @param {Number} count 需要随机取得个数
**/
const getRandomArray = (arr, count) => {
  var shuffled = arr.slice(0),
      i = arr.length, 
      min = i - count, 
      temp, 
      index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

/**
* 从一个数组中随机取出一个元素
* @param {Array} arr 原数组
**/
const getRandomArrayElement = arr => {
   return arr[Math.floor(Math.random()*arr.length)];
}

///--------------------------
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

function getLocation(that){
  wx.getLocation({
        success:function (res) {  
          var latitude = res.latitude;
          var longitude = res.longitude;
          var key = 'GWWBZ-ZJSW4-RJCUJ-DAHA6-TLE7Z-HABCE';
          wx.request({
            url:'http://apis.map.qq.com/ws/geocoder/v1/',
            data:{
               location:latitude+","+longitude,
               key:key
            },
            success:function(res) {
              var place = res.data.result.address;
              location = {
                latitude:latitude,
                longitude:longitude,
                place:place
              }
              that.setData({place:location});
            } 
          })
        }
    });
}

function locationCallback(callback,that){
  wx.getLocation({
        success:function (res) {  
          var latitude = res.latitude;
          var longitude = res.longitude;
          var key = 'GWWBZ-ZJSW4-RJCUJ-DAHA6-TLE7Z-HABCE';
          wx.request({
            url:'http://apis.map.qq.com/ws/geocoder/v1/',
            data:{
               location:latitude+","+longitude,
               key:key
            },
            success:function(res) {
              var place = res.data.result.address;
              location = {
                latitude:latitude,
                longitude:longitude,
                place:place
              }
              that.setData({place:location});
              callback(that);
            } 
          })
        }
    });
}


module.exports = {
  formatTime: formatTime,
  getRandomArray: getRandomArray,
  getRandomArrayElement: getRandomArrayElement,
  getLocation : getLocation,
  locationCallback:locationCallback
}