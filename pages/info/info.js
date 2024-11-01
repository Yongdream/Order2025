"use strict"; // 启用严格模式
// 引入必要的模块
const common_vendor = require("../../common/vendor.js");

const _sfc_main = {
  data() {
    return {
      title: "信息页面", // 页面标题
      infoList: [
        { key: "名称", value: "示例村落" },
        { key: "位置", value: "浙江省杭州市" },
        { key: "人口", value: "500人" },
        { key: "特色", value: "依山傍水，风景秀丽" }
      ], // 存储页面展示的信息
      activeTabbar: 1 // Tabbar 当前激活的 tab 索引（1 表示信息页）
    };
  },
  methods: {
    onChangeTabbar(event) {
      console.log("Tabbar 切换事件触发，索引:", event.detail); // 打印激活的 tab 索引
      this.activeTabbar = event.detail; // 更新激活的 Tabbar 索引
      switch (this.activeTabbar) {
        case 0:
          // 切换到首页
          common_vendor.index.switchTab({
            url: `/pages/index/index`
          });
          break;
        case 1:
          // 切换到信息页面
          common_vendor.index.switchTab({
            url: `/pages/info/info`
          });
          break;
        default:
          console.log("未知的 Tabbar 索引:", this.activeTabbar);
      }
    },
    goBack() {
      // 返回上一页逻辑
      common_vendor.index.navigateBack();
    }
  },
  onLoad() {
    console.log("Info page loaded");
  }
};

if (!Array) {
  const _component_van_cell = common_vendor.resolveComponent("van-cell");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_tabbar = common_vendor.resolveComponent("van-tabbar");
  const _component_van_tabbar_item = common_vendor.resolveComponent("van-tabbar-item");
  (_component_van_cell + _component_van_button + _component_van_tabbar + _component_van_tabbar_item)();
}

// 渲染函数
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.title),
    b: common_vendor.f($data.infoList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.key),
        b: common_vendor.t(item.value),
        c: i0
      };
    }),
    c: common_vendor.o($options.goBack),
    d: common_vendor.o($options.onChangeTabbar), // Tabbar 事件绑定
    e: $data.activeTabbar,
    f: common_vendor.p({
      active: $data.activeTabbar,
      "active-color": "#07c160"
    }),
    g: common_vendor.p({
      icon: "home-o",
      text: "首页"
    }),
    h: common_vendor.p({
      icon: "user-o",
      text: "信息"
    })
  };
}

const InfoPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/app/sd1.3/pages/info/info.vue"]]);
wx.createPage(InfoPage);
