var app=getApp();

Page({
//设置变量，以便存储输入的数据
    data: {
    match_theme: '',
    match_time: '',
    match_week:'',
    match_address: '',
    match_address_name: '',
    match_rule: '',
    match_color: '',
    match_remarks: '',
    uuid:'',
    openid: '',
    edit_list:[],
    aa: true,
    bb: true,
    cc: true,
    items: [
      { name: '11人制', value: '11人制' },
      { name: '9人制', value: '9人制' },
      { name: '7人制', value: '7人制', checked: 'true' },
      { name: '5人制', value: '5人制' },
    ],

  },
    
  onLoad: function (option){
    this.setData({
      edit_list: JSON.parse(option.information_list),//接上个界面传来的数据
      match_theme: JSON.parse(option.information_list).theme,
      match_address: JSON.parse(option.information_list).address,
      match_color: JSON.parse(option.information_list).color,
      match_remarks: JSON.parse(option.information_list).remarks,
      match_rule: JSON.parse(option.information_list).rule,
      uuid: JSON.parse(option.information_list).uuid,
      longitude:JSON.parse(option.information_list).longitude,
      latitude: JSON.parse(option.information_list).latitude,
    })
    app.globalData.time = JSON.parse(option.information_list).time;
    console.log("edit:",this.data.edit_list)
  
},
  //点击按钮，将值传给后端
  save_match: function (e) {
    var that = this;
    var app = getApp();
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
    else {

          //连接mysql数据库 传送数据
          wx.request({
            url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=edit_match',
            data: {
              match_theme: that.data.match_theme,
              match_time: that.data.match_time,
              match_week:that.data.match_week,
              match_address: that.data.match_address,
              match_address_name: that.data.match_address_name,
              match_rule: that.data.match_rule,
              match_color: that.data.match_color,
              match_remarks: that.data.match_remarks,
              uuid:that.data.uuid,
              openid: getApp().globalData.openid,
              longitude: that.data.longitude,
              latitude: that.data.latitude

            },
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              getApp().globalData.sign=2;
              wx.showToast({
                title: '成功保存',
                icon: 'success',
                duration: 2000//持续的时间

              })
              console.log("修改比赛成功，将此比赛写入数据库：", res.data);
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
  },
  //点击删除该比赛记录
  delete_match:function(e){
    var that = this;
    wx.request({
      url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=delete_match',
      data: {
        uuid: that.data.uuid,
        openid: getApp().globalData.openid,

      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        getApp().globalData.sign = 1;
        console.log("删除比赛成功：", res.data);
        wx.showToast({
          title: '成功删除',
          icon: 'success',
          duration: 2000//持续的时间

        })
        wx.navigateTo({
          url: '../index/index'
        })
      },
      fail: function (res) {
        console.log(".....fail.....");
        //成功后才界面的跳转

      }
    })
  },
  //比赛主题
  match_theme_input: function (e) {
    this.setData({
      match_theme: e.detail.value
    })
  },

  //获取时间日期
  bindSelect: function (e) {
    console.log(e.detail)//选择结果值
    this.setData({
      match_time: e.detail[0],
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

  //地图
  chooseLocation: function (e) {
    var that = this;
    var app = getApp();
    wx.chooseLocation({

      success: function (res) {

        console.log(res);
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
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
})