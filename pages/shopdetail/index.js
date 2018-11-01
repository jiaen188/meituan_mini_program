const req = require('../../helper/req')
const api = require('../../helper/apis')

// 文档地址 https://lbs.qq.com/qqmap_wx_jssdk/index.html
const qqmapsdk = new api.createQQMap();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    req.getShopDetail(options.id)
      .then(res => {
        if (!res.error) {
          this.setData({
            info: res.info
          })
          return {
            latitude: res.info.lat,
            longitude: res.info.lng
          }
        } else {
          throw '获取商铺详情失败'
        }
      })
      .then(location => {
        return qqmapsdk.reverseGeocoder(location)
      })
      .then(res => {
        if (res.status === 0) {
          this.setData({
            address: res.result.address
          })
        }
        console.log(res)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})