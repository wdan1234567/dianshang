import { ip } from '../ip.js'
Page({
  data: {
    ip,
    wareMsg: {},
    sale: 0,
    collect_status: true,
    head: ['商品', '详情', '推荐'],
    shopitem: '商品',
    huobi: 0,
    tuijian: [],
    toView: 'shangping',
    islogin: false,
    userMsg: {},
    numAll:''

  },
  onLoad: function (option) {
    this.getData(option.id)
    //判断用户是否登录
    wx.getStorage({
      key: "checkLogin",
      success: (res) => {
        this.setData({
          islogin: res.data.status,
        })
        // 如果用户已登录
        if (res.data.status) {
          //发送请求获取用户所有的数据
          wx.request({
            url: ip + '/login',
            method: 'post',
            data: { _id: res.data._id },
            success: (msg) => {
              let sum=0
              for (let i = 0; i < msg.data.shopping_cart.length;i++){
                sum += msg.data.shopping_cart[i].num
              }
          
              this.setData({
                userMsg: msg.data,
                numAll: sum
              })
            }
          })
        }
     }
  })

  },
  getData(type) {
    wx.request({
      url: ip + '/get_commodityData',
      data: { _id: type },
      success: (res) => {
        let huobi = parseInt(res.data.activity_price / 2)
        this.setData({ wareMsg: res.data, huobi });
        this.getTuijian(res.data.type)
        console.log(res.data)
      }
    })
  },
  getTuijian(type) {
    wx.request({
      url: ip + '/get_commodityData',
      data: { type },
      success: (res) => {
        if (res.data.length > 3) {
          res.data = res.data.slice(0, 3)
        }
        this.setData({ tuijian: res.data });

      }
    })
  },
  // 点击推荐更换信息
  tuijianFun(e) {
    this.setData({ wareMsg: e.target.dataset.item });

  },

  collect_function() {
    this.setData({ collect_status: false });
  },
  collect2_function() {
    this.setData({ collect_status: true });
  },
  //二级标题被选中变色
  checkItem: function (e) {
    var classify = e.currentTarget.dataset.classify; //选中标签时的文本值
    this.setData({
      shopitem: classify,
    })
    if (classify === '商品') {
      this.setData({
        toView: 'shangping'
      })
    }
    else if (classify === '详情') {
      this.setData({
        toView: 'msg'
      })
    }
    else if (classify === '推荐') {
      this.setData({
        toView: 'tuijian'
      })
    }

  },
  // 点击加入购物车
  jionShopCar() {
 
    if (this.data.islogin){
          // 再将用户添加的商品更新到user的commity字段中

      let user = this.data.userMsg;
      let userId = user._id;//用户的信息
      let goods_id = this.data.wareMsg._id; //此商品的id
      let wareImg = this.data.wareMsg.images[0]; //此商品的图片
      let describe = this.data.wareMsg.describe; //此商品的描述
      let price = this.data.wareMsg.activity_price - 0; //此商品的价格
      let name = this.data.wareMsg.name; //此商品的名称
      let store_id = this.data.wareMsg.store; //此商品的对象店铺的id
      wx.request({
        url: ip + '/login',
        method: 'post',
        data: { _id: userId },
        success: (res) => {
          let shopping_cart = [...res.data.shopping_cart, {
            "goods_id": goods_id, "num": 1, "imgs": wareImg, "describe": describe, "price": price, "name": name, "store_id": store_id, "singleSlect": false
          }]
          // 添加商品的id到res.data的commodity集合中
          let commodity = [...res.data.commodity, goods_id];
          // 先判断用户是否已经收藏过该商品，如果没有收藏在push，否则只修改商品的数量
          for (let i = 0; i < res.data.shopping_cart.length; i++) {
            if (res.data.shopping_cart[i].goods_id === goods_id) {
              res.data.shopping_cart[i].num = res.data.shopping_cart[i].num + 1;
              console.log(res.data.shopping_cart[i].num, 's数量');
              shopping_cart = res.data.shopping_cart;
              commodity = res.data.commodity;
              break;
            }
          }
          console.log(shopping_cart, commodity, '····更改用户的数据');
          wx.request({
            url: ip + '/addShopWare',
            method: 'post',
            data: { _id: userId, shopping_cart, commodity },
            success: (msg) => {
              console.log(msg.data, '更改用户的数据');
             
              this.setData({ numAll: this.data.numAll+1})



              // 再将用户添加的商品更新到user的commity字段中
            }
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  //点击购物车跳转至购物车页面
  jumpShopCar(){
    if (this.data.islogin){
      wx.switchTab({
        url: '../shopcart/shopcart',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
   

   
  }






})