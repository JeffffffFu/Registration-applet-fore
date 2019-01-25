var icon = require('../../icon/icon.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_authorization:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      icon_authorization:icon.icon_authorization
    })
  },
  bindGetUserInfo: function (e){
    if (e.detail.userInfo) {
      getApp().globalData.userInfo = e.detail.userInfo;
      wx.setStorage({//这是个异步方法，进行存储数据
        key: 'userInfo',
        data: e.detail.userInfo,
      });
      //判断如果是分享传进来的（用sign_share来判断），则跳转到比赛界面，并传入相应的值
       if (getApp().globalData.sign_share==1){
        wx.navigateTo({
          url: '../match_information/match_information?uuid='+ getApp().globalData.uuid+'&time='+getApp().globalData.match_time
        })

      }else{
        wx.redirectTo({
          url: '../index/index?backType=mine'
        })
      }
     
    }else{
      wx.showToast({
        title: '您拒绝了微信授权！',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
  },
  back:function(){
    wx.redirectTo({
      url: '../authorization/authorization'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})