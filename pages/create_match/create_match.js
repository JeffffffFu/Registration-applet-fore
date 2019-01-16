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
        user_nickName: "微信账号登录",
        user_avatarUrl: "./user-unlogin.png",
        openid:'',
        aa:true,
        bb:true,
        cc:true,
      items: [
        { name: '11人制', value: '11人制' },
        { name: '9人制', value: '9人制' },
        { name: '7人制', value: '7人制', checked: 'true' },
        { name: '5人制', value: '5人制' },
      ]
       
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

    //队服颜色
    match_color_input: function (e) {
      this.setData({
        match_color: e.detail.value
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
         if (that.data.match_theme == "undefined" || that.data.match_theme == null || that.data.match_theme == "") {
           that.setData({
             aa: false
           })
         } else if (that.data.match_time == "undefined" || that.data.match_time == null || that.data.match_time == "") {
           that.setData({
             bb: false
           })
         } else if (that.data.match_address == "undefined" || that.data.match_address == null || that.data.match_address == "") {
           that.setData({
             cc: false
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
               url: 'http://120.79.11.31:8080/Jeff/MyServlet?method=storage',
               data: {
                 match_theme: that.data.match_theme,
                 match_time: that.data.match_time,
                 match_week: that.data.match_week,
                 match_address: that.data.match_address,
                 match_address_name: that.data.match_address_name,
                 match_rule: that.data.match_rule,
                 match_color: that.data.match_color,
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

        }

      })
    },



    //单选按钮组
    choose1: function () {
      this.setData({
        match_rule: '11人制'
      })
    },
    choose2: function () {
      this.setData({
        match_rule: '9人制'
      })
    },
    choose3: function () {
      this.setData({
        match_rule: '7人制'
      })
    },
    choose4: function () {
      this.setData({
        match_rule: '5人制'
      })
    }
  }
)
