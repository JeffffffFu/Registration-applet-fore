
var app = getApp();

Page({
  data: {
    // 字数限制
    winHeight:0,

  },
  onShow:function(){
   
  },
  text: function (e) {
    console.log("cessss")
    wx.navigateTo({
      url: '../out/out',

    })
  },
})

