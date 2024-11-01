"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      maxDate: new Date(2010, 0, 31).getTime(),
      availableSlots: "",
      show: false,
      showdur: false,
      HandlerComm: "",
      currentCommMan: "",
      currentCommTel: "",
      // 日历格式
      formatter: "",
      // 时间段选择列表
      columns: [],
      // 日期
      HandlerDate: "",
      // 时间段
      HandlerTime: "",
      HandlerTime_d: "",
      HandlerList: "",
      // 时间段列表
      TimeList: "",
      countedTimes: "",
      // 信息
      visitorMan: "",
      visitorTel: "",
      HandlerUnit: "",
      visitorNum: null,
      radio1: "",
      radio2: "",
      radios_check: [],
      // 本地临时地址
      file: "",
      // 云上地址
      fileList: [],
      // 文件云存储地址
      fileurl:null
    };
  },
  methods: {
    onInput(event) {
      this.setData({
        currentDate: event.detail
      });
    },
    ShowList() {
      this.HandlerTime = "";
      let fullyBookedDates = this.checkDatesFullyBooked(this.countedTimes, this.getTimeFormatter(/* @__PURE__ */ new Date()));
      console.log("从现在开始的后30天中约满的日期:", fullyBookedDates);
      console.log(this.countedTimes);
      let that = this;
      this.formatter = (day) => {
        const month = day.date.getMonth() + 1;
        const date = day.date.getDate();
        for (let i in that.countedTimes) {
          let tim = new Date(i);
          if (month == tim.getMonth() + 1) {
            if (date == tim.getDate()) {
              day.bottomInfo = `已约${that.countedTimes[i]}`;
            }
          }
        }
        fullyBookedDates.forEach((item, index) => {
          let timeday = new Date(item);
          if (month == timeday.getMonth() + 1) {
            if (date == timeday.getDate()) {
              day.text = `已满`;
              day.type = "disabled";
            }
          }
        });
        return day;
      };
      this.show = true;
      console.log(1);
    },
    onConfirm(e) {
      let da = new Date(e.detail);
      this.HandlerDate = this.getTimeFormatter(da);
      let timeList = [];
      for (let i in this.HandlerList) {
        if (this.HandlerList[i].HandlerDate === this.HandlerDate) {
          timeList.push(this.HandlerList[i].HandlerTime);
        }
      }
      console.log(timeList);
      this.check(timeList);
      this.onClose();
    },
    onClose() {
      this.show = false;
    },
    onClosedur() {
      this.showdur = false;
    },
    onClickdur() {
      if (!this.HandlerDate) {
        common_vendor.index.showToast({
          title: "请先选择日期",
          icon: "none"
        });
        return;
      }
      this.showdur = true;
    },
    onConfirmdur(e) {
      console.log(e.detail);
      this.HandlerTime = `${e.detail.value[0]} ${e.detail.value[1]}`;
      this.HandlerTime_d = e.detail.value[1];
      this.onClosedur();
    },
    onChange(event) {
      const {
        picker,
        value,
        index
      } = event.detail;
      picker.setColumnValues(1, this.TimeList[value[0]]);
    },
    getTimeFormatter(da) {
      return `${da.getFullYear()}-${("0" + (da.getMonth() + 1)).slice(-2)}-${("0" + da.getDate()).slice(-2)}`;
    },
    getStringFormatter(str) {
      let new_str = str.replace(/\ +/g, "").replace(/[ ]/g, "").replace(/[\r\n]/g, "").replace(/-/g, "");
      return new_str;
    },
    getCharCodes(str) {
      var charCodes = [];
      for (var i = 0; i < str.length; i++) {
        charCodes.push(str.charCodeAt(i));
      }
      return charCodes;
    },
    // 排查数据
    check(data) {
      let ls = {
        "上午": ["9:00-10:00", "10:00-11:00", "11:00-12:00"],
        "下午": ["14:00-15:00", "15:00-16:00", "16:00-17:00"]
      };
      let pos = [...ls["上午"], ...ls["下午"]];
      let delnum = [0, 0];
      for (let i = 0; i < pos.length; i++) {
        if (data.indexOf(pos[i]) != -1) {
          if (i < 3) {
            ls["上午"].splice(pos.indexOf(pos[i]) % 3 - delnum[0], 1);
            delnum[0]++;
          } else {
            ls["下午"].splice(pos.indexOf(pos[i]) % 3 - delnum[1], 1);
            delnum[1]++;
          }
        }
      }
      if (ls["上午"].length <= 0) {
        ls["上午"] = ["无"];
      }
      if (ls["下午"].length <= 0) {
        ls["下午"] = ["无"];
      }
      this.TimeList = ls;
      this.columns = [
        {
          values: Object.keys(ls),
          className: "column1"
        },
        {
          values: ls["上午"],
          className: "column2"
        }
      ];
    },
    /*
    预约情况判断
    开始
    */
    getFilteredHandlers: function(data) {
      return data.filter((item) => item.HandlerPass === true && new Date(item.HandlerDate).getTime() >= new Date(this.getTimeFormatter(/* @__PURE__ */ new Date())).getTime());
    },
    // 统计每个日期被预约次数
    countHandlerTimes: function(datesAndTimes) {
      let result = {};
      for (let item of datesAndTimes) {
        if (result[item.HandlerDate]) {
          result[item.HandlerDate] += 1;
        } else {
          result[item.HandlerDate] = 1;
        }
      }
      return result;
    },
    // 判断日期起始日期后30天是否约满 输出约满的日期
    checkDatesFullyBooked: function(countedTimes, startDate) {
      let date = startDate;
      const fullyBookedDates = [];
      const endDate = this.getNextDateAfterFourMonths(startDate);
      while (date !== endDate) {
        if (countedTimes[date] && countedTimes[date] >= 6) {
          fullyBookedDates.push(date);
        }
        date = this.getNextDate(date);
      }
      return fullyBookedDates;
    },
    // 日期后一天
    getNextDate: function(dateStr) {
      const dt = new Date(dateStr);
      dt.setDate(dt.getDate() + 1);
      const newday = dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2);
      return newday;
    },
    // 日期后4个月
    getNextDateAfterFourMonths: function(dateStr) {
      const dt = new Date(dateStr);
      dt.setMonth(dt.getMonth() + 4);
      const newDate = dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2);
      console.log("New date after 4 months:", newDate);
      return newDate;
    },
    onButtonClick: function() {
      const specifiedDate = this.HandlerDate;
      const availableSlots = this.getAvailableTimeSlots(this.data.filteredHandlers, specifiedDate);
      console.log("在", specifiedDate, "的剩余时间段编号为:", availableSlots);
      this.availableSlots = availableSlots;
    },
    /*
    结束
    */
    // 输入
    inputInfo0(e) {
      this.HandlerUnit = e.detail;
    },
    inputInfo1(e) {
      this.visitorMan = e.detail;
    },
    inputInfo2(e) {
      this.visitorTel = e.detail;
    },
    inputInfo3(e) {
      this.visitorNum = e.detail;
    },
    // 单选
    onChange1(e) {
      this.radio1 = e.detail.value === "1" ? true : false;
      console.log(this.radio1);
      this.radios_check[0] = 1;
    },
    onChange2(e) {
      this.radio2 = e.detail.value === "1" ? true : false;
      console.log(this.radio2);
      this.radios_check[1] = 1;
    },
    // 下载文档
    async DownFile() {
      let CloudUrl = "cloud://leicl-1g9qxala1d04e6d7.6c65-leicl-1g9qxala1d04e6d7-1321828729/cloudbase-cms/upload/2023-10-22/qyi6omyzo2774idjrkxddwfj0w4gusg8_.png";
      let result = await common_vendor.wx$1.cloud.downloadFile({
        fileID: CloudUrl
      });
      if (result.statusCode == 200) {
        common_vendor.wx$1.saveImageToPhotosAlbum({
          filePath: result.tempFilePath,
          success() {
            common_vendor.wx$1.showToast({
              title: "已保存至相册",
              icon: "none",
              duration: 1500
            });
          }
        });
      }
    },
    // 上传
    // 上传前校验
    beforeRead(event) {
      const {
        file,
        callback
      } = event.detail;
      callback(file.type === "image");
    },
    // 检验完成后上传
    async afterRead(event) {
      this.file = event.detail.file;
      const cloudPath = `HandlerFile/${this.HandlerComm}/` + (/* @__PURE__ */ new Date()).getTime() + this.file.url.match(
        /\.([^.]+)$/
      )[0];
      common_vendor.wx$1.showToast({
        title:"上传中",
        icon:"none",
        duration: 5000,
      })
      const uploadTasks = await this.uploadFilePromise(cloudPath, this.file);
      this.fileList = [{
        url: uploadTasks
      }];
      let that = this
      common_vendor.wx$1.cloud.getTempFileURL({
          fileList:[{
            fileID:uploadTasks
          }],
          success(res){
            that.fileurl = res.fileList[0].tempFileURL
            common_vendor.wx$1.showToast({
              title:"上传成功",
              icon:"none"
            })
          },
          fail(err){
            console.log("获取云存储的下载地址失败！",err);
        }
      })
    },
    deletePics() {
      let that = this;
      common_vendor.wx$1.cloud.deleteFile({
        // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
        fileList: [that.fileList[0].url]
      }).then((res) => {
        that.fileList = [];
      }).catch((err) => {
        common_vendor.index.showToast({
          title: "删除失败",
          icon: "none"
        });
      });
    },
    uploadFilePromise(fileName, chooseResult) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.uploadFile({
          cloudPath: fileName,
          filePath: chooseResult.url,
          success: (res) => {
            resolve(res.fileID);
          },
          fail: (e) => {
            reject(e);
          }
        });
      });
    },
    // 信息提交
    submit() {
      console.log(this.fileurl)
      if (!this.HandlerDate || !this.HandlerTime || !this.HandlerUnit || !this.visitorMan || !this.visitorTel || !this.visitorNum || !this.radios_check[0] || !this.radios_check[1]) {
        common_vendor.index.showToast({
          title: "请完善信息",
          icon: "none"
        });
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.visitorTel)) {
        common_vendor.index.showToast({
          title: "请输入正确的联系方式",
          icon: "none"
        });
        return;
      }
      if (!/^[1-9]*[1-9][0-9]*$/.test(this.visitorNum)) {
        common_vendor.index.showToast({
          title: "请输入正确的访客人数",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "信息提交中",
        icon: "loading"
      });
      common_vendor.wx$1.cloud.database().collection("HandlerInfo").add({
        data: {
          HandlerComm: this.HandlerComm,
          HandlerDate: this.HandlerDate,
          HandlerDine: this.radio2,
          HandlerLesson: this.radio1,
          HandlerPass: false,
          HandlerTime: this.HandlerTime_d,
          HandlerUnit: this.HandlerUnit,
          HandlerFile: this.fileurl,
          visitorMan: this.visitorMan,
          visitorNum: Number(this.visitorNum),
          visitorTel: this.visitorTel,
        }
      }).then((res) => {
        console.log("添加成功", res);
        common_vendor.index.hideToast();
        common_vendor.index.reLaunch({
          url: "/pages/complete/complete"
        });
      }).catch((res) => {
        console.error("添加失败", res);
      });
    }
  },
  onLoad(e) {
    this.HandlerComm = e.com;
  },
      /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
  
    },
  mounted() {
    let currentDate = /* @__PURE__ */ new Date();
    this.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 4, currentDate.getDate());
  },
  onShow() {
    console.log(this.HandlerList);
    common_vendor.wx$1.cloud.database().collection("CommunityInfo").where({
      CommName: this.HandlerComm
    }).get().then((res) => {
      if (!res.data) {
        common_vendor.index.showToast({
          title: "请求失败",
          icon: "none"
        });
        return;
      }
      let comdatas = res.data[0];
      this.currentCommMan = comdatas.CommMan;
      this.currentCommTel = comdatas.CommTel;
    });
    common_vendor.wx$1.cloud.database().collection("HandlerInfo").where({
      HandlerComm: this.HandlerComm
    }).get().then((res) => {
      if (res.data.length <= 0)
        return;
      this.HandlerList = this.getFilteredHandlers(res.data);
      this.countedTimes = this.countHandlerTimes(this.HandlerList);
    });
  }
};
if (!Array) {
  const _component_van_icon = common_vendor.resolveComponent("van-icon");
  const _component_van_field = common_vendor.resolveComponent("van-field");
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_picker = common_vendor.resolveComponent("van-picker");
  const _component_van_popup = common_vendor.resolveComponent("van-popup");
  const _component_van_cell_group = common_vendor.resolveComponent("van-cell-group");
  const _component_van_uploader = common_vendor.resolveComponent("van-uploader");
  const _component_van_cell = common_vendor.resolveComponent("van-cell");
  const _component_van_calendar = common_vendor.resolveComponent("van-calendar");
  (_component_van_icon + _component_van_field + _component_van_button + _component_van_picker + _component_van_popup + _component_van_cell_group + _component_van_uploader + _component_van_cell + _component_van_calendar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "location-o"
    }),
    b: common_vendor.p({
      value: $data.HandlerComm,
      readonly: true,
      label: "村社名"
    }),
    c: common_vendor.p({
      name: "friends-o"
    }),
    d: common_vendor.p({
      value: $data.currentCommMan,
      readonly: true,
      label: "村社联系人"
    }),
    e: common_vendor.p({
      name: "phone-o"
    }),
    f: common_vendor.p({
      value: $data.currentCommTel,
      readonly: true,
      label: "联系人电话"
    }),
    g: common_vendor.o($options.DownFile),
    h: common_vendor.p({
      color: "#3b95f2",
      icon: "down",
      type: "primary"
    }),
    i: common_vendor.p({
      value: $data.HandlerDate,
      isLink: true,
      required: true,
      readonly: true,
      label: "时间",
      placeholder: "预约时间"
    }),
    j: common_vendor.o((...args) => $options.ShowList && $options.ShowList(...args)),
    k: common_vendor.o($options.onClickdur),
    l: common_vendor.p({
      value: $data.HandlerTime,
      required: true,
      readonly: true,
      isLink: true,
      label: "时间段",
      placeholder: "请选择时间段"
    }),
    m: common_vendor.o($options.onConfirmdur),
    n: common_vendor.o($options.onClosedur),
    o: common_vendor.o($options.onChange),
    p: common_vendor.p({
      showToolbar: true,
      columns: $data.columns,
      title: "时间段"
    }),
    q: common_vendor.p({
      show: $data.showdur,
      position: "bottom",
      customStyle: "height: 80%"
    }),
    r: common_vendor.o($options.inputInfo0),
    s: common_vendor.p({
      value: $data.HandlerUnit,
      required: true,
      clearable: true,
      label: "访客单位",
      placeholder: "请输入单位名称"
    }),
    t: common_vendor.o($options.inputInfo1),
    v: common_vendor.p({
      value: $data.visitorMan,
      required: true,
      clearable: true,
      label: "联系人员",
      placeholder: "请输入联系人"
    }),
    w: common_vendor.o($options.inputInfo2),
    x: common_vendor.p({
      value: $data.visitorTel,
      required: true,
      clearable: true,
      type: "phone",
      label: "联系方式",
      placeholder: "请输入手机号"
    }),
    y: common_vendor.o($options.inputInfo3),
    z: common_vendor.p({
      value: $data.visitorNum,
      required: true,
      clearable: true,
      label: "访客人数",
      placeholder: "请输入来访人数"
    }),
    A: common_vendor.o((...args) => $options.onChange1 && $options.onChange1(...args)),
    B: common_vendor.o((...args) => $options.onChange2 && $options.onChange2(...args)),
    C: common_vendor.p({
      icon: "plus",
      type: "primary"
    }),
    D: common_vendor.o($options.beforeRead),
    E: common_vendor.o($options.afterRead),
    F: common_vendor.o($options.deletePics),
    G: common_vendor.p({
      accept: "media",
      useBeforeRead: true,
      fileList: $data.fileList,
      maxCount: "1"
    }),
    H: common_vendor.o($options.submit),
    I: common_vendor.p({
      round: true,
      type: "primary",
      block: true,
      color: "#9a3324"
    }),
    J: common_vendor.p({
      title: "选择日期",
      show: $data.show,
      value: "日历"
    }),
    K: common_vendor.o($options.onConfirm),
    L: common_vendor.o($options.onClose),
    M: common_vendor.p({
      show: $data.show,
      formatter: $data.formatter,
      maxDate: $data.maxDate
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/app/sd1.3/pages/Order/Order.vue"]]);
wx.createPage(MiniProgramPage);
