var app = getApp();
var icon = require('../../icon/icon.js');
Page({
  //设置变量，以便存储输入的数据
  data: {
    match_theme: '',
    match_time: '',
    match_week: '',
    match_address: '',
    match_address_name: '',
    match_rule: '',
    match_directions: '',
    match_people: '',
    join_count: '',
    match_remarks: '',
    uuid: '',
    openid: '',
    icon_map: '',
    longitude: '',
    latitude: '',
    edit_list: [],
    current: 0,
    max: 100,
    height: 0,
  },

  limit: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }

    this.setData({
      current: length,
      match_directions: e.detail.value
    });
  },

  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '编辑活动'
    })
    this.setData({
      icon_map: icon.icon_map,
      edit_list: JSON.parse(option.information_list),//接上个界面传来的数据
      match_theme: JSON.parse(option.information_list).theme,
      match_address: JSON.parse(option.information_list).address,
      match_time: JSON.parse(option.information_list).time,
      match_week: JSON.parse(option.information_list).week,
      match_directions: JSON.parse(option.information_list).directions,
      match_people: JSON.parse(option.information_list).people,
      join_count: option.join_count,
      match_rule: JSON.parse(option.information_list).rule,
      uuid: JSON.parse(option.information_list).uuid,
      longitude: JSON.parse(option.information_list).longitude,
      latitude: JSON.parse(option.information_list).latitude,
      height: getApp().globalData.winHeight - 120,
    })
    app.globalData.time = JSON.parse(option.information_list).time;
    app.globalData.week = JSON.parse(option.information_list).week;
    console.log("edit:", this.data.edit_list);
    // console.log("people:", this.data.match_people);
    console.log("match_time:", this.data.match_time);
    console.log("match_week:", this.data.match_week);
  },
  //点击按钮，将值传给后端
  save_match: function (e) {
    var that = this;
    var app = getApp();
    // console.log('match_people:',that.data.match_people)
    // console.log('match_people2:',that.data.join_count)
    console.log('week:', that.data.match_week)
    console.log('time', that.data.match_time)
    //判断主题时间地址是否填写，进行逻辑交互处理
    if (that.data.match_theme == "" || that.data.match_time == "" || that.data.match_address == "") {
      wx.showToast({
        title: '主题时间地点不能为空！',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
    else {
      if (!getApp().globalData.isdate2) {
        wx.showToast({
          title: '所选时间早于当前！',
          icon: 'none',
          duration: 2000//持续的时间
        })
      }
      else {
        if (that.data.match_people != '' && parseInt(that.data.match_people) < parseInt(that.data.join_count)) {
          wx.showToast({
            title: '人数限制不得低于当前报名人数！',
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
        else {

          //连接mysql数据库 传送数据
          wx.request({
            url: 'https://www.baoming.site/Jeff/updateMatch',
            data: {
              match_theme: that.data.match_theme,
              match_time: that.data.match_time,
              match_week: that.data.match_week,
              match_address: that.data.match_address,
              match_rule: that.data.match_rule,
              match_directions: that.data.match_directions,
              match_people: that.data.match_people,
              match_remarks: that.data.match_remarks,
              uuid: that.data.uuid,
              openid: wx.getStorageSync("openid"),
              longitude: that.data.longitude,
              latitude: that.data.latitude

            },
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              getApp().globalData.sign = 2;
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
      }
    }

  },
  //点击删除该比赛记录
  delete_match: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.baoming.site/Jeff/deleteMatch',
      data: {
        uuid: that.data.uuid,
        openid: wx.getStorageSync("openid"),

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
    console.log("选择time:", e.detail)//选择结果值,这里的函数来源于date2.js。下拉选择器选择了什么则传入什么值，这边将time和week拆开
    // console.log("选择match_time:", e.detail[0])
    // console.log("选择match_week:", e.detail[1])
    if (e.detail[0] != 2) {
      this.setData({
        match_time: e.detail[0],
        match_week: e.detail[1]
      })
    }

    // getApp().globalData.time=e.detail[0]
    //  getApp().globalData.match_week=e.detail[1]

  },

  //人数限制
  match_people_input: function (e) {
    console.log('people');
    this.setData({
      match_people: e.detail.value
    })
  },

  //地图
  chooseLocation: function (e) {
    var that = this;
    var app = getApp();
    wx.chooseLocation({

      success: function (res) {

        console.log(res);
        that.setData({
          match_address: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })

      }

    })
  },

})