var util = require('../utils/util.js');
var icon = require('../../icon/icon.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList: [],
    hours: [],
    minutes: [],
    date: {},
    hour: {},
    minute: {},
    todayhour: "",
    todayminutes: "",
    showselect: false,
    isdate: true,
    icon_right:'',
    icon_down:'',
  },

  ready: function () {
    let dateList = this.getDates(100);
    const date = new Date()
    const hours = []
    const minutes = ['00','10','20' ,'30','40','50']
    var todayMinutes = parseInt(date.getMinutes());
    var todayhour = (todayMinutes >= 30 ? (date.getHours() + 1) : date.getHours());//当前时
    var newtodayMinutes = todayMinutes < 30 ? '30' : '00';//当前分
    for (let i = 1; i <= 23; i++) {
      hours.push(i)
    }
    this.setData({
      dateList: dateList,
      hours: hours,
      minutes: minutes,
      todayhour: todayhour,
      todayminutes: newtodayMinutes,
      icon_right:icon.right,
      icon_down: icon.down,     
    })
    var selected = dateList[0].year + "-" + dateList[0].newdates + "\t" + ((todayhour >= 10) ? todayhour : ("0" + todayhour)) + ":" + newtodayMinutes;
    var myEventDetail = {
      selected: selected,
    }
    this.triggerEvent('bindSelect', myEventDetail);
    console.log("icon:",this.data.icon_right)
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //触发日期选择弹出框
    showDate: function () {
      if (this.data.showselect) {
        var showselect=false
      } else {
        var showselect = true
      }
      this.setData({
        showselect: showselect
      })
    },

    //选择值
    bindChange: function (e) {
      const val = e.detail.value;
      this.setData({
        date: this.data.dateList[val[0]],
        hour: this.data.hours[val[1]],
        minute: this.data.minutes[val[2]]
      })
      var dates = this.data.dateList[val[0]]
      //时间比较
      var selected2 = dates.year + "-" + dates.newdates + " " + ((this.data.hours[val[1]]) < 10 ? ("0" + (this.data.hours[val[1]])) : (this.data.hours[val[1]])) + ":" + this.data.minutes[val[2]]//选择时间
      var selected3=dates.week
      var selected4=new Array(selected2,selected3)
      var todate = this.getCurrentMonthFirst() + "\t" + this.data.todayhour + ":" + this.data.todayminutes;
      this.setData({
        isdate: util.compareDate(selected2, todate)
      })
      getApp().globalData.isdate = util.compareDate(selected2, todate);
      this.triggerEvent('bindSelect', selected4);
 
  
    },

    /**
     * 获取d当前时间多少天后的日期和对应星期
     * //todate默认参数是当前日期，可以传入对应时间
     */
    getDates: function (days, todate = this.getCurrentMonthFirst()) {
      var dateArry = [];
      for (var i = 0; i < days; i++) {
        var dateObj = util.dateLater(todate, i);
        dateArry.push(dateObj)
      }
      return dateArry;
    },

    //获取当前时间
    getCurrentMonthFirst: function () {
      var date = new Date();
      var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
      return todate;
    }
  }
})
