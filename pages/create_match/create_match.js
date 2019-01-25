var app=getApp();
Page(
  {
    //设置变量，以便存储输入的数据
    data:{
        match_theme:'',
        match_time:'',
        match_week:'',
        match_address:'',
        match_address_name:'',
        match_rule:'',
        match_color:'',
        match_remarks:'',
       match_directions:'',
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
    
    // 活动详情文本框及字数限制
    limit: function (e) {
      var value = e.detail.value;
      var length = parseInt(value.length);  
      if (length > this.data.noteMaxLen) {
        return;
      }

      this.setData({
        current: length,
        match_directions:e.detail.value
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


   //备注
    match_remarks_input: function (e) {
      this.setData({
        match_remarks: e.detail.value
      })
    },
       //点击按钮，将值传给后端
       create_button: function (e) {
         var that=this;
         var app=getApp();
         //判断主题时间地址是否填写，进行逻辑交互处理
         if (that.data.match_theme == "" || that.data.match_time == "" || that.data.match_address == "") {
           wx.showToast({
             title: '主题时间地点不能为空！',
             icon: 'none',
             duration: 2000//持续的时间
           })
         }
         else{
         //获取发布人信息
         wx.getStorage({
           key: 'userInfo',
           success: function(res) {

             console.log("user_name", res.data.nickName);
             console.log("user_url", res.data.avatarUrl);

             //连接mysql数据库 传送数据
             wx.request({
               url: 'http://192.168.0.105:8080/Jeff/MyServlet?method=storage',
               data: {
                 match_theme: that.data.match_theme,
                 match_time: that.data.match_time,
                 match_week: that.data.match_week,
                 match_address: that.data.match_address,
                 match_address_name: that.data.match_address_name,
                 match_rule: that.data.match_rule,
                 match_directions: that.data.match_directions,
                 match_remarks: that.data.match_remarks,
                 //发布人的名字和头像
                 user_name: res.data.nickName,
                 user_url: res.data.avatarUrl,
                 openid: getApp().globalData.openid,
                 longitude: getApp().globalData.longitude,
                 latitude: getApp().globalData.latitude

               },
               method: 'GET',
               header: {
                 'content-type': 'application/json' // 默认值
               },
               success: function (res) {
                 console.log("创建比赛成功，将此比赛写入数据库：",res.data);
                 wx.navigateTo({
                   url: '../index/index'
                 })
               },
               fail: function (res) {
                 console.log(".....fail.....");
                 //成功后才界面的跳转
               
               }
             })
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
