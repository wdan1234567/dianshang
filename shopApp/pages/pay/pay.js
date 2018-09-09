import {ip} from '../ip.js'
Page({
  data: {
  ip,
  wareList:[],
  num:''
  },

  onLoad: function (options) {
    let value = JSON.parse(options.value)
    // console.log(value) 
    let sum = 0;
    //计算价格
    for (let i = 0; i < value.length;i++){
      sum += (value[i].content.price - 0) * (value[i].content.num - 0);
    }
    this.setData({ wareList: value, num: sum})



  },

})