/**

 @Name：电子提案系统
 @Author：losteracmer
    
 */

layui.define(['table', 'form', 'yyer', 'proTable'], function (exports) {
  var $ = layui.$
    , admin = layui.admin
    , view = layui.view
    , table = layui.table
    , form = layui.form
    , laytpl = layui.laytpl
    , proTable = layui.proTable
    , yyer = layui.yyer;


  //渲染orderList
  var renderOrderSelect = function (data) {
    laytpl(templateOption.innerHTML).render({
      data: data,
      value: "orderId",
      name: "orderNum"
    }, function(htmls){
      //console.log("lesson:"+htmls)
      $("#orderSelect").html('<option value="0">全部</option>' +
        htmls);
    })
  }
  // 获取届次信息
  var getPeriodSelect = function () {
    admin.req({
      url: './public/period/allList',
      type: "post",
      success: function (res) {
        if (res.code != 0) return;
        periodData = res.data;
        laytpl(templateOption.innerHTML).render({
          data: res.data,
          value: "periodId",
          name: "periodNum"
        }, function(htmls ) {
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
      url: './public/proposer/allList',
      type: "post",
      success: function (res) {
        if (res.code != 0) return;
        proposalData = res.data;
        laytpl(templateOption.innerHTML).render({
          data: res.data,
          value: "proNum",
          name: "proName"
        }, function(htmls){
          //console.log("lesson:" + htmls)
          //console.log(res.data)
          $("#proposerSelect").html('<option value="0">全部</option>' +
            htmls);
        })
        form.render();
      }
    })
  }


  var init = function () {

    getPeriodSelect();

    getProposerSelect();


  }



  var openProposalShowWindows = function (data) {
    let title = '河南大学 ' + data.periodEntity.periodNum + data.orderEntity.orderNum + ' 教职工代表大会提案表'
    if (data.disposeproposalEntity) title += data.disposeproposalEntity.dPnumber;

    yyer.open({
      title: title,
      maxmin: true,
      id: 'proposalShow'// + data.pId  //如果想打开多个提案窗口 ，取消注释即可，但是form会因为name相同出现点问题
      , success: function (layero, index) {
        layer.full(index);
        data.layerid = this.id;
        view(this.id).render('public/proposalWin', data).done(function () {
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
    , url: './public/proposal' //模拟接口
    , cols: [[
      
       { field: 'dPnumber', title: '提案编号', width: 160 }
      , { field: 'periodNum', title: '届', width: 80 }
      , { field: 'orderNum', title: '次', width: 80 }
      , { field: 'proName', title: '提案人', width: 100 }
      , { field: 'pName', title: '提案标题' }
      , { field: 'approvalName', title: '审核领导', width: 200   }
      , { field: 'pTime', title: '提出时间', width: 200  }
      , { field: 'status', title: '提案状态', templet: '#buttonStatusTpl', align: 'center', width: 120  }
      , { field: 'step', title: '提案流程', templet: '#buttonTpl', align: 'center', width: 120  }
      , { title: '操作', align: 'center', fixed: 'right', toolbar: '#table-content-list' , width: 100 }
    ]]

    , page: true
    , limit: 15
    , limits: [10, 15,30,40]
    , loading: true
    , text: {
      none: '本届没有提案',
      error: '请求接口错误'
    }

  });

  //监听工具条
  table.on('tool(admin-proposal-list)', function (obj) {
    var data = obj.data;
    let pId = data.pId;
    if (obj.event === 'edit') {
      console.log(data)
      openProposalShowWindows(data);
    }
  });

  //监听select 
  form.on('select(periodSelect)', function (data) {
    let periodId = data.value;
    if(periodId == 0) return ;
    let orderList = [];
    admin.req({
      url:"./public/order/allListByPeriodId"
      ,data:{
        periodId:periodId
      }
      ,type:"post"
      ,success:function(res){
        renderOrderSelect(res.data);
        form.render();
      }
    })
  });

 

  exports('bulletin', {})
});