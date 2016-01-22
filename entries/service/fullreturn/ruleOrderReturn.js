define(
    ['jQuery', 'entries/lib/ui/class', 'template', 'entries/util/util'],
    function ($, Class, template, Util) {
        var search = Class.create({
            setOptions: function (opts) {
                var options = {
                    tabCom: $("#tab-content"),
                    ck_search: $("#ck-search"),
                    ck_newAdd: $("#ck-newAdd"),
                    status: 0,
                    $this: null,
                    total: 0,
                    user: null,
                    url: "/marketing/full-return/return-coupons"
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
                    this.seachData(this);
                    Poss.dateTime();
                    this.status = 1;
                    this.page();
                    this.delDate();
                }
            },
            layout: function () {
                var _this = this;
                var data = {};
                this.loadData(data, 0, function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.user = $("#ruleOrderReturn");
                    _this.bindEval();
                });
            },
            isTab: function (text) {
                var _this = this,
                    html = template('tpl-tab', {
                        text: text,
                        href: '#ckEdit'
                    });
                if (_this.bool) {
                    var i = _this.user.parent().index();
                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                } else {
                    _this.tabs.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i = $(this).parents("li").index();
                        if ($(this).parents("li").hasClass('active')) {
                            _this.delTab(i, true, "ckEdit");
                        } else {
                            _this.delTab(i, false, "ckEdit");
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find("#ckEdit").addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo(_this.tabs);
                    _this.tplCon();
                }
                _this.bool = false;

            },
            delDate: function () {
                $(".delDate").on("click", function () {
                    Util.delDate($(this));
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
            },
            tplCon: function () {
                var h = template('tpl-ckEdit', {
                    editHref: 'ckEdit'
                });
                this.tabCom.find('.active').removeClass('active');
                this.tabCom.append(h);
            },
            seachData: function (_this) {
                _this.user.find("#return_search").on("click", function () {
                    _this.searchVild(function (data) {
                        _this.loadData(data, 1, function (html) {
                            //_this.user.find(".ck-table").empty();
                            //_this.user.find(".ck-table").append(html);
                        });
                    }, 0);
                });
            },
            searchVild: function (callback, status) {
                var date = {};
                this.user.find(".return_form").find(":text").each(function () {
                    date[$(this).attr("data-name")] = $(this).val();
                });
                Poss.selectVal(this.user, date);
                if (status == 0) {
                    callback(date);
                }
                return date;
            },
            isDate: function (date) {
                for (var i = 0; i < date.length; i++) {
                    date[i].createTime = Poss.isDate(date[i].createTime, 0);
                }
            },
            formatWallet: function (date) {
                for (var i = 0; i < date.length; i++) {
                    date[i].rawAmount = Poss.spun(date[i].rawAmount);
                    date[i].rawCoupon = Poss.spun(date[i].rawCoupon);
                    date[i].rawConcessionsDiscount = Poss.spun(date[i].rawConcessionsDiscount);
                    date[i].rawVipDiscount = Poss.spun(date[i].rawVipDiscount);
                    date[i].rawCash = Poss.spun(date[i].rawCash);
                }
            },
            loadData: function (data, status, callBack) {
                var _this = this;
                Util.initPage(data);
                Util.showLoding();
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET", data, this.user, function (d, xhr) {
                    Util.hideLoding();
                    if (d.status == 0) {
                        var date = d.data;
                        _this.formatWallet(date)
                        var data = {
                            list: date,
                            href: "ruleOrderReturn"
                        };
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        _this.isDate(d.data);
                        if (status == 0) {
                            var $div = $('<div></div>');
                            $('body').append($div);
                            $div.load('tpl/fullreturn/fullorderreturn.html', function () {
                                var h = template('tpl-ruleOrderReturn', data);
                                callBack(h);
                            });
                        } else {
                            var pageCom = $("#ruleOrderReturn").find(".pagination"),
                                pre = pageCom.find(".prev"),
                                next = pageCom.find(".next"),
                                number = pageCom.find(".number");
                            Util.pageDemo(pageCom);
                            Util.setTotal(_this.total);
                            number.find("input").val("1");
                            _this.tableLoad(d.data);
                        }
                    } else {
                        Poss.errorDate("接口调用失败", "ruleOrderReturn");
                    }
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
                    var d = _this.searchVild(null, 1);
                    Util.nextPage(pageCom, _this.url, d, function (data) {
                        _this.isDate(data);
                        _this.tableLoad(data);
                    });
                });
                pre.on("click", function () {
                    var d = _this.searchVild(null, 1);
                    Util.prePage(pageCom, _this.url, d, function (data) {
                        _this.isDate(data);
                        _this.tableLoad(data);
                    });
                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVild(null, 1);
                    Util.enterEval(pageCom, event, $(this), _this.url, d, function (data) {
                        _this.isDate(data);
                        _this.tableLoad(data);
                    });
                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            tableLoad: function (data) {
                var html = template('full-table', {list: data});
                this.user.find(".ck-table").empty();
                this.user.find(".ck-table").append(html);
            },
            /**设置分页总数*/
            setCount: function (total) {
                Util.total = Math.ceil(Number(this.total) / Poss.count);
                total.text(Util.total);
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