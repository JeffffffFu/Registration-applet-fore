
var app = getApp();
Page({
  data:{
      openid:''
  },
  onLoad: function (options) {
    var that = this;
    setTimeout(function () {
      console.log(getApp().globalData.openid)
      that.setData({
        openid: getApp().globalData.openid
      })
    }, 1000)
  },
})

