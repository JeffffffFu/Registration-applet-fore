var AppSecret = "eb5e41fb9cbab35698e5f2f341e7b306";
var AppID = "wxbd8c3059b444fd81";
var grant_type = "authorization_code";
var code = "";

App({
   //设置全局变量，来储存发布的比赛的信息
  globalData: {
    list :[],              
    openid:'',
     userInfo:[],
     join_information:[],
     openid:'',
     latitude:'',
     longitude:''
  },
  onShow: function () {
  },

//获取微信账号唯一标识
  onLaunch: function () {

 } ,
  
callback:function(){
 return new Promise((resolve)=>{
    wx.login({
      //登录成功后，将code先存起来
      success: function (res) {
        console.log(res.code)
        code = res.code;
        //获取用户信息，成功后发送请求给后台进行连接
        wx.getUserInfo({
          success: function (res) {

            console.log("res.userInfo", res.userInfo);
            wx.setStorage({//这是个异步方法，进行存储数据
              key: 'userInfo',
              data: res.userInfo,
            });
            //发送请求
            wx.request({
              url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=user_info', //接口地址
              data: {
                code: code,
                appsercet: AppSecret,
                appid: AppID,
                grant_type: grant_type,
                user_name: res.userInfo.nickName,
                user_url: res.userInfo.avatarUrl
              },
              header: {
                'content-type': 'application/json' //默认值
              },
              success: function (res) {
                wx.setStorage({//这是个异步方法，进行存储数据
                  key: 'openid',
                  data: res.data,
                });
                getApp().globalData.openid = res.data;
                console.log("openid:", getApp().globalData.openid);
                resolve(res.data)
              }
            })
          }
        })
      }
    })    
  })
}

  })