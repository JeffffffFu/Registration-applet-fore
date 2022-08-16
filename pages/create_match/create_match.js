var app=getApp();
var date = require('../../component/date/date.js');

Page(
  {
    //设置变量，以便存储输入的数据
    data:{
        match_theme:'',
        match_time:'',
        match_week:'',
        deadline_time:'',
        deadline_week:'',
        match_address:'',
        match_address_name:'',
        match_rule:'',
        match_color:'',
       match_directions:'',
       match_people:'',
        user_nickName: "微信账号登录",
        user_avatarUrl: "./user-unlogin.png",
        openid:'',
        aa:true,
        bb:true,
        cc:true,
        // 字数限制
        current: 0,
         max: 100,
       
    },
    onLoad:function(e){
      wx.setNavigationBarTitle({
        title: '创建活动'
      });
      console.log("aaa:",getApp().globalData.history)
      //将得到的历史数据赋值
      getApp().globalData.longitude = getApp().globalData.history[0].longitude;
      getApp().globalData.latitude = getApp().globalData.history[0].latitude;
      this.setData({
        match_address: getApp().globalData.history[0].address
      })
    },
    // 活动详情文本框及字数限制
    limit: function (e) {
      var value = e.detail.value;
      var length = parseInt(value.length);  
      if (length > this.data.noteMaxLen) {
        return;
      }

      this.setData({
        current: length,
        match_directions:e.detail.value,
     
      });
    },
    //比赛主题
     match_theme_input:function(e){
      this.setData({
        match_theme: e.detail.value
      })
    },

    //获取时间日期
    bindSelect: function (e) {
      console.log("时间：",e.detail)//选择结果值
      this.setData({
        match_time:e.detail[0],
        match_week:e.detail[1]

      })
    },


  
    //人数限制
    match_people_input: function (e) {
      console.log('people');
      this.setData({
        match_people: e.detail.value
      })
    },
       //点击按钮，将值传给后端
       create_button: function (e) {
         var that=this;
         var app=getApp();
         //判断主题时间地址是否填写，进行逻辑交互处理
         if (that.data.match_theme == "" || that.data.match_time == "" || that.data.match_address == "") {
           wx.showToast({
             title: '主题、时间、地点不能为空！',
             icon: 'none',
             duration: 2000//持续的时间
           })
         
         }else if(!getApp().globalData.isdate) {
           wx.showToast({
             title: '所选时间早于当前！',
             icon: 'none',
             duration: 2000//持续的时间
           })
         }
         else{
           wx.getStorage({
             key: 'openid',
             success: function (res) {
               //连接mysql数据库 传送数据
               wx.request({
                 url: 'https://www.baoming.site/Jeff/createMatch',
                 data: {
                   match_theme: that.data.match_theme,
                   match_time: that.data.match_time,
                   match_week: that.data.match_week,
                   deadline_time: that.data.deadline_time,
                   deadline_week: that.data.deadline_week,
                   match_address: that.data.match_address,
                   match_rule: that.data.match_rule,
                   match_directions: that.data.match_directions,
                   match_people: that.data.match_people,
                   openid: res.data,
                   longitude: getApp().globalData.longitude,
                   latitude: getApp().globalData.latitude

                 },
                 method: 'GET',
                 header: {
                   'content-type': 'application/json' // 默认值
                 },
                 success: function (res) {
                   console.log("敏感词检测:",res);
                   if (res.data != 0) {
                     wx.showToast({
                       title: '含有敏感词汇！',
                       icon: 'none',
                       duration: 2000//持续的时间
                     })                  
                   }else{
                     console.log("创建比赛成功，将此比赛写入数据库：", res.data);
                     wx.navigateTo({
                       url: '../index/index'
                     })
                     wx.showToast({
                       title: '创建成功！',
                       icon: 'success',
                       duration: 2000//持续的时间
                     })
                   }
                   },
                 fail: function (res) {
                   console.log(".....fail.....");
                   //成功后才界面的跳转

                 }
               })
             },
              fail: function (res){
               console.log("用户未登录成功");
                   //成功后才界面的跳转
             }
           })
            
         
         }                
    },


    //地图的位置选择,选择后将值赋值给match_address
    chooseLocation: function (e) {
      var that = this;
      var app = getApp();
      wx.chooseLocation({
        
        success: function (res) {
          
          console.log(res);
          app.globalData.latitude = res.latitude;
          app.globalData.longitude=res.longitude;
          that.setData({
            match_address: res.name,
          })

        },
        fail:function(res){
          console.log("地图调用失败",res)
          wx.getSetting({
            success: function (res) {
              var statu = res.authSetting;
              if (!statu['scope.userLocation']) {
                wx.showModal({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                  success: function (tip) {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: function (data) {
                          if (data.authSetting["scope.userLocation"]!=false) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'success',
                              duration: 1000
                            }),
                            //授权成功之后，再调用chooseLocation选择地方
                            wx.chooseLocation({
                              success: function (res) {
                                obj.setData({
                                  addr: res.address
                                })
                              },
                            })
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'success',
                              duration: 1000
                            })
                          }
                        }
                      })
                    }
                  },fail:function(res){
                    console.log("地图再次调用失败：",res)
                  }
                })
              }
        }

      })
    },



    
      })
    
  }
  })
