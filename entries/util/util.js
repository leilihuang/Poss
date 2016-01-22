define(
    ['jQuery', 'template', 'gritter'],
    function ($, template) {
        var Util = {
            total: null,
            next: null,
            pre: null,
            number: null,
            totals: 0,
            Page: 0,
            tabs: $("#nav_tabs"),
            tabCom: $("#tab-content"),
            hideCon: $("#hideCon"),
            model: $("#md-3dRotateRight"),
            Tips:$("#Tips"),
            loginUrl:"",
            /**
             * pageNum 页码
             * total 总数
             * */
            pageNum: function (url, data,  callback) {
                var _this=this,u=Poss.baseUrl(url);
                if(this.loginUrl!=""){
                    u=Poss.logUrl(url);
                }
                Poss.ajaxBack(u, "GET", data, null, function (d, xhr) {
                    if (d.status == 0) {
                        _this.hideLoding();
                        callback(d.data, xhr);
                        Util.setTotal(xhr.getResponseHeader("X-Total-Count"));
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            pageDemo: function (pageCom,users) {
                this.pre = pageCom.find(".prev");
                this.next = pageCom.find(".next");
                this.number = pageCom.find(".number");
                this.total = pageCom.find(".total");
                if(users){
                    this.loginUrl=users;
                }else{
                    this.loginUrl="";
                }
            },
            /**
             * 下一页
             * @*/
            nextPage: function (pageCom, url, d, callback,users) {
                var _this = this;
                this.pageDemo(pageCom,users);
                if(_this.number.find("input").val()=="" || _this.number.find("input").val()=="0"){
                    _this.number.find("input").val(1);
                }
                var pageNum = Number(_this.number.find("input").val()) + 1;
               if (pageNum > _this.totals) {
                    return false;
                } else {
                    if(pageNum == _this.totals){
                        _this.next.addClass("disabled");
                    }
                    _this.number.find("input").val(pageNum);
                    _this.pre.removeClass("disabled");
                    d["last_cursor"] = (pageNum - 1) * 10;
                    d["count"] = Poss.count;
                    _this.pageNum(url, d, function (data) {
                        callback(data);
                    });
                }
            },
            /**上一页*/
            prePage: function (pageCom, url, d, callback,users) {
                var _this = this;
                this.pageDemo(pageCom,users);
                if(_this.number.find("input").val()=="" || _this.number.find("input").val()=="0"){
                    _this.number.find("input").val(1);
                }
                var pageNum = Number(_this.number.find("input").val()) - 1;
                if (pageNum < 1) {
                    return false;
                } else {
                    if (pageNum == 1) {
                        _this.pre.addClass("disabled");
                    }
                    _this.number.find("input").val(pageNum);
                    _this.next.removeClass("disabled");
                    d["last_cursor"] = (pageNum - 1) * 10;
                    d["count"] = Poss.count;
                    _this.pageNum(url, d,  function (data) {
                        callback(data);
                    });
                }
            },
            /**按回车键查询*/
            enterEval: function (pageCom, event, $input, url, d, callback,users) {
                var _this = this;
                this.pageDemo(pageCom,users);
                if (event.keyCode == 13) {
                    Util.showLoding();
                    if(_this.number.find("input").val()=="" || _this.number.find("input").val()=="0"){
                        _this.number.find("input").val(1);
                    }
                    if (_this.number.find("input").val() == 1) {
                        _this.pre.addClass("disabled");
                        _this.next.removeClass("disabled");
                    } else if (_this.number.find("input").val() == _this.totals) {
                        _this.next.addClass("disabled");
                        _this.pre.removeClass("disabled");
                    } else {
                        _this.pre.removeClass("disabled");
                        _this.next.removeClass("disabled");
                    }
                    d["last_cursor"] = (Number($input.val()) - 1) * 10;
                    d["count"] = Poss.count;
                    _this.pageNum(url, d, function (data) {
                        callback(data);
                    });
                } else {
                    if (Number(_this.number.find("input").val()) < 1) {
                        //_this.number.find("input").val(1);
                    } else if (Number(_this.number.find("input").val()) > _this.totals) {
                        _this.number.find("input").val(_this.totals);
                    }
                    _this.number.find("input").val(_this.number.find("input").val().replace(/\D/g, ''));
                }

            },
            setTotal: function (num) {
                var d = Math.ceil(Number(num) / Poss.count),
                    val=this.number.find("input").val();
                if (d == 0) {
                    d = d + 1;
                    this.number.find("input").val("1");
                    this.next.addClass("disabled");
                    this.pre.addClass("disabled");
                }
                if(val==1){
                    this.pre.addClass("disabled");
                    this.next.removeClass("disabled");
                    if(d==1){
                        this.next.addClass("disabled");
                    }
                }
                Util.totals = d;
                Util.total.text(d);
            },
            /**初始化分页
             * @date 为参数集合*/
            initPage: function (date) {
                date["last_cursor"] = this.Page;
                date["count"] = Poss.count;
            },
            /**判断是否打开了一个tab，并且添加tab切换事件和关闭事件*/
            isTab: function (text, newId, bool, $this, callback) {
                var _this = this, html = template('tpl-tab', {
                    text: text,
                    href: newId
                });
                var h = newId.replace("#", '');
                if (bool) {
                    var i = $this.parent().index();
                    this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                    callback(0);
                } else {
                    this.tabs.find(".active").removeClass('active');
                    this.tabCom.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i = $(this).parents("li").index();
                        if ($(this).parents("li").hasClass('active')) {
                            _this.delTab(i, true, h);
                        } else {
                            _this.delTab(i, false, h);
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find(newId).addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo(_this.tabs);
                    callback(1);
                }
            },
            /**关闭tab*/
            delTab: function (i, bool, href) {
                var tabs_li = this.tabs.find('li'),
                    panel = this.tabCom.find("#" + href);
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                if (bool) {
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            },
            /**公用弹出层显示*/
            modelShow: function ($this) {
                $this.find(".form-primary").addClass("md-show").css("perspective", "none");
            },
            /**公用弹出层隐藏*/
            modelHide: function ($this) {
                $this.find(".form-primary").removeClass("md-show").css("perspective", "1300px");
            },
            successTip: function (title, text) {
                $.gritter.add({
                    title: title,
                    text: text,
                    class_name: 'success'
                });
            },
            errorTip: function (title, text) {
                $.gritter.add({
                    title: title,
                    text: text,
                    class_name: 'danger'
                });
            },
            showLoding: function () {
                this.Tips.show();
            },
            hideLoding: function () {
                this.Tips.hide();
            },
            swithcAnimate: function () {
                $('.switch').bootstrapSwitch();
            },
            //必填项验证
            vaildinput: function ($Com,data,vaild) {
                $Com.find(":text").each(function () {
                    if($(this).hasClass("mandatory") && $(this).val()==""){
                        $(this).parents(".form-group").addClass("has-error");
                        vaild=1;
                    }else{
                        if($(this).parents(".form-group").hasClass("has-error")){
                            $(this).parents(".form-group").removeClass("has-error");
                        }
                        data[$(this).attr("data-name")]=$(this).val();
                    }
                });
            },
            delDate: function ($this) {
                $this.parents(".form-group").find("input").val("");
            },
            clearVal: function (id) {
                $("#"+id).find(":text").each(function () {
                    if($(this).attr("data-name")){
                        $(this).val("");
                    }
                });
                $("#"+id).find("textarea").each(function () {
                    if($(this).attr("data-name")){
                        $(this).val("");
                    }
                });
            },
            /**homeId 表示上页的唯一id*/
            homeTab: function (homeId) {
                var panel = this.tabCom.find("#" + homeId),
                    index=panel.index();
                if (panel.length>0) {
                    this.tabs.find('li').eq(index).addClass("active").siblings(".active").removeClass("active");
                    this.tabCom.find('.tab-pane').eq(index).addClass("active").siblings(".active").removeClass("active");
                }else{
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            }
        };
        return Util;
    }
)