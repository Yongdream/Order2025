"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    back() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    }
  }
};
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  (_component_van_icon + _component_van_button)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "checked",
      color: "#36ba16",
      size: "100"
    }),
    b: common_vendor.o($options.back),
    c: common_vendor.p({
      round: true,
      type: "primary",
      block: true,
      color: "#9a3324"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/app/sd1.3/pages/complete/complete.vue"]]);
wx.createPage(MiniProgramPage);
