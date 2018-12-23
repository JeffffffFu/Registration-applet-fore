var app = getApp();
Page({
  data: {
     information_list:[],
     nickName: '',
     openid:'',
     uuid:'',
     match_time:'',
     disabled_join:false,
     disabled_leave: false,
     userInfo:[],
     join_information:[],
     leave_information: []
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
  //统一根据uuid来重新获取，这样不管是在程序中的还是分享进来的，都使用用一个方法
    that.setData({
      uuid: options.uuid,
      match_time:options.time
    })
    console.log("uuid:",that.data.uuid);
    console.log("time:", that.data.match_time);
  // 取出key为openid的值.openid在app.js的onload界面已经存在storage中
    wx.getStorage({      
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        //向后台请求，根据uuid获取对应比赛信息。并且将用户和这场比赛绑定起来
        wx.request({
          url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=take_basisUuid',
          data: {
            uuid: that.data.uuid,
            openid: that.data.openid
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("成功接收：", res.data);
            //成功后，接收这场比赛的信息
            that.setData({
              information_list: res.data.match_information[0],
              //接收后台处理好的报名人和请假人的数据信息
              join_information: res.data.json_register,
              leave_information: res.data.json_leave,
               //接收后台传来关于该用户是否已经报名或请假，从而控制报名或请假按钮是否禁用
              disabled_join: res.data.disable_join,
              disabled_leave: res.data.disable_leave
            })
          },
          fail: function (res) {
            console.log(".....fail.....");
          }
        })
      },
    })
      // 要求小程序返回分享目标信息
      wx.showShareMenu({
        withShareTicket: true
      })


  },

  //报名按钮,点击报名按钮，把这场比赛的uuid和该用户的openid传到大后台 
  user_join: function () {
    var that = this;
    that.setData({       //点击后将禁用值变为true，则成功禁用此按钮
      disabled_join:true,
      disabled_leave:false
    })

    //连接mysql数据库 传送数据
    wx.request({
      url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=sign_up',
      data: {
          openid:this.data.openid,
          uuid:this.data.uuid,
          time:this.data.match_time
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //成功后，分别将接受到的报名人信息和请假人信息分别赋值给这个页面中的变量
        that.setData({
          join_information: res.data.json_register,
          leave_information: res.data.json_leave,
          
        })
        console.log("app.js从后台获取的数据(register)：", res.data);
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  },

  //请假按钮,点击请假按钮，把这场比赛的uuid和该用户的openid传到大后台 
  user_leave: function (){
    var that = this;
    that.setData({       //点击后将禁用值变为true，则成功禁用此按钮
      disabled_join: false,
      disabled_leave: true
    })  

    //连接mysql数据库 传送数据
    wx.request({
      url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=leave',
      data: {
        openid: this.data.openid,
        uuid: this.data.uuid,
        time: this.data.match_time
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //成功后，分别将接受到的报名人信息和请假人信息分别赋值给这个页面中的变量
        that.setData({
          join_information: res.data.json_register,
          leave_information: res.data.json_leave
        })
        console.log("app.js从后台获取的数据(leave)：", res.data);
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  },


  // //请假按钮  可以在前端界面变换样式的请假按钮
  // user_leave: function () {
  //   console.log('onLoad')
  //   var that = this
  //   //调用应用实例的方法获取全局数据
  //   app.getUserInfo(function (userInfo) {
  //     //更新数据
  //     that.setData({
  //       userInfo: userInfo
  //     })
  //   }),


  //   this.setData({
  //     showView1: false,
  //     showView2: true
  //   })
  // }, 

  //转发
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '快快报名',
      path: 'pages/match_information/match_information&uuid='+ this.data.uuid+'symbol='+点击分享的链接进入,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  }

})
