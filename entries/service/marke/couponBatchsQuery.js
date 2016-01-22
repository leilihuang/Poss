define(
    ['jQuery', 'entries/lib/ui/class', 'template', 'entries/util/util'],
    function ($, Class, template, Util) {
        var id = "couponBatchsQuery";
        var editId = "couponBatchsEdit";
        var baseUrl = "/marketing/coupon-batchs";
        var search = Class.create({
            setOptions: function (opts) {
                var options = {
                    tabs: $("#nav_tabs"),
                    tabCom: $("#tab-content"),
                    hideCon: $("#hideCon"),
                    url: "/marketing/coupon-batchs",
                    status: 0,
                    total: 0,
                    $this: null,
                    user: null,
                    bool: false
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
                    this.user = $("#"+id);
                    this.status = 1;
                    Poss.dateTime();
                    this.loadSerach(this);
                    this.delDate();
                    this.cancel(this);
                    this.page();
                }
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
                    Util.nextPage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                pre.on("click", function () {
                    var d = _this.searchVild();
                    Util.prePage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVild();
                    Util.enterEval(pageCom, event, $(this), _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            tableLoad: function (data) {
                var html = template('couponBatchs-table', {list: data});
                var $table = this.user.find(".couponBatchs-table");
                this.user.find(".couponBatchs-table").empty();
                this.edit(html, $table);
            },
            layout: function () {
                var _this = this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.edit(html, _this.tabCom);
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                var _this = this;
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET", {
                    last_cursor: "0",
                    count: Poss.count
                }, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        var $div = $('<div></div>');
                        $('body').append($div);
                        var data = {
                            list: d.data,
                            href: id
                        };
                        $div.load('tpl/markingMgm/couponBatchsQuery.html', function () {
                            var h = template('tpl-couponBatchsQuery', data);
                            callBack(h);
                        });

                    } else {
                        Poss.errorDate("接口调用失败，请刷新页面",id);
                    }
                });
            },
            /**清除时间日期*/
            delDate: function () {
                $(".delDate").on("click", function () {
                    $(this).parents(".input-group").find("input").val("");
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#couponBatchs-button").on("click", function () {
                    var d = _this.searchVild();
                    Util.initPage(d);
                    _this.loadEdit(d, _this);
                });
            },
            loadEdit: function (date, _this) {
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET", date, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        var pageCom = $("#"+id).find(".pagination"),
                            number = pageCom.find(".number"),
                            total = pageCom.find(".total");
                        number.find("input").val(1);
                        _this.tableLoad(d.data);
                        Util.setTotal(_this.total);
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            searchVild: function () {
                var date = {};
                this.user.find(":text").each(function () {
                    if ($(this).val() != '') {
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                Poss.selectVal(this.user, date);
                return date;
            },
            //修改内容
            edit: function (html, $table) {
                var _this = this;
                $(html).find(".couponGerRule_export").each(function () {
                    $(this).on('click', function () {
                        var ck_id = $(this).parents("tr").find("td").eq(1).text();
                        _this.tabs.find("a").each(function (i) {
                            window.location.href=Poss.baseUrl(_this.url)+"/export/"+ck_id+"?auth_token="+ document.cookie.split(";")[0].split("=")[1];
                        });
                    })
                }).end().find(".couponGerRule_edit").each(function () {
                    $(this).on('click', function () {
                        var text = $(this).text(), href = $(this).attr('href'),
                            ck_id = $(this).parents("tr").find("td").eq(1).text();
                        _this.tabs.find("a").each(function (i) {
                            if (href == $(this).attr("href")) {
                                _this.$this = $(this);
                                _this.bool = true;
                            }
                            if (i == _this.tabs.find("a").length - 1) {
                                _this.isTab(text, ck_id);
                            }
                        });
                    })
                }).end().appendTo($table);
            },
            isTab: function (text, ck_id) {
                var _this = this;
                Util.isTab(text, '#'+editId, this.bool, this.$this, function (status) {
                    if (status == 0) {
                        _this.tplCon(ck_id, 0);
                    } else {
                        _this.tplCon(ck_id);
                    }
                });
                this.bool = false;
            },
            tplCon: function (ck_id, status) {
                var _this = this;
                var url = baseUrl +"/" + ck_id
                Poss.ajaxBack(Poss.baseUrl(url), "GET", {}, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        if (status == 0) {
                        /*    var h = template('editUp', {
                                list: d.data
                            });
                            _this.tabCom.find("#"+editId).find(".editUp").empty();
                            _this.tabCom.find("#"+editId).find(".editUp").append(h);*/
                        } else {
                            var h = template('tpl-couponBatchsEdit', {
                                editHref: editId,
                                list: d.data
                            });
                            _this.tabCom.find('.active').removeClass('active');
                            $(h).find(".edit-cen").on("click", function () {
                                _this.delTab($("#"+editId).index(), true, editId);
                            }).end().find(".edit-sub").on("click", function () {
                                _this.editSub();
                            }).end().appendTo(_this.tabCom);
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
            },
            //取消
            cancel: function (_this) {
                $(".ck_cancel").on("click", function () {
                    _this.modelHide();
                });
            },
            //弹出层显示
            modelShow: function () {
                Util.modelShow(this.user);
            },
            //弹出层隐藏
            modelHide: function () {
                Util.modelHide(this.user);
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