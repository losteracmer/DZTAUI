/**

 @Name：电子提案系统
 @Author：losteracmer
    
 */
var windowW = 1920;
var windowH = 978;
var periodData = [];
var proposalData = [];
layui.define(['table', 'form', 'proTable', 'yyer'], function (exports) {
  var $ = layui.$
    , admin = layui.admin
    , view = layui.view
    , table = layui.table
    , form = layui.form
    , laytpl = layui.laytpl
    , proTable = layui.proTable
    , yyer = layui.yyer;


  //定义一些函数



  //渲染orderList
  var renderOrderSelect = function (data) {
    laytpl(templateOption.innerHTML).render({
      data: data,
      value: "orderId",
      name: "orderNum"
    }, function (htmls) {
      //console.log("lesson:"+htmls)
      $("#orderSelect").html('<option value="0">全部</option>' +
        htmls);
    })
  }
  // 获取届次信息
  var getPeriodSelect = function () {
    admin.req({
      url: './period/allList',
      type: "post",
      success: function (res) {
        if (res.code != 0) return;
        periodData = res.data;
        laytpl(templateOption.innerHTML).render({
          data: res.data,
          value: "periodId",
          name: "periodNum"
        }, function (htmls) {
          console.log("lesson:" + htmls)
          console.log(res.data)
          $("#periodSelect").html('<option value="0">全部</option>' +
            htmls);
        })
        renderOrderSelect([]);
        form.render();
      }
    })
  }


  //获取 提案人信息
  var getProposerSelect = function () {
    admin.req({
      url: './proposer/allList',
      type: "post",
      success: function (res) {
        if (res.code != 0) return;
        proposalData = res.data;
        laytpl(templateOption.innerHTML).render({
          data: res.data,
          value: "proNum",
          name: "proName"
        }, function (htmls) {
          //console.log("lesson:" + htmls)
          //console.log(res.data)
          $("#proposerSelect").html('<option value="0">全部</option>' +
            htmls);
        })
        form.render();
      }
    })
  }

  //单位信息
  var getMainDeaprtSelect = function () {
    admin.req({
      url: './depart/allDepart',
      type: "post",
      success: function (res) {
        if (res.code != 0) return;
        proposalData = res.data;
        laytpl(templateOption.innerHTML).render({
          data: res.data.allDepart,
          value: "departId",
          name: "departName"
        }, function (htmls) {

          $("#departSelect").html('<option value="0">全部</option>' +
            htmls);
        })
        form.render();
      }
    })
  }

  var exportsProposals = function (data, cb) {
    let pid = data.pId;
    layer.msg("正在导出...")
    console.log("导出" + pid)
    // alert("导出")
    var url = "../public/exportProposal";
    var form = $("<form></form>").attr("action", url).attr("method", "post");
    form.append($("<input></input>").attr("type", "hidden").attr("name", "pid").attr("value", pid));
    form.appendTo('body').submit().remove();
    cb instanceof Function ? cb() : "";
  }


  var active = {
    exports: function () {
      var checkStatus = table.checkStatus('admin-proposal-list'),
        checkData = checkStatus.data; //得到选中的数据
      let pId = checkData.pId;
      if (checkData.length === 0) {
        return layer.msg('请先选中要导出行~');
      }

      layer.confirm('确定要导出吗，这个操作可能非常漫长！', function (index) {


        let itv;
        let i = 0;
        itv = setInterval(function () {
          if (i == checkData.length - 1) {
            clearInterval(itv);
          }
          exportsProposals(checkData[i]);
          i++;
        }, 400)

      });
    }

    //添加
    ,
    add: function (othis) {
      admin.req({
        url: './depart/allDepartAndAllProposer',
        type: "post",

        success: function (res) {

          if (res.code != 0) {
            return;
          }
          let data = {};
          data['allDepart'] = res.data['allDepart'];
          data['allProposer'] = res.data['allProposer'];
          data['proposerEntity'] = res.data['nowPorposer'];
          yyer.open({
            title: '发布提案',
            WID: 'creatProposalWin',
            success: function (layero, index) {
              layui.data.render = form.render();
              view(this.id).render('windows/proposalEditWin', data).done(function () {
                form.render();
              });
              //监听提交
              form.on('submit(form-edit-proposal)', function (data) {
                var field = data.field; //获取提交的字段
                admin.req({
                  url: "./proposal/editProposal",
                  data: field,
                  type: "POST",
                  success: function (res) {
                    if (res.code != 0) return;
                    layer.msg(res.msg, {
                      icon: 1
                    });
                    table.reload("admin-proposal-list");
                    layer.close(index);
                  }
                })


              });

            }
          })
        }
      })
    }
  };


  var init = function () {

    getPeriodSelect();

    getProposerSelect();

    getMainDeaprtSelect();

  }



  var openProposalShowWindows = function (data) {
    let title = '河南大学 ' + data.periodEntity.periodNum + data.orderEntity.orderNum + ' 教职工代表大会提案表'
    if (data.disposeproposalEntity) title += data.disposeproposalEntity.dPnumber;
    let Warea;
    let Woffset;
    if (!layui.data("optionTable")['WStatus']) {
      Warea = [windowW * 0.75 + "px", windowH * 0.8 + "px"];
      Woffset = 'auto';
    } else {
      let WStatus = layui.data("optionTable")['WStatus'];
      Warea = [WStatus.weith + 'px', WStatus.height + 'px'];
      Woffset = [WStatus.top, WStatus.left];
    }
    console.log(Woffset)
    console.log(Warea)
    yyer.open({
      title: title,
      type: 1,
      shade: 0,
      offset: Woffset,
      moveOut: true,
      maxmin: true,
      area: Warea
      , id: 'proposalShow'// + data.pId  //如果想打开多个提案窗口 ，取消注释即可，但是form会因为name相同出现点问题
      , success: function (layero, index) {
        data.layerid = this.id;
        view(this.id).render('windows/proposalWin', data).done(function () {
          form.render();
        });
      }

    });
  }

  //==========================================================

  init();

  //文章管理
  proTable.render({
    elem: '#admin-proposal-list'
    , toolbar: '#proOptionsBar'
    , defaultToolbar: ['filter', 'exports', /*'print'*/]
    , url: './admin/proposalList' //模拟接口
    , cols: [[
      { type: 'checkbox', fixed: 'left' }
      , { field: 'pId', width: 90, title: '提案ID', sort: true }
      , { field: 'dPnumber', title: '提案编号', hide: true }
      , { field: 'periodNum', title: '届', width: 80 }
      , { field: 'orderNum', title: '次', width: 80 }
      , { field: 'proName', title: '提案人', width: 100 }
      , { field: 'proDepartName', title: '提案人单位', align: 'center', hide: false }
      , { field: 'pTel', title: '联系方式', align: 'center', hide: true }
      , { field: 'pName', title: '提案标题' }
      , { field: 'pTime', title: '提出时间' }

      , { field: 'disposeproposalName', title: '审批人', align: 'center', hide: true }
      , { field: 'disposeproposalTime', title: '审批时间', hide: true }

      , { field: 'approvalName', title: '审核人', align: 'center', hide: true }
      , { field: 'approvalTime', title: '审核时间', hide: true }

      , { field: 'excuteproposalDepart', title: '执行单位', align: 'center', hide: true }
      , { field: 'excuteproposalName', title: '执行单位代表', align: 'center', hide: true }

      , { field: 'status', title: '提案状态', templet: '#buttonStatusTpl', align: 'center' }
      , { field: 'step', title: '提案流程', templet: '#buttonTpl', align: 'center' }
      , { title: '操作', align: 'center', fixed: 'right', toolbar: '#table-content-list' }
    ]]
    , text: {
      none: '暂无相关数据',
      error: '请求接口错误'
    }
    , limits: [10, 15, 20, 25, 30,1000]

  });

  table.on('toolbar(admin-proposal-list)', function (obj) {

    var checkStatus = table.checkStatus(obj.config.id);
    var type = obj.event;
    //active[type].call(this);
    //return;
    switch (obj.event) {
      case 'add':
        active['add']();
        break;
      case 'exports':
        active['exports']();
        break;

    };
  });

  //监听工具条
  table.on('tool(admin-proposal-list)', function (obj) {
    var data = obj.data;
    let pId = data.pId;
    if (obj.event === 'del') {
      // admin.popup({
      //   title:'猜测是',
      //   content:"内容测试"
      // })
      layer.confirm('确定删除此文章？', function (index) {
        admin.req({
          url: 'admin/deleteProposal'
          , type: "POST"
          , data: {
            pId: pId
          },
          success: function (res) {
            if (res.code == 0) {
              admin.popup({
                title: "操作结果"
                , content: res.msg
              })

              obj.del();
              layer.close(index);
            }
          }
        });

      });
    } else if (obj.event === 'edit') {
      console.log(data)
      openProposalShowWindows(data);
    }
  });

  //监听select 
  form.on('select(periodSelect)', function (data) {
    let periodId = data.value;
    if (periodId == 0) return;
    let orderList = [];
    admin.req({
      url: "./order/allListByPeriodId"
      , data: {
        periodId: periodId
      }
      , type: "post"
      , success: function (res) {
        renderOrderSelect(res.data);
        form.render();
      }
    })

  });


  exports('mainview', {})
});