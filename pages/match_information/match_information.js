var code = "";
var icon = require('../../icon/icon.js');
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
     leave_information: [],
     join_count:'',
     leave_count: '',
     longitude:'',
     latitude:'',
     icon_right:'',
     icon_map:'',
     icon_share:'',
     icon_edit:'',
     icon_home:'',
     icon_authorization:'',
     item:'',
     scroll_top:10,
     scrollTop:0,
     authorize:false,
     icon_load:'',
     load:false,  //判断是否加载成功
     height:0, 
     people_view:false 
  },

  /**
   * 生命周期函数--监听页面加载
   */

  


  onLoad: function (options) {
    var that=this;
    if(wx.getStorageSync("userInfo")!=""){
       that.setData({
          authorize:true
       })
    }
    wx.setNavigationBarTitle({
      title: '活动详情'
    })
  //统一根据uuid来重新获取，这样不管是在程序中的还是分享进来的，都使用用一个方法
    that.setData({
      icon_right:icon.right,
      icon_map:icon.icon_map,
      icon_share:icon.share,
      icon_edit:icon.edit,
      icon_home:icon.icon_home,
      icon_load:icon.load,
      icon_authorization: icon.icon_authorization,         
      height: getApp().globalData.winHeight-100,
    })
     getApp().globalData.uuid=options.uuid;
       getApp().globalData.match_time=options.time;
       console.log("授权信息",that.data.authorize)
 // 取出key为openid的值.openid在app.js的onload界面已经存在storage中
    // wx.getStorage({      
    //   key: 'openid',
    //   success: function (res) {
    //     console.log("已拿到用户OPENDID")
    //     that.setData({
    //       openid:res.data
    //     })

    app.callback().then(res => {
        //向后台请求，根据uuid获取对应比赛信息。并且将用户和这场比赛绑定起来
        wx.request({
          url: 'https://www.baoming.site/Jeff/viewMatch',
          data: {
            uuid: getApp().globalData.uuid,
            openid: wx.getStorageSync('openid')
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("match_information.js成功接收：", res.data);
            // console.log("authorize:", that.data.authorize);
            //成功后，接收这场比赛的信息
            that.setData({
              information_list: res.data.matchList[0],
              //接收后台处理好的报名人和请假人的数据信息
              join_information: res.data.userListJoin,
              leave_information: res.data.userListLeave,
               //接收后台传来关于该用户是否已经报名或请假，从而控制报名或请假按钮是否禁用
              disabled_join: res.data.disableJoin,
              disabled_leave: res.data.disableLeave,
              join_count: res.data.userListJoin.length,
              leave_count: res.data.userListLeave.length,
              longitude: parseFloat(res.data.matchList[0].longitude),
              latitude: parseFloat(res.data.matchList[0].latitude),
              openid: wx.getStorageSync('openid'),
              load:true
            })
            if (res.data.matchList[0].people != '') {
              that.setData({
                people_view: true
              })
            }   
         },
          fail: function (res) {
          console.log(".....fail.....");
          }
       })
    })
      // },
  //     fail:function(){
  //       //如果在缓存中没有拿到openid,先获取用户登录信息后再去请求比赛界面
  //       app.callback().then(res => {
  //         console.log("回调结束，已获取用户OPENDID")
  //       wx.request({
  //         url: 'http://192.168.21.17:8080/Jeff/viewMatch',
  //         data: {
  //           uuid: getApp().globalData.uuid,
  //           openid:wx.getStorageSync("openid")
  //         },
  //         method: 'GET',
  //         header: {
  //           'content-type': 'application/json' // 默认值
  //         },
  //         success: function (res) {
  //           console.log("成功接收：", res.data);
  //           //成功后，接收这场比赛的信息
  //           that.setData({
  //             information_list: res.data.matchList[0],
  //             //接收后台处理好的报名人和请假人的数据信息
  //             join_information: res.data.userListJoin,
  //             leave_information: res.data.userListLeave,
  //             //接收后台传来关于该用户是否已经报名或请假，从而控制报名或请假按钮是否禁用
  //             disabled_join: res.data.disableJoin,
  //             disabled_leave: res.data.disableLeave,
  //             join_count: res.data.userListJoin.length,
  //             leave_count: res.data.userListLeave.length,
  //             longitude: parseFloat(res.data.matchList[0].longitude),
  //             latitude: parseFloat(res.data.matchList[0].latitude),
  //             load: true
  //           })
  //           if (res.data.matchList[0].people!=''){
  //             that.setData({
  //               people_view:true
  //             })
             
  //           }
  //     }
  //   })
  //       })
  // },
  //   })
    // 要求小程序返回分享目标信息
      wx.showShareMenu({
        withShareTicket: true
      })
  },

  //获取用户授权，可通过id来判断接下来点击的是报名动作还是请假动作
  bindGetUserInfo: function (e) {
    console.log("e:", e)
    if (e.target.id == "registration") {
      console.log("报名按钮")
      if (e.detail.userInfo) {
        wx.showToast({
          title: '授权成功！',
          icon: 'success',
          duration: 2000//持续的时间
        })

        app.callback2().then(res => {
          var that = this;
    
          if (that.data.information_list.people != '' && that.data.join_count >= that.data.information_list.people) {
            wx.showToast({
              title: '当前报名人数已满',
              icon: 'none',
            })
          } else {
            that.setData({       //点击后将禁用值变为true，则成功禁用此按钮
              disabled_join: true,
              disabled_leave: false,
              authorize: true,
            })
            //连接mysql数据库 传送数据
            wx.request({
              url: 'https://www.baoming.site/Jeff/registration',
              data: {
                openid: wx.getStorageSync("openid"),
                uuid: getApp().globalData.uuid,
                time: getApp().globalData.match_time
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
                  join_count: res.data.json_register.length,
                  leave_count: res.data.json_leave.length,
                })
                console.log("app.js从后台获取的数据(register)：", res.data);
                console.log("报名个数：", that.data.join_count);
              },
              fail: function (res) {
                console.log(".....fail.....");
              }
            })
          }
        })
      }
      else {
        wx.showToast({
          title: '您拒绝了微信授权！',
          icon: 'none',
          duration: 2000//持续的时间
        })
      }
    }
    else {
      console.log("请假按钮")
      if (e.detail.userInfo) {
        wx.showToast({
          title: '授权成功！',
          icon: 'success',
          duration: 2000//持续的时间
        })
        app.callback2().then(res => {
          var that = this;
    
          that.setData({       //点击后将禁用值变为true，则成功禁用此按钮
            disabled_join: false,
            disabled_leave: true,
            authorize: true,
          })
          //连接mysql数据库 传送数据
          wx.request({
            url: 'https://www.baoming.site/Jeff/leave',
            data: {
              openid: wx.getStorageSync("openid"),
              uuid: getApp().globalData.uuid,
              time: getApp().globalData.match_time
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
                join_count: res.data.json_register.length,
                leave_count: res.data.json_leave.length,
              })
              console.log("app.js从后台获取的数据(leave)：", res.data);
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          })
        })
      }
      else {
        wx.showToast({
          title: '您拒绝了微信授权！',
          icon: 'none',
          duration: 2000//持续的时间
        })
      }
    }
  },


//微信消息模板表单需要的formid
 BtnCommit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail);

        //连接mysql数据库 传送数据
        setTimeout(() => {
        wx.request({
          url: 'https://www.baoming.site/Jeff/getFormid',
          data: {
            formid: e.detail.formId,
            openid:getApp().globalData.openid,
            uuid: getApp().globalData.uuid,
            join_count:this.data.join_count,
            time:getApp().globalData.match_time,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data);
          },
          fail: function (res) {
            console.log(".....fail.....");
          }
        })
        }, 3000)
      
  },


//微信消息模板表单需要的formid
  BtnCommit2: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId);
    //连接mysql数据库 传送数据
    setTimeout(() => {
      wx.request({
        url: 'https://www.baoming.site/Jeff/getFormid',
        data: {
          formid: e.detail.formId,
          openid: getApp().globalData.openid,
          uuid: getApp().globalData.uuid,
          join_count: this.data.join_count,
          time:getAPP().globalData.match_time,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
        },
        fail: function (res) {
          console.log(".....fail.....");
        }
      })

    },3000)
  },

 

  //报名按钮,点击报名按钮，把这场比赛的uuid和该用户的openid传到大后台 
  user_join: function () {    
    var that = this;
    console.log('join_count',that.data.join_count);
    console.log('information_list.people', that.data.information_list.people);
      if (that.data.information_list.people != '' && that.data.join_count >= that.data.information_list.people) {
        wx.showToast({
          title: '当前报名人数已满',
          icon: 'none',
        })
      }
      else {
        that.setData({       //点击后将禁用值变为true，则成功禁用此按钮
          disabled_join: true,
          disabled_leave: false
        })

        //连接mysql数据库 传送数据
        wx.request({
          url: 'https://www.baoming.site/Jeff/registration',
          data: {
            openid: wx.getStorageSync("openid"),
            uuid: getApp().globalData.uuid,
            time: getApp().globalData.match_time,
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
              join_count: res.data.json_register.length,
              leave_count: res.data.json_leave.length,
            })
            console.log("app.js从后台获取的数据(register)：", res.data);
            console.log("报名个数：", that.data.join_count);
          },
          fail: function (res) {
            console.log(".....fail.....");
          }
        })
      }
    
  
  },

  //请假按钮,点击请假按钮，把这场比赛的uuid和该用户的openid传到大后台 
  user_leave: function (){
    var that = this;
    that.setData({       //点击后将禁用值变为true，则成功禁用此按钮
      disabled_join:false,
      disabled_leave: true
    })  

    //连接mysql数据库 传送数据
    wx.request({
      url: 'https://www.baoming.site/Jeff/leave',
      data: {
        openid: wx.getStorageSync("openid"),
        uuid: getApp().globalData.uuid,
        time: getApp().globalData.match_time
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
          join_count: res.data.json_register.length,
          leave_count: res.data.json_leave.length,
        })
        console.log("app.js从后台获取的数据(leave)：", res.data);
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  },



  //转发
  onShareAppMessage: function (ops) {
    console.log("uuid:", this.data.uuid)
    return {
      title: '赶快进来报名吧！',
      path: 'pages/index/index?uuid=' + getApp().globalData.uuid + '&time=' + getApp().globalData.match_time+'&sign_share='+1,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
  //返回首页
  back:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  //打开地图
  openLocation: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
    })
  },


//用scroll-view的触顶进行下拉刷新，加入下拉刷新动画效果
   topLoad:function(){
    var that=this;
      wx.startPullDownRefresh();
    wx.showNavigationBarLoading();
    that.setData({
      icon_right: icon.right,
      icon_map: icon.icon_map,
      icon_share: icon.share,
      icon_edit: icon.edit,
      icon_home: icon.icon_home,
      icon_load: icon.load,
      icon_authorization: icon.icon_authorization,
      height: getApp().globalData.winHeight - 100,
      authorize: getApp().globalData.authorize,
      openid: getApp().globalData.openid,
    })
    console.log("match的uuid:", getApp().globalData.uuid);
    console.log("match的time:", getApp().globalData.match_time);
    // 取出key为openid的值.openid在app.js的onload界面已经存在storage中
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        getApp().globalData.openid = res.data;
        //向后台请求，根据uuid获取对应比赛信息。并且将用户和这场比赛绑定起来
        wx.request({
          url: 'https://www.baoming.site/Jeff/viewMatch',
          data: {
            uuid: getApp().globalData.uuid,
            openid: getApp().globalData.openid
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("成功接收：", res.data);
            console.log("authorize:", that.data.authorize);
            //成功后，接收这场比赛的信息
            that.setData({
              information_list: res.data.matchList[0],
              //接收后台处理好的报名人和请假人的数据信息
              join_information: res.data.userListJoin,
              leave_information: res.data.userListLeave,
              //接收后台传来关于该用户是否已经报名或请假，从而控制报名或请假按钮是否禁用
              disabled_join: res.data.disableJoin,
              disabled_leave: res.data.disableLeave,
              join_count: res.data.userListJoin.length,
              leave_count: res.data.userListLeave.length,
              longitude: parseFloat(res.data.matchList[0].longitude),
              latitude: parseFloat(res.data.matchList[0].latitude),
              scroll_top: 10,
              load: true
            })
            if (res.data.matchList[0].people != '') {
              that.setData({
                people_view: true
              })

            }
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();

          },
          fail: function (res) {
            console.log(".....fail.....");
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
          }
         
        })
      }, fail: function () {
        //向后台请求，根据uuid获取对应比赛信息。并且将用户和这场比赛绑定起来
        wx.request({
          url: 'https://www.baoming.site/Jeff/viewMatch',
          data: {
            uuid: getApp().globalData.uuid,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("成功接收：", res.data);
            //成功后，接收这场比赛的信息
            that.setData({
              information_list: res.data.matchList[0],
              //接收后台处理好的报名人和请假人的数据信息
              join_information: res.data.userListJoin,
              leave_information: res.data.userListLeave,
              //接收后台传来关于该用户是否已经报名或请假，从而控制报名或请假按钮是否禁用
              disabled_join: res.data.disableJoin,
              disabled_leave: res.data.disableLeave,
              join_count: res.data.userListJoin.length,
              leave_count: res.data.userListLeave.length,
              longitude: parseFloat(res.data.matchList[0].longitude),
              latitude: parseFloat(res.data.matchList[0].latitude),
              load: true
            })
            if (res.data.matchList[0].people != '') {
              that.setData({
                people_view: true
              })

            }
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
          }
        })
  }
    })
  },
  
 //编辑比赛信息
  edit:function(){
    console.log("imformation:", this.data.information_list)
    wx.navigateTo({
      url: '../edit/edit?information_list=' + JSON.stringify(this.data.information_list)+'&join_count='+this.data.join_count,
    })
  },

 
 //报名队员
  registration_member:function(){
    wx.navigateTo({
      url: '../registration_member/registration_member?registration_member=' + JSON.stringify(this.data.join_information)+'&registration_count='+this.data.join_count+'&match_people='+this.data.information_list.people
    })
  },
  //请假队员
  leave_member: function () {

    wx.navigateTo({
      url: '../leave_member/leave_member?leave_member=' + JSON.stringify(this.data.leave_information) + '&leave_count=' + this.data.leave_count
    })
  }

})