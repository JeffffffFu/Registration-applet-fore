var code = "";
var that = this;
App({
  //设置全局变量，来储存发布的比赛的信息
  globalData: {
    openid: '',
    userInfo: [],
    join_information: [],
    history:[],
    openid: '',
    uuid: '', //这个是match_information分享的uuid
    match_time: '', //这个是match_information分享的match_time
    edit_time: '',
    time: '',
    week: '',
    load: false,
    isdate: false,
    isdate2: true,
    sign_share: 2,
    winHeight: 0,
    formid: '',
    sign: '', //点击删除、保存或直接刷新  删除：1 保存：2
  },

  onLaunch: function() {
 
  },


  onShow: function() {
   

  },

  //封装一个用户授权的函数，获取用户姓名头像等基本信息
  callback2: function() {
    return new Promise((resolve) => {
      wx.login({
        //登录成功后，将code先存起来
        success: function(res) {
          code = res.code;
          //获取用户信息，成功后发送请求给后台进行连接
          wx.getUserInfo({
            success: function(res) {
              getApp().globalData.authorize = true;
              wx.setStorage({ //这是个异步方法，进行存储数据
                key: 'userInfo',
                data: res.userInfo,
              });
              //发送请求
              wx.request({
                url: 'https://www.baoming.site/Jeff/inserUser', //接口地址
                data: {
                  code:code,
                   user_name:res.userInfo.nickName,
                  user_url: res.userInfo.avatarUrl,
                   user_city:res.userInfo.city,
                     user_country: res.userInfo.country,
                    user_gender:res.userInfo.gender,
                     user_province:res.userInfo.province                  
                },
                header: {
                  'content-type': 'application/json' //默认值
                },
                success: function(res) {
                  wx.setStorage({ //这是个异步方法，进行存储数据
                    key: 'openid',
                    data: res.data,
                  });
                  resolve(res.data)
                }
              })
            },
            fail: function(res) {
              //如果获取不到用户授权的用户信息
              getApp().globalData.authorize = false;
              getApp().globalData.load = false;
              resolve(getApp().globalData.load)
            }
          })
        }
      })
    })
  },


//获取用户登录信息，包装成回调函数，可获取到用户openid
callback: function() {
    return new Promise((resolve) => {
       //判断用户是否有缓存的openid，如没有则进行获取.将此函数封装成回调函数
      if (wx.getStorageSync('openid') == "") {
        console.log("app.js-缓存中没有openid，现在开始获取并解析-----------")
        wx.login({
          //登录成功后，将code先存起来
          success: function (res) {
            console.log("app.js-res.code:", res.code)
            //发送请求
            wx.request({
              url: 'https://www.baoming.site/Jeff/inserUser2', //接口地址
              data: {
                code: res.code,
              },
              header: {
                'content-type': 'application/json' //默认值
              },
              success: function (res) {
                wx.setStorageSync('openid', res.data);
                console.log("解析出并保存该openid:", res.data);
                resolve(wx.getStorageSync('openid'))  //resolve表示回调成功
              },
              fail:function(){
                console.log("请求失败-------")
              }
            })

          }
        })
      } else {
        console.log("app.js-有缓存的openid信息：", wx.getStorageSync('openid'))
        resolve(wx.getStorageSync('openid')) //resolve表示回调成功
      }
    })
  }
})