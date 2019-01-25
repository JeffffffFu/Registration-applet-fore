
var app = getApp();

Page({
  data: {
    // 字数限制
    winHeight:0,

  },
  onShow:function(){
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
         clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;    //比例
        var calc = clientHeight * rpxR;
        console.log("calc",calc)
        that.setData({
          winHeight: calc
        });
      }
    })
  }
 

})

