
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registration_member:[],
    registration_count:'',
    match_people:'',
     people_view:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '报名详情'
    })
    this.setData({
      registration_member: JSON.parse(options.registration_member),
      registration_count:options.registration_count,
      match_people:options.match_people,
    })
    if(this.data.match_people!=''){
      this.setData({
        people_view:true
      })
    }
  console.log("member:",this.data.registration_member);
    console.log("member:", this.data.people_view);
  },

  onShareAppMessage: function () {

  }
})