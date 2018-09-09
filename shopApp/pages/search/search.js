import {ip} from '../ip.js'
Page({
  data: {
    value: '',
    wareList:[],
    ip
  },

  changeinput(event) {
    this.setData({ value: event.detail })
  
  },
  onSearch() {
    wx.request({
      url: ip + '/get_commodityData',
      data: { name: this.data.value },
      success: (res) => {
        if (res.data.length > 0) {
          this.setData({ wareList: res.data })
        }
      }
    })
  },
  // 点击商品名称跳转到对应的商品类型
  jumpWareMsg(e){
    let value = e.currentTarget.dataset.item.type
    wx.navigateTo({
      url: `../classify2/classify2?str=${value}`
    })
  }












})