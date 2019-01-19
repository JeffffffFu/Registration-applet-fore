var icon = require('../../icon/icon.js');
var id='';
var openid='';

Page({
 //创建变量，接受create_match界面传的值
  data:{
    list_index:[],
    openid:'',
    icon_expired:'',
    icon_leaved:'',
    icon_toSignUp:'',
    icon_registered:''
   
  },
 //加载界面时，获取全局变量并赋值给本界面的list_index变量
  onShow:function(options){
    this.setData({
      icon_expired: icon.icon_expired,
      icon_registered:icon.icon_registered,
      icon_leaved:icon.icon_leaved,
      icon_toSignUp:icon.icon_toSignUp
    })
    var that = this;
   
       var app=getApp();
    //连接mysql数据库 传送数据
    app.callback().then(res=>{
      wx.request({
        url: 'http://192.168.0.105:8080/Jeff/MyServlet?method=take',
        data: {
          openid: app.globalData.openid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("加载想要获取的数据：", res.data);
          //从服务器端获取到的数据，将数据赋值给list数组
          that.setData({
            list_index: res.data
          })
        },
        fail: function (res) {
          console.log(".....fail.....");
        }
      })
    });

   
  },

  create: function () {
    wx.navigateTo({
      url: '../create_match/create_match'
    })
    console.log('跳转成功');
    wx.setNavigationBarTitle({
      title: '创建比赛'
    })
  }
 

  
})
