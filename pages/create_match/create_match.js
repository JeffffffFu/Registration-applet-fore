

//时间选择器相关变量
const minutes = ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
var openid='';
//获取年
for (let i = 2018; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}


Page(
  {
    //设置变量，以便存储输入的数据
    data:{
        match_theme:'',
        match_time:'',
        match_address:'',
        match_address_name:'',
        match_rule:'',
        match_color:'',
        match_people:'',
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
      ],
       
       //时间选择器
      time: '',
      multiArray: [years, months, days, hours, minutes],
      multiIndex: [0, 9, 16, 10, 5],
      choose_year: '',
       
      //单选按钮
      isChecked1: false,
      isChecked1: false,
      isChecked1: false,
      isChecked1: false,
     
    },
    
    //将输入文本框的值，分别赋值给变量
     match_theme_input:function(e){
      this.setData({
        match_theme: e.detail.value
      })
    },

    match_time_input: function (e) {
      this.setData({
        match_time: e.detail.value
      })
    },

   
    match_color_input: function (e) {
      this.setData({
        match_color: e.detail.value
      })
    },


    match_remarks_input: function (e) {
      this.setData({
        match_remarks: e.detail.value
      })
    },

    radioChange: function (e) {
      this.setData({
        match_rule: e.detail.value
      })
    },
       //点击按钮，将获取到的值赋值给数组
       create_button: function (e) {
         var app=getApp();
         var that=this;
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
         //获取Storage变量，并将全局变量进行赋值
          wx.getStorage({
           key: 'openid',
           success: function (res) {
             app.globalData.openid = res.data; //赋值给app.js变量
             that.setData({
               openid: res.data
             })
             console.log("app.openid:",app.globalData.openid);
           }
           })
         //获取发布人信息
         wx.getStorage({
           key: 'userInfo',
           success: function(res) {

             console.log("user_name", res.data.nickName);
             console.log("user_url", res.data.avatarUrl);

             //连接mysql数据库 传送数据
             wx.request({
               url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=storage',
               data: {
                 match_theme: that.data.match_theme,
                 match_time: that.data.match_time,
                 match_address: that.data.match_address,
                 match_address_name: that.data.match_address_name,
                 match_rule: that.data.match_rule,
                 match_color: that.data.match_color,
                 match_people: that.data.match_people,
                 match_remarks: that.data.match_remarks,
                 //发布人的名字和头像
                 user_name: res.data.nickName,
                 user_url: res.data.avatarUrl,
                 openid:that.data.openid

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
      wx.chooseLocation({

        success: function (res) {

          console.log(res)
          that.setData({
            match_address: res.name
          })

        }

      })
    },


    //时间选择器
    //获取时间日期
    bindMultiPickerChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })
      const index = this.data.multiIndex;
      const year = this.data.multiArray[0][index[0]];
      const month = this.data.multiArray[1][index[1]];
      const day = this.data.multiArray[2][index[2]];
      const hour = this.data.multiArray[3][index[3]];
      const minute = this.data.multiArray[4][index[4]];
      // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
      this.setData({
        match_time: year + '-' + month + '-' + day + '  ' + hour + ':' + minute
      })
      // console.log(this.data.match_time);
     },

    //监听picker的滚动事件
    bindMultiPickerColumnChange: function (e) {
      //获取年份
      if (e.detail.column == 0) {
        let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
        console.log(choose_year);
        this.setData({
          choose_year
        })
      }
      //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      if (e.detail.column == 1) {
        let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
        let temp = [];
        if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
          for (let i = 1; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
          for (let i = 1; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else if (num == 2) { //判断2月份天数
          let year = parseInt(this.data.choose_year);
          console.log(year);
          if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
            for (let i = 1; i <= 29; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i);
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          } else {
            for (let i = 1; i <= 28; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i);
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          }
        }
        console.log(this.data.multiArray[2]);
      }
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      this.setData(data);
    },
    
    //单选按钮组
    choose1: function () {
      this.setData({
        isChecked1: true,
        isChecked2: false,
        isChecked3: false,
        isChecked4: false,
        match_rule: '11人制'

      })

    },
    choose2: function () {
      this.setData({
        isChecked1: false,
        isChecked2: true,
        isChecked3: false,
        isChecked4: false,
        match_rule: '9人制'
      })
    },
    choose3: function () {
      this.setData({
        isChecked1: false,
        isChecked2: false,
        isChecked3: true,
        isChecked4: false,
        match_rule: '7人制'
      })
    },
    choose4: function () {
      this.setData({
        isChecked1: false,
        isChecked2: false,
        isChecked3: false,
        isChecked4: true,
        match_rule: '5人制'
      })
    }
  }
)
