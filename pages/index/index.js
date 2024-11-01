"use strict";
// 引入必要的模块
const common_vendor = require("../../common/vendor.js"); // 通用工具模块
const utils_apartment_index = require("../../utils/apartment/index.js"); // 村内相关信息
const utils_pics_index = require("../../utils/pics/index.js"); // 村落照片信息

const _sfc_main = {
  data() {
    return {
      partname: "", // 存储村里名称
      src: [], // 存储图片数组
      indicatorDots: true, // 是否显示指示点
      autoplay: true, // 是否自动播放轮播图
      interval: 2000, // 轮播图切换间隔（2000毫秒）
      duration: 500, // 切换动画持续时间（500毫秒）
      etc: false, // 控制跳转逻辑的布尔值
      currentPage: "index", // 当前页面状态，默认为首页
      activeTabbar: 0 // tabBar 当前激活的 tab 索引
    };
  },
  methods: {
    GotoOrder(data) {
      if (this.etc !== true) {
        common_vendor.index.navigateTo({
          url: `/pages/Order/Order?com=${this.partname[data - 1]}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/demo/demo?url=" + this.src[data - 1] + "&title=" + this.partname[data - 1]
        });
      }
    },
    // 页面切换逻辑
    switchPage(page) {
      console.log("切换页面状态:", page);
      this.currentPage = page;

      if (page === "index") {
        console.log("切换到首页页面");
        common_vendor.index.switchTab({
          url: "/pages/index/index" // 切换到首页
        });
      } else if (page === "info") {
        console.log("切换到信息页面");
        common_vendor.index.switchTab({
          url: "/pages/info/info" // 切换到信息页面
        });
      } else {
        console.log("未知的页面:", page);
      }
    },
    // 处理 tabBar 切换事件
    onChangeTabbar(event) {
      console.log("Tabbar 切换事件触发，索引:", event.detail);
      this.activeTabbar = event.detail;
      switch (this.activeTabbar) {
        case 0:
          this.switchPage("index");
          break;
        case 1:
          this.switchPage("info");
          break;
        default:
          console.log("未知的 Tabbar 索引:", this.activeTabbar);
      }
    }
  },
  mounted() {
    this.partname = utils_apartment_index.community;
  },
  onLoad() {
    let that = this;
    common_vendor.wx$1.cloud.init({
      env: "leicl-1g9qxala1d04e6d7" // 云开发环境id
    });
    this.src = utils_pics_index.Pics;
    common_vendor.index.request({
      url: "",
      success(res) {
        console.log(res);
        if (res.data == 1) {
          that.etc = true; // 根据请求结果设置 etc 状态
        }
      }
    });
  },
  onShareAppMessage() {
    // 用户点击右上角分享
  }
};

if (!Array) {
  const _component_van_grid_item = common_vendor.resolveComponent("van-grid-item");
  const _component_van_grid = common_vendor.resolveComponent("van-grid");
  const _component_van_tabbar = common_vendor.resolveComponent("van-tabbar");
  const _component_van_tabbar_item = common_vendor.resolveComponent("van-tabbar-item");
  (_component_van_grid_item + _component_van_grid + _component_van_tabbar + _component_van_tabbar_item)();
}

// 渲染函数
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.src, (item, k0, i0) => {
      return {
        a: item,
        b: item
      };
    }),
    b: $data.indicatorDots,
    c: $data.autoplay,
    d: $data.interval,
    e: $data.duration,
    f: common_vendor.f(6, (item, k0, i0) => {
      return {
        a: $data.src[item - 1],
        b: common_vendor.t($data.partname[item - 1]),
        c: item,
        d: common_vendor.o(($event) => $options.GotoOrder(item), item),
        e: "aea7e334-1-" + i0 + ",aea7e334-0"
      };
    }),
    g: common_vendor.p({
      useSlot: true
    }),
    h: common_vendor.p({
      columnNum: "3",
      gutter: "2",
      border: false
    }),
    // Tabbar 组件
    i: common_vendor.o($options.onChangeTabbar),
    j: $data.activeTabbar,
    k: common_vendor.p({
      active: $data.activeTabbar,
      "active-color": "#07c160"
    }),
    l: common_vendor.p({
      icon: "home-o",
      text: "首页"
    }),
    m: common_vendor.p({
      icon: "user-o",
      text: "信息"
    })
  };
}

// 创建页面
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/app/sd1.3/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
