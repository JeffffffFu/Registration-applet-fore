
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registration_member:[],
    registration_count:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      registration_member: JSON.parse(options.registration_member),
      registration_count:options.registration_count
    })
  console.log("member:",this.data.registration_member);
  },

  onShareAppMessage: function () {

  }
})