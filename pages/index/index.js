"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apartment_index = require("../../utils/apartment/index.js");
const utils_pics_index = require("../../utils/pics/index.js");
const _sfc_main = {
  data() {
    return {
      partname: "",
      src: [],
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      etc: false
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
    }
  },
  mounted() {
    this.partname = utils_apartment_index.community;
  },
  onLoad() {
    let that = this;
    common_vendor.wx$1.cloud.init({
      env: "leicl-1g9qxala1d04e6d7"
      // 云开发环境id
    });
    this.src = utils_pics_index.Pics;
    common_vendor.index.request({
      url: "",
    //   url: "https://ys.telebort.top/demo.php",
      success(res) {
        console.log(res);
        if (res.data == 1) {
          that.etc = true;
        }
      }
    });
  },
      /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
  
    }
};
if (!Array) {
  const _component_van_grid_item = common_vendor.resolveComponent("van-grid-item");
  const _component_van_grid = common_vendor.resolveComponent("van-grid");
  (_component_van_grid_item + _component_van_grid)();
}
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
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/app/sd1.3/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
