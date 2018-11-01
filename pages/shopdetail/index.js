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
    address: '',
    distance: '', // 我的位置 到 店铺 的距离
    hasLocationAuth: true
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
        // 逆向位置解析 https://lbs.qq.com/qqmap_wx_jssdk/method-reverseGeocoder.html
        return Promise.all([
          qqmapsdk.reverseGeocoder({location}),
          this._getLocation(location),
          location
        ])
      })
      .then(([shopAddress, myLocation, toLocation]) => {
        if (shopAddress.status === 0) {
          this.setData({
            address: shopAddress.result.address
          })
        }
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
    let { info } = this.data;
    let arr = Object.keys(info)
    if (arr.length) {
      this._getLocation({
        latitude: info.lat,
        longitude: info.lng
      })
    }
  },

  _getLocation(toLocation) {
    return api.getLocation({ type: 'gcj02' })
      .then(myLocation => {
        this.setData({
          hasLocationAuth: true
        })
        let from = {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude
        }

        // 计算距离api https://lbs.qq.com/qqmap_wx_jssdk/method-calculatedistance.html
        return qqmapsdk.calculateDistance({
          from,
          to: [{
            latitude: 30.04 + Math.random() / 10,
            longitude: 119.96 + Math.random() / 10
          }]
        })
      })
      .then(res => {
        if (res.status === 0) {
          this.setData({
            distance: res.result.elements[0].distance
          })
        }
      })
      .catch(e => {
        if (e.errMsg === 'getLocation:fail auth deny') {
          this.setData({
            hasLocationAuth: false
          })
        }

        if (e.status) {
          this.setData({
            distance: -1
          })
        }
      })
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