/**

 @Name：增强版layer
 @Author：losteracmer

    
 */


layui.define(['laytpl', 'layer'], function (exports) {

    var layer = layui.layer,
        $ = layui.$,
        $win = $(window), $body = $('body'),
        windowW = $win.width(),
        windowH = $win.height();

    var getWindwosStatus = function (layero) {
        let height = $(layero.selector).height();
        let weith = $(layero.selector).width();
        let top = $(layero.selector).offset().top;
        let left = $(layero.selector).offset().left;
        //console.table(height, weith, top, left);
        return {
            height:height,
            weith:weith,
            top:top,
            left:left
        }
    }

    var yyer = {
        open: function (options) {
            var success = options.success
                , skin = options.skin
                , WID = options.WID?options.WID:options.id;

            delete options.success;
            delete options.skin;
            let Warea;
            let Woffset;
            if (!layui.data("optionTable")[WID]) {
                Warea = [windowW * 0.75 + "px", windowH * 0.8 + "px"];
                Woffset = 'auto';
            } else {
                let WStatus = layui.data("optionTable")[WID];
                Warea = [WStatus.weith + 'px', WStatus.height + 'px'];
                Woffset = [WStatus.top, WStatus.left];
            }
            return layer.open($.extend({
                type: 1,
                offset: Woffset,
                area: Warea,
                moveOut: true,
                maxmin: true,
                id: WID
                // , skin: 'layui-layer-admin' + (skin ? ' ' + skin : '')
                // , closeBtn: false
                , success: function (layero, index) {
                    //添加关闭按钮
                    // var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
                    // layero.append(elemClose);
                    // elemClose.on('click', function () {
                    //     layer.close(index);
                    // });
                    //在这里执行一些自己的逻辑
                    typeof success === 'function' && success.apply(this, arguments);
                }
                , moveEnd: function (layero) {
                    // console.log("移动结束");
                    let WStatus = getWindwosStatus(layero);
                    //console.log(WStatus)
                    layui.data("optionTable", {
                        key: WID,
                        value: WStatus
                    })
                },
                resizing: function (layero) {
                    //触发过于灵敏，不建议使用此方法
                    //console.log("拉伸窗体;"+layero);
                    let WStatus = getWindwosStatus(layero);
                    //console.log(WStatus)
                    layui.data("optionTable", {
                        key: WID,
                        value: WStatus
                    })
                }
            }, options))
        }
    }

    //对外接口
    exports('yyer', yyer);
});