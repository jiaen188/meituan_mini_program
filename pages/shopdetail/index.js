const req = require('../../helper/req')
const api = require('../../helper/apis')

// 文档地址 https://lbs.qq.com/qqmap_wx_jssdk/index.html
const qqmapsdk = new api.createQQMap();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopID: '', // 商铺的 id
    favID: '', // 收藏的 id
    info: {},
    address: '',
    distance: '', // 我的位置 到 店铺 的距离
    hasLocationAuth: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopID: options.id
    })
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

    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      console.log(userInfo, '有')
      req.checkFav({
        open_id: userInfo.openId,
        article_id: this.data.shopID
      })
      .then(res => {
        console.log('res收藏', res)
        if (res.code === 0) {
          this.setData({
            favID: res.fav_id
          })
        }
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

  onTapFav() {
    let userInfo = wx.getStorageSync('userInfo')

    if(!userInfo) {
      wx.navigateTo({ url: '/pages/login/index' })
      return;
    }

    let {openId} = userInfo

    let { favID, shopID } = this.data

    if (favID) {
      req.delFav({
        open_id: openId,
        article_id: shopID,
        fav_id: favID
      })
      .then(res => {
        console.log('取消收藏的结果', res)
        if (res.code === 0) {
          this.setData({
            favID: ''
          })
        }
      })
    } else {
      req.addFav({
        open_id: openId,
        article_id: shopID
      })
      .then(res => {
        console.log('添加收藏的结果', res)
        if (res.code === 0) {
          this.setData({
            favID: res.fav_id
          })
        }
      })
    }
  }
})