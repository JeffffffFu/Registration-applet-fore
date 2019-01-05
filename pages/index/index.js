var id='';
var openid='';
Page({
 //创建变量，接受create_match界面传的值
  data:{
    list_index:[],
    openid:'',
icon_registered:'https://thumbnail0.baidupcs.com/thumbnail/404ee9eae918fd5d21a7d2775eef36cb?fid=944833296-250528-49865518209648&time=1546596000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-CK1QNYhzIQG7SgqwR1aSboAHhl8%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=87504471353756648&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video',
    icon_leaved:'https://thumbnail0.baidupcs.com/thumbnail/1d48ee5c07b0b70f716b4447cade9be0?fid=944833296-250528-1096020932026446&time=1546596000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-C5R7pnuBfJbCLktLKQKQr%2FuRhuE%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=87496818542456679&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video',
    icon_expired:'https://thumbnail0.baidupcs.com/thumbnail/c92900daaa67b49360340e10e27448f8?fid=944833296-250528-51577035687204&time=1546596000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-O7DMiM4C2ka3Y%2BQSyvFdYV1ouvo%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=87412342639355724&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video' ,  
    icon_toSignUp:'https://thumbnail0.baidupcs.com/thumbnail/61ff4b4fcf95fb65e3bfab962ba4f365?fid=944833296-250528-336512684613942&time=1546596000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-3r2M4dUhDc1X7H4U6hCRMUJQ%2Fog%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=87459223406512099&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video',
  },
 //加载界面时，获取全局变量并赋值给本界面的list_index变量
  onShow:function(options){

        var that=this;
       var app=getApp();
    //连接mysql数据库 传送数据
    app.callback().then(res=>{
      wx.request({
        url: 'http://192.168.0.145:8080/Jeff/MyServlet?method=take',
        data: {
          openid: app.globalData.openid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("加载想要获取的数据：", res.data);
          //从服务器端获取到的数据，将数据赋值给list数组
          that.setData({
            list_index: res.data
          })
        },
        fail: function (res) {
          console.log(".....fail.....");
        }
      })
    });

   
  },

  create: function () {
    wx.navigateTo({
      url: '../create_match/create_match'
    })
    console.log('跳转成功')
  }
 

  
})
