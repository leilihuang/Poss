define(
    ['jQuery', 'entries/lib/ui/class', 'template', 'entries/util/util'],
    function ($, Class, template, Util) {
        var search = Class.create({
            setOptions: function (opts) {
                var options = {
                    tabCom: $("#tab-content"),
                    yy_search: $("#yy-search"),
                    tabs: $("#nav_tabs"),
                    hideCon: $("#hideCon"),
                    url: "/marketing/seller-orders",
                    total: 0,
                    user: null,
                    $this:null,
                    status: 0,
                    boolen:false
                };
                $.extend(true, this, options, opts);
            }
        }, {
            init: function (opts) {
                this.setOptions(opts);
                this.layout();
            },
            bindEval: function () {
                if (this.status == 0) {
                    Poss.dateTime();
                    this.loadSerach(this);
                    this.exportOrder(this);
                    this.delDate();
                    this.status = 1;
                    this.user = $("#yyOrder");
                    this.page();
                }
            },
            /**清除时间日期*/
            delDate: function () {
                $(".delDate").on("click", function () {
                    Util.delDate($(this));
                });
            },
            /**
             * 第一个参数传递分页的容器
             * @url 分页接口
             * */
            page: function () {
                var pageCom = this.user.find(".pagination"),
                    pre = pageCom.find(".prev"),
                    next = pageCom.find(".next"),
                    number = pageCom.find(".number"),
                    _this = this;
                Util.pageDemo(pageCom);
                next.on("click", function () {
                    var d = _this.searchVild();
                    if( Number(number.find("input").val()) < Util.totals){
                        Util.showLoding();
                    }
                    Util.nextPage(pageCom, _this.url, d, function (data) {
                        Util.hideLoding();
                        for (var i = 0; i < data.length; i++) {
                            data[i].raw_amount = Poss.spun(data[i].raw_amount);
                            data[i].raw_cash = Poss.spun(data[i].raw_cash);
                            data[i].raw_coupon = Poss.spun(data[i].raw_coupon);
                            data[i].raw_concessions_discount = Poss.spun(data[i].raw_concessions_discount);
                        }
                        _this.tableLoad(data);
                    });
                });
                pre.on("click", function () {
                    var d = _this.searchVild();
                    if( Number(number.find("input").val())-1 > 0 ){
                        Util.showLoding();
                    }
                    Util.prePage(pageCom, _this.url, d, function (data) {
                        Util.hideLoding();
                        for (var i = 0; i < data.length; i++) {
                            data[i].raw_amount = Poss.spun(data[i].raw_amount);
                            data[i].raw_cash = Poss.spun(data[i].raw_cash);
                            data[i].raw_coupon = Poss.spun(data[i].raw_coupon);
                            data[i].raw_concessions_discount = Poss.spun(data[i].raw_concessions_discount);
                        }
                        _this.tableLoad(data);
                    });
                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVild();
                    Util.enterEval(pageCom, event, $(this), _this.url, d, function (data) {
                        Util.hideLoding();
                        for (var i = 0; i < data.length; i++) {
                            data[i].raw_amount = Poss.spun(data[i].raw_amount);
                            data[i].raw_cash = Poss.spun(data[i].raw_cash);
                            data[i].raw_coupon = Poss.spun(data[i].raw_coupon);
                            data[i].raw_concessions_discount = Poss.spun(data[i].raw_concessions_discount);
                        }
                        _this.tableLoad(data);
                    });
                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            tableLoad: function (data) {
                var html = template('yy-table', {list: data});
                var $table = this.user.find(".yy-table");
                this.user.find(".yy-table").empty();
                this.onBind(html, $table);
            },
            layout: function () {
                var _this = this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.onBind(html, _this.tabCom);
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                var _this = this;
                Util.showLoding();
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET", {
                    last_cursor: "0",
                    count: Poss.count
                }, this.user, function (d, xhr) {
                    Util.hideLoding();
                    if (d.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        var date = d.data;
                        for (var i = 0; i < date.length; i++) {
                            date[i].raw_amount = Poss.spun(date[i].raw_amount);
                            date[i].raw_cash = Poss.spun(date[i].raw_cash);
                            date[i].raw_coupon = Poss.spun(date[i].raw_coupon);
                            date[i].raw_concessions_discount = Poss.spun(date[i].raw_concessions_discount);
                        }
                        var $div = $('<div></div>');
                        $('body').append($div);
                        var data = {
                            list: date,
                            href: "yyOrder"
                        };
                        $div.load('tpl/order/yyOrder.html', function () {
                            var h = template('yyOrder', data);
                            callBack(h);
                        });
                    } else {
                        Poss.errorDate("接口调用失败", "yyOrder");
                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#yy-search").on("click", function () {
                    var data = _this.searchVild();
                    Util.initPage(data);
                    Util.showLoding();
                    Poss.ajaxBack(Poss.baseUrl(_this.url), "GET", data, this.user, function (d, xhr) {
                        _this.user.find(".pagination").find(".number").find("input").val(1);
                        Util.hideLoding();
                        if (d.status == 0) {
                            _this.total = xhr.getResponseHeader("X-Total-Count");
                            var data = d.data;
                            for (var i = 0; i < data.length; i++) {
                                data[i].raw_amount = Poss.spun(data[i].raw_amount);
                                data[i].raw_cash = Poss.spun(data[i].raw_cash);
                                data[i].raw_coupon = Poss.spun(data[i].raw_coupon);
                                data[i].raw_concessions_discount = Poss.spun(data[i].raw_concessions_discount);
                            }
                            var html = template('yy-table', {list: data});
                            $("#yyOrder").find(".yy-table").empty();
                            var $table = $("#yyOrder").find(".yy-table");
                            _this.onBind(html, $table);
                            Util.setTotal(_this.total);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                });
            },
            exportOrder: function(){
                $("#yy-export").on("click", function () {
                    var url = Poss.baseUrl("/marketing/seller-orders/export")+"?auth_token="+Poss.token;
                    $('#queryInfo').attr('method',"POST");
                    $('#queryInfo').attr('action',url);
                    $('#queryInfo').submit();
                });
            },
            searchVild: function () {
                var date = {}, yy_search = $("#yy_search")
                yy_search.find(":text").each(function () {
                    if ($(this).val() != '') {
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                Poss.selectVal(this.user, date);
                return date;
            },
            //动态渲染页面，添加动态绑定事件
            onBind: function (html,$table) {
                var _this=this;
                $(html).find(".yydetail").each(function () {
                    $(this).on("click", function () {
                        _this.detail($(this));
                    });
                }).end().find(".yyOrderItmes").each(function () {
                    $(this).on("click", function () {
                        _this.orderItems($(this));
                    });
                }).end().appendTo($table);
            },
            //详情
            detail: function ($this) {
                var _this = this;
                var text = $this.text(), href = $this.attr('href'),
                    so_code = $this.parents("tr").find("td").eq(4).text();
                _this.tabs.find("a").each(function (i) {
                    if (href == $(this).attr("href")) {
                        _this.$this = $(this);
                        _this.bool = true;
                    }
                    if (i == _this.tabs.find("a").length - 1) {
                        _this.isTab(text, so_code);
                    }
                });
            },
            //子订单明细
            orderItems: function($this){
                var text = $this.text(), href = $(this).attr('href'),
                    so_code = $this.parents("tr").find("td").eq(4).text(),
                    url = "/marketing/seller-orders/"+so_code,
                    _this = this;
                Poss.ajaxBack(Poss.baseUrl(url), "GET", {}, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        var data = d.data;
                        data.create_time = Poss.isDate(data.create_time, 0);
                        data.deliver_time = Poss.isDate(data.deliver_time, 0);
                        data.effect_time = Poss.isDate(data.effect_time, 0);
                        data.complete_deadline = Poss.isDate(data.complete_deadline, 0);
                        data.complete_time = Poss.isDate(data.complete_time, 0);
                        data.raw_amount = Poss.spun(data.raw_amount);
                        data.raw_cash = Poss.spun(data.raw_cash);
                        data.raw_coupon = Poss.spun(data.raw_coupon);
                        data.raw_concessions_discount = Poss.spun(data.raw_concessions_discount);
                        var orderItems = data.order_items;
                        for (var i = 0; i < orderItems.length; i++) {
                            orderItems[i].unit_amount = Poss.spun(orderItems[i].unit_amount);
                            orderItems[i].raw_amount = Poss.spun(orderItems[i].raw_amount);
                        }
                        var h = template('order-item', {
                            list: data
                        });
                        _this.onOrderItem(h);
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            onOrderItem: function (html) {
                var _this=this;
                $(html).find(".ck_cancel").on("click", function () {
                    _this.modelHide(_this.user.find(".order-items"));
                    _this.user.find(".order-items").empty();
                }).end().appendTo(_this.user.find(".order-items"));
                this.modelShow(_this.user.find(".order-items"));
            },
            isTab: function (text, so_code) {
                var _this = this,
                    html = template('tpl-tab', {
                        text: text,
                        href: '#yydetail'
                    });
                if (_this.bool) {
                    var i = _this.$this.parent().index();
                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tplCon(so_code, 0);
                } else {
                    _this.tabs.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i = $(this).parents("li").index();
                        if ($(this).parents("li").hasClass('active')) {
                            _this.delTab(i, true, "yydetail");
                        } else {
                            _this.delTab(i, false, "yydetail");
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find("#yydetail").addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo(_this.tabs);
                    _this.tplCon(so_code);
                }
                _this.bool = false;

            },
            tplCon: function (so_code, status) {
                var url = "/marketing/seller-orders/" + so_code, _this = this;
                Poss.ajaxBack(Poss.baseUrl(url), "GET", {}, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        var data = d.data;
                        data.create_time = Poss.isDate(data.create_time, 0);
                        data.deliver_time = Poss.isDate(data.deliver_time, 0);
                        data.effect_time = Poss.isDate(data.effect_time, 0);
                        data.complete_deadline = Poss.isDate(data.complete_deadline, 0);
                        data.complete_time = Poss.isDate(data.complete_time, 0);
                        data.raw_amount = Poss.spun(data.raw_amount);
                        data.raw_cash = Poss.spun(data.raw_cash);
                        data.raw_coupon = Poss.spun(data.raw_coupon);
                        data.raw_concessions_discount = Poss.spun(data.raw_concessions_discount);
                        var orderItems = data.order_items;
                        for (var i = 0; i < orderItems.length; i++) {
                            orderItems[i].unit_amount = Poss.spun(orderItems[i].unit_amount);
                            orderItems[i].raw_amount = Poss.spun(orderItems[i].raw_amount);
                        }
                        if (status == 0) {
                            var h = template('yy-detail', {
                                list: data
                            });
                            _this.tabCom.find("#yydetail").empty();
                            _this.tabCom.find("#yydetail").append(h);
                        } else {
                            var h = template('yy-detail', {
                                editHref: 'yydetail',
                                list: data
                            });
                            _this.tabCom.find('.active').removeClass('active');
                            $(h).appendTo(_this.tabCom);
                        }
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            delTab: function (i, bool, href) {
                var tabs_li = this.tabs.find('li'),
                    panel = this.tabCom.find("#" + href);
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                if (bool) {
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
                Util.homeTab("yyOrder");
            },
            validInp: function (callback) {
                var date = {}, ck_modal = $("#ck_modal");
                ck_modal.find(":text").each(function () {
                    if ($(this).val() == '') {
                        $(this).parents('.form-group').addClass("has-error");
                    } else {
                        $(this).parents('.form-group').removeClass("has-error");
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                ck_modal.find(":radio").each(function () {
                    if ($(this).attr("checked") == "checked") {
                        date[$(this).attr("name")] = $(this).val();
                    }
                });
                ck_modal.find("select").each(function () {
                    date[$(this).attr("data-name")] = $(this).val();
                });
                var text = ck_modal.find("textarea");
                date[text.attr("data-name")] = text.val();
                callback(date);
            },
            //弹出层显示
            modelShow: function (model) {
                Util.modelShow(model);
            },
            //弹出层隐藏
            modelHide: function (model) {
                Util.modelHide(model);
            }
        });
        var s = null;
        return {
            init: function () {
                if (s != null) {
                    s.layout();
                } else {
                    s = new search();
                }
            }
        };
    }
)