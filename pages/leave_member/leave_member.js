
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leave_member: [],
    leave_count: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      leave_member: JSON.parse(options.leave_member),
      leave_count: options.leave_count
    })
    console.log("member:", this.data.leave_member);
  },

  onShareAppMessage: function () {

  }
})