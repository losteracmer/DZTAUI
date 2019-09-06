layui.define(['table', 'form','yyer','layer'], function (exports) {
    var $ = layui.$
      , admin = layui.admin
      , view = layui.view
      , table = layui.table
      , form = layui.form
      , layer = layui.layer
      , yyer = layui.yyer
      , laytpl = layui.laytpl;


var renderThis = function () {
    let layerid = $("#proposalWin").data("layerid");
    let pId = $("#proposalWin").data("pid");
    admin.req({
      url: "./proposal/getById",
      data: {
        pId: pId
      },
      success: function (res) {
        let data = res.data;
        data.layerid = layerid;
        view(layerid).render("windows/proposalWin", data).done(function () {
          form.render();
        })
      }
    })
  }


  $(document).on('click', '#exportBtn', function () {
    let that = this;
    let pid = $("#exportBtn").data('pid')
    layer.msg("正在导出...")

    // alert("导出")
    var url = "../public/exportProposal";
    var form = $("<form></form>").attr("action", url).attr("method", "post");
    form.append($("<input></input>").attr("type", "hidden").attr("name", "pid").attr("value", pid));
    form.appendTo('body').submit().remove();
    // admin.req({
    //   url: './file/exportProposal',
    //   type: "POST",
    //   data: {
    //     pId: pid  
    //   }
    // })
  })


  $(document).on('click', '#changeProposalBtn', function () {
    let that = this;
    let pid = $("#changeProposalBtn").data('pid')
    layer.msg("修改提案..." + pid)
    admin.req({
      url: './proposal/getByIdAndAllProposerAndAllDepart',
      type: "post",
      data: {
        pId: pid
      },
      success: function (res) {

        if (res.code != 0) {
          return;
        }
        let data = res.data.proposal;
        data['allDepart'] = res.data.allDepart;
        data['allProposer'] = res.data.allProposer;
        yyer.open({
          title: '修改提案',
          WID: 'changeProposalWin',
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
                  renderThis();

                }
              })

              layer.close(index); //执行关闭 
            });
            console.log("加载完成")
          }
        })
      }
    })
  })

  $(document).on('click', '#changeProposalStatusBtn', function () {
    let that = this;
    let pid = $("#changeProposalStatusBtn").data('pid')
    layer.msg("提案..." + pid)
    admin.req({
      url: './proposal/getByIdAndAllProposer',
      type: "post",
      data: {
        pId: pid
      },
      success: function (res) {

        if (res.code != 0) {
          return;
        }
        let data = res.data.proposal;
        data['allProposer'] = res.data.allProposer;
        yyer.open({
          title: '提案委员会意见',
          WID: 'disposeproposalWin',
          success: function (layero, index) {
            layui.data.render = form.render();
            view(this.id).render('windows/disposeproposalEditWin', data).done(function () {
              form.render();
            });
            //监听提交
            form.on('submit(form-edit-disposeproposal)', function (data) {
              var field = data.field; //获取提交的字段
              admin.req({
                url: "./proposal/editDisposeProposal",
                data: field,
                type: "POST",
                success: function (res) {
                  if (res.code != 0) return;
                  layer.msg(res.msg || "success", {
                    icon: 1
                  });
                  renderThis();

                  layer.close(index); //执行关闭 
                }
              })


            });
            console.log("加载完成")
          }
        })
      }
    })
  })
  
  $(document).on('click', '#ausstellungBtn', function () {
    let that = this;
    let pid = $("#ausstellungBtn").data('pid')
    layer.msg("签发提案..." + pid)
    admin.req({
      url: './proposal/getByIdAndAllProposerAndAllDepart',
      type: "post",
      data: {
        pId: pid
      },
      success: function (res) {

        if (res.code != 0) {
          return;
        }
        let data = res.data.proposal;
        data['allDepart'] = res.data.allDepart;
        data['allProposer'] = res.data.allProposer;
        yyer.open({
          title: '签发提案',
          WID: 'ausstellunglWin',
          success: function (layero, index) {
            layui.data.render = form.render();
            view(this.id).render('windows/ausstellungEditWin', data).done(function () {
              form.render();
            });
            //监听提交
            form.on('submit(form-edit-ausstellung)', function (data) {
              var field = data.field; //获取提交的字段
              admin.req({
                url: "./proposal/editAussstellung",
                data: field,
                type: "POST",
                success: function (res) {
                  if (res.code != 0) return;
                  layer.msg(res.msg, {
                    icon: 1
                  });
                  renderThis();

                }
              })

              layer.close(index); //执行关闭 
            });
            console.log("加载完成")
          }
        })
      }
    })
  })

  $(document).on('click', '#approvalBtn', function () {
    let that = this;
    let pid = $("#approvalBtn").data('pid')
    layer.msg("提案..." + pid)
    admin.req({
      url: './proposal/getByIdAndAllProposer',
      type: "post",
      data: {
        pId: pid
      },
      success: function (res) {

        if (res.code != 0) {
          return;
        }
        let data = res.data.proposal;
        data['allProposer'] = res.data.allProposer;
        yyer.open({
          title: '校领导意见',
          WID: 'approvalWin',
          success: function (layero, index) {
            layui.data.render = form.render();
            view(this.id).render('windows/approvalEditWin', data).done(function () {
              form.render();
            });
            //监听提交
            form.on('submit(form-edit-approval)', function (data) {
              var field = data.field; //获取提交的字段
              admin.req({
                url: "./proposal/editApproval",
                data: field,
                type: "POST",
                success: function (res) {
                  if (res.code != 0) return;
                  layer.msg(res.msg || "success", {
                    icon: 1
                  });
                  renderThis();

                  layer.close(index); //执行关闭 
                }
              })
            });
          }
        })
      }
    })
  })
//   执行提案

  $(document).on('click', '#excuteproposalBtn', function () {
    let that = this;
    let pid = $("#excuteproposalBtn").data('pid')
    layer.msg("提案..." + pid)
    admin.req({
      url: './proposal/getByIdAndAllProposer',
      type: "post",
      data: {
        pId: pid
      },
      success: function (res) {

        if (res.code != 0) {
          return;
        }
        let data = res.data.proposal;
        data['allProposer'] = res.data.allProposer;
        yyer.open({
          title: '承办单位办理意见',
          WID: 'excuteProposalWin',
          success: function (layero, index) {
            layui.data.render = form.render();
            view(this.id).render('windows/excuteProposalEditWin', data).done(function () {
              form.render();
            });
            //监听提交
            form.on('submit(form-edit-excuteProposal)', function (data) {
              var field = data.field; //获取提交的字段
              admin.req({
                url: "./proposal/editExcuteProposal",
                data: field,
                type: "POST",
                success: function (res) {
                  if (res.code != 0) return;
                  layer.msg(res.msg || "success", {
                    icon: 1
                  });
                  renderThis();

                  layer.close(index); //执行关闭 
                }
              })
            });
          }
        })
      }
    })
  })

  $(document).on('click', '#csiBtn', function () {
    let that = this;
    let pid = $("#csiBtn").data('pid')
    layer.msg("提案..." + pid)
    admin.req({
      url: './proposal/getByIdAndAllProposer',
      type: "post",
      data: {
        pId: pid
      },
      success: function (res) {

        if (res.code != 0) {
          return;
        }
        let data = res.data.proposal;
        data['allProposer'] = res.data.allProposer;
        yyer.open({
          title: '代表评价',
          WID: 'csiWin',
          success: function (layero, index) {
            layui.data.render = form.render();
            view(this.id).render('windows/csiEditWin', data).done(function () {
              form.render();
            });
            //监听提交
            form.on('submit(form-edit-csi)', function (data) {
              var field = data.field; //获取提交的字段
              admin.req({
                url: "./proposal/editCsi",
                data: field,
                type: "POST",
                success: function (res) {
                  if (res.code != 0) return;
                  layer.msg(res.msg || "success", {
                    icon: 1
                  });
                  renderThis();

                  layer.close(index); //执行关闭 
                }
              })
            });
          }
        })
      }
    })
  })
  exports('proposalWin', {})
});