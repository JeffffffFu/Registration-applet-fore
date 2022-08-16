var icon = require('../../icon/icon.js');
var id='';
var openid='';
var app=getApp();
var code = "";
Page({
 //创建变量，接受create_match界面传的值
  data:{
    list_index:[],
    openid:'',
    icon_expired:'',
    icon_leaved:'',
    icon_toSignUp:'',
    icon_registered:'',
    icon_load:'',
    userInfo:[],
    height:0,
    uuid:'',
    authorize:false,
    load:false,
    icon_authorization:'',
    share:1
 
  },
  onLoad:function(options){
    console.log("options:",options)
    //判断是否是分享的界面，进行界面跳转判断
    if (options.sign_share==1){
      wx.navigateTo({
        url: '../match_information/match_information?uuid=' + options.uuid+'&time='+options.time,
      })
    }else{
      this.setData({
        share: 0
      })
    }

  

 
  //获取屏幕高宽比例
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
        clientWidth = res.windowWidth,
        rpxR = 750 / clientWidth;    //比例
        var calc = clientHeight * rpxR;
        // console.log("calc", calc);
        getApp().globalData.winHeight = calc;
        
      }
    })
  
  },


 //加载界面时，获取全局变量并赋值给本界面的list_index变量
  onShow:function(options){
    this.setData({
      icon_expired: icon.icon_expired,
      icon_registered: icon.icon_registered,
      icon_leaved: icon.icon_leaved,
      icon_toSignUp: icon.icon_toSignUp,
      icon_load: icon.load,
      icon_authorization: icon.icon_authorization,
      height: getApp().globalData.winHeight - 120
    })
    // if(this.data.share==0){
      // console.log("来了老弟")
      var that = this;
      var app = getApp();
      //连接mysql数据库 传送数据
    app.callback().then(res => {
      console.log("回调结束，已获取用户OPENDID")
        wx.request({
          url: 'https://www.baoming.site/Jeff/listMatch',
          data: {
            openid: wx.getStorageSync('openid')
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("index.js---加载比赛列表数据：", res.data);
            app.globalData.list = res.data.matchList;
            app.globalData.history=res.data.matchHistory;
            //从服务器端获取到的数据，将数据赋值给list数组
            that.setData({
              list_index: res.data.matchList,
              load: true,
            })
          
          },
          fail: function (res) {
            console.log("首页.....fail.....");
          }
        })
    })
      
  },

// 分享界面
    onShareAppMessage: function (res) {
      var that = this;
      return {
        title: '小捷出品，轻量级报名工具。迅速组织，一键报名。',
        path: 'pages/index/index',
        success: function (res) {
          console.log("转发成功")
        },
        fail: function (res) {
          console.log("转发失败")
        }
      }
  
  },

  create: function () {
    wx.navigateTo({
      url: '../create_match/create_match'
    })
    console.log('跳转成功');
  },


})
