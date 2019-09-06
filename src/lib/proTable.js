/**

 @Name：增强版layer
 @Author：losteracmer

    
 */

// var proStatusTpl = `
// {{#  if(d.status == 1){ }}
// <button class="layui-btn  layui-btn-xs"></i>立案</button>
// {{#  } else if(d.status == 2) { }}
// <button class="layui-btn  layui-btn-normal layui-btn-xs"></i>建议</button>
// {{#  } else if(d.status == 3) { }}
// <button class="layui-btn layui-btn-danger layui-btn-xs"></i>无效</button>
// {{#  } else if(d.status == 0) { }}
// <button class="layui-btn layui-btn-primary layui-btn-xs"></i>待审核</button>
// {{#  } }}
// `

// var proStepTpl = `
// {{#  if(d.step == 1){ }}
// <button class="layui-btn layui-btn-primary layui-btn-xs"><i class="layui-icon">&#xe6b2;</i>提出提案</button>
// {{#  } else if(d.step == 2) { }}
// <button class="layui-btn  layui-btn-warm layui-btn-xs"><i class="layui-icon">&#xe679;</i>审批完成</button>
// {{#  } else if(d.step == 3) { }}
// <button class="layui-btn layui-btn-normal layui-btn-xs"><i class="layui-icon">&#xe66e;</i>签发完成</button>
// {{#  } else if(d.step == 4) { }}
// <button class="layui-btn layui-btn-normal layui-btn-xs"><i class="layui-icon">&#xe672;</i>审核通过</button>
// {{#  } else if(d.step == 5) { }}
// <button class="layui-btn layui-btn layui-btn-xs"><i class="layui-icon">&#xe66c;</i>处理完成</button>
// {{#  } else if(d.step == 6) { }}
// <button class="layui-btn  layui-btn-xs"><i class="layui-icon">&#xe6c6;</i>完成提案</button>
// {{#  } }}
// `

// var proOptionsTpl = `
// <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit"><i
//     class="layui-icon layui-icon-edit"></i>编辑</a>
// <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i
//     class="layui-icon layui-icon-delete"></i>删除</a>
// `
layui.define(['laytpl', 'layer', 'table', 'setter'], function (exports) {

    var layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        setter = layui.setter;


    var proTable = {
        
        
        render: function (options) {
            var parseData = options.parseData;

            delete options.parseData;

            request = setter.request;
            //防止空指针
            options.where = options.where ? options.where : {};
            options.headers = options.headers ? options.headers : {};
            if (request.tokenName) {
                var sendData = typeof options.where === 'string'
                    ? JSON.parse(options.where)
                    : options.where;

                //自动给参数传入默认 token
                options.where[request.tokenName] = request.tokenName in sendData
                    ? options.where[request.tokenName]
                    : (layui.data(setter.tableName)[request.tokenName] || '');

                //自动给 Request Headers 传入 token
                options.headers[request.tokenName] = request.tokenName in options.headers
                    ? options.headers[request.tokenName]
                    : (layui.data(setter.tableName)[request.tokenName] || '');
            }
            
            return table.render($.extend({
               
                // method: "post",

                //重新定义 数据格式
                parseData: function (res) { //res 即为原始返回的数据
                    if(res.code != 0){
                        res.data = [];
                        
                    }
                    let data = res.data;

                    data.forEach(function( element ) {
                        element.proName = element.proposerEntity == null ? "未知" : element.proposerEntity.proName;
                        element.step = 6;
                        element.step = element.csiEntity == null ? 5 : 6;  //评价完成 
                        element.step = element.excuteproposalEntity == null ? 4 : element.step;  //执行提案
                        element.step = element.approvalEntity == null ? 3 : element.step;  //审批提案  
                        element.step = element.ausstellungEntity == null ? 2 : element.step;  //签发 分配处理单位
                        element.step = element.disposeproposalEntity == null ? 1 : element.step;  //审批 指定 是否 立案 无效 建议
                        if (element.step > 1) {
                            element.status = element.disposeproposalEntity.dPidea;
                        } else {
                            element.status = 0; //还没有审批 待审批
                        }
                        //届次设置
                        element.periodNum = element.periodEntity ? element.periodEntity.periodNum : "";
                        element.orderNum = element.orderEntity? element.orderEntity.orderNum : "";

                        //审核设置
                        element.disposeproposalName = element.disposeproposalEntity ? element.disposeproposalEntity.proposerEntity.proName : "";
                        element.disposeproposalTime = element.disposeproposalEntity ? element.disposeproposalEntity.dPtime : "";
                        element.dPnumber = element.disposeproposalEntity?element.disposeproposalEntity.dPnumber:"";
                        //审批设置
                        element.ausstellungName = element.ausstellungEntity ? element.ausstellungEntity.proposerEntity.proName : "";
                        element.ausstellungTime = element.ausstellungEntity ? element.ausstellungEntity.aTime : "";
                            //部门一
                        element.ausstellungDepart1 = element.ausstellungEntity 
                        ? (element.ausstellungEntity.departEntity1 ? element.ausstellungEntity.departEntity1.departName : "") : "";
                            //部门二
                        element.ausstellungDepart1 = element.ausstellungEntity 
                        ? (element.ausstellungEntity.departEntity2 ? element.ausstellungEntity.departEntity2.departName : "") : "";
                            //部门三
                        element.ausstellungDepart1 = element.ausstellungEntity 
                        ? (element.ausstellungEntity.departEntity3 ? element.ausstellungEntity.departEntity3.departName : "") : "";
                            //部门四
                        element.ausstellungDepart1 = element.ausstellungEntity 
                        ? (element.ausstellungEntity.departEntity4 ? element.ausstellungEntity.departEntity4.departName : "") : "";
                        //审核设置
                        element.approvalName = element.approvalEntity?element.approvalEntity.proposerEntity.proName:"";
                        element.approvalTime = element.approvalEntity?element.approvalEntity.avTime:"";
                        //执行设置
                        element.excuteproposalName = element.excuteproposalEntity?element.excuteproposalEntity.proposerEntity.proName:"";
                        element.excuteproposalTime = element.excuteproposalEntity?element.excuteproposalEntity.epTime:"";
                        element.excuteproposalDepart = element.excuteproposalEntity?element.excuteproposalEntity.proposerEntity.departEntity.departName:"";

                        //评价设置
                        element.csiTime = element.csiEntity?element.csiEntity.eTime:"";
                        
                    });
                    typeof parseData === 'function' && parseData.apply(this, arguments);

                    return null;
                }
                , page: true
                , limit: 15
                , limits: [10, 15, 20, 25, 30]
                , loading: true
                , text: {
                    none: '暂无相关数据'
                }

            },options));

            
        }

        ,reload:function(tableId ,options){
            options=options?options:{};
            request = setter.request;
            //防止空指针
            options.where = options.where ? options.where : {};
            options.headers = options.headers ? options.headers : {};
            if (request.tokenName) {
                var sendData = typeof options.where === 'string'
                    ? JSON.parse(options.where)
                    : options.where;

                //自动给参数传入默认 token
                options.where[request.tokenName] = request.tokenName in sendData
                    ? options.where[request.tokenName]
                    : (layui.data(setter.tableName)[request.tokenName] || '');

                //自动给 Request Headers 传入 token
                options.headers[request.tokenName] = request.tokenName in options.headers
                    ? options.headers[request.tokenName]
                    : (layui.data(setter.tableName)[request.tokenName] || '');
            }
            return table.reload(tableId,options)

        }
        ,renderOnly:function(options){
            request = setter.request;
            //防止空指针
            options.where = options.where ? options.where : {};
            options.headers = options.headers ? options.headers : {};
            if (request.tokenName) {
                var sendData = typeof options.where === 'string'
                    ? JSON.parse(options.where)
                    : options.where;

                //自动给参数传入默认 token
                options.where[request.tokenName] = request.tokenName in sendData
                    ? options.where[request.tokenName]
                    : (layui.data(setter.tableName)[request.tokenName] || '');

                //自动给 Request Headers 传入 token
                options.headers[request.tokenName] = request.tokenName in options.headers
                    ? options.headers[request.tokenName]
                    : (layui.data(setter.tableName)[request.tokenName] || '');
            }
            return table.render(options);
        }
    }




    //对外接口
    exports('proTable', proTable);
});