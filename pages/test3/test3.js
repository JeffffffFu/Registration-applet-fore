
var app = getApp();
Page({
  onLoad: function (options) {
    //连接mysql数据库 传送数据
    wx.request({
      url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=sign_up',
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("app.js从后台获取的数据：", res.data);
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })

  },
})

