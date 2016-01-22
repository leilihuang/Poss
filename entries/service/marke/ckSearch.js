define(
    ['jQuery', 'entries/lib/ui/class', 'template', 'entries/util/util','icheck'],
    function ($, Class, template, Util) {
        var search = Class.create({
            setOptions: function (opts) {
                var options = {
                    tabs: $("#nav_tabs"),
                    tabCom: $("#tab-content"),
                    /*                    ck_search:$("#ck-search"),
                     ck_newAdd:$("#ck-newAdd"),*/
                    hideCon: $("#hideCon"),
                    url: "/marketing/coupon-kinds",
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
                    this.user = $("#ckSearch");
                    this.status = 1;
                    Poss.dateTime();
                    this.loadAdd(this);
                    this.loadSerach(this);
                    this.cancel(this);
                    this.submit(this);
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
                var html = template('ck-table', {list: data});
                var $table = this.user.find(".ck-table");
                this.user.find(".ck-table").empty();
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
                Poss.ajaxBack(Poss.baseUrl("/marketing/coupon-kinds"), "GET", {
                    last_cursor: "0",
                    count: Poss.count
                }, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        var $div = $('<div></div>');
                        $('body').append($div);
                        var data = {
                            list: d.data,
                            href: "ckSearch"
                        };
                        $div.load('tpl/markingMgm/ckSearch.html', function () {
                            var h = template('tpl-ckSearch', data);
                            callBack(h);
                        });

                    } else {
                        Poss.errorDate("接口调用失败，请刷新页面","ckSearch");
                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                this.user.find(".cx_search").on("click", function () {
                    var d = _this.searchVild();
                    _this.loadEdit(d, _this);
                });
            },
            loadEdit: function (date, _this) {
                Util.initPage(date);
                Poss.ajaxBack(Poss.baseUrl('/marketing/coupon-kinds'), "GET", date, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        var pageCom = $("#ckSearch").find(".pagination"),
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
                this.user.find(".ck_search").find(":text").each(function () {
                    if ($(this).val() != '') {
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                Poss.selectVal(this.user.find(".ck_search"), date);
                return date;
            },
            //新增
            loadAdd: function (_this) {
                $("#ck-newAdd").on("click", function () {
                    $("#ck_modal").find(":text").val("");
                    $("#ck_modal").find("textarea").val("");
                    _this.modelShow();
                });
            },
            //修改内容
            edit: function (html, $table) {
                var _this = this;
                $(html).find(".edits").each(function () {
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
                $('.icheck').iCheck({
                    checkboxClass: 'icheckbox_square-blue checkbox',
                    radioClass: 'iradio_square-blue'
                });
            },
            isTab: function (text, ck_id) {
                var _this = this;
                Util.isTab(text, '#ckEdit', this.bool, this.$this, function (status) {
                    if (status == 0) {
                        _this.tplCon(ck_id, 0);
                    } else {
                        _this.tplCon(ck_id);
                    }
                });
                this.bool = false;
            },
            tplCon: function (ck_id, status) {
                var url = "/marketing/coupon-kinds/" + ck_id, _this = this;
                Poss.ajaxBack(Poss.baseUrl(url), "GET", {}, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        if (status == 0) {
                            var h = template('editUp', {
                                list: d.data
                            });
                            _this.tabCom.find("#ckEdit").find(".editUp").empty();
                            _this.tabCom.find("#ckEdit").find(".editUp").append(h);
                        } else {
                            var h = template('tpl-ckEdit', {
                                editHref: 'ckEdit',
                                list: d.data
                            });
                            _this.tabCom.find('.active').removeClass('active');
                            $(h).find(".edit-cen").on("click", function () {
                                _this.delTab($("#ckEdit").index(), true, "ckEdit");
                            }).end().find(".edit-sub").on("click", function () {
                                _this.editSub();
                            }).end().appendTo(_this.tabCom);
                        }
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            editSub: function () {
                var _this = this;
                this.editVail(function (data) {
                    var url = "/marketing/coupon-kinds/" + data["ck_id"];
                    Poss.ajaxBack(Poss.baseUrl(url), "PUT", Poss.isJson(data), this.user, function (d, xhr) {
                        if (d.status == 0) {
                            var i = _this.tabs.find(".active").index();
                            _this.delTab(i, true, "ckEdit");
                            _this.loadEdit({}, _this);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                });
            },
            editVail: function (callback) {
                var date = {}, ck_modal = $("#ckEdit").find(".editUp");
                Poss.inputVal(ck_modal, date);
                Poss.radioVal(ck_modal, date);
                Poss.selectVal(ck_modal, date);
                callback(date);
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
                Util.homeTab("ckSearch");
            },
            //取消
            cancel: function (_this) {
                $(".ck_cancel").on("click", function () {
                    _this.modelHide();
                });
            },
            //提交
            submit: function (_this) {
                $("#ck_submit").on("click", function () {
                    _this.validInp(function (date,vaild) {
                        if(vaild!=1){
                            Poss.ajaxBack(Poss.baseUrl("/marketing/coupon-kinds"), "POST", date, this.user, function (d, xhr) {
                                if (d.status == 0) {
                                    var d = _this.searchVild();
                                    Util.initPage(d);
                                    _this.loadEdit(d, _this);
                                    _this.modelHide();
                                } else {
                                    Poss.isDeBug("接口调用失败", 1);
                                }
                            });
                        }
                    });
                });
            },
            //新增数据
            validInp: function (callback) {
                var date = {}, ck_modal = $("#ck_modal"),vaild=0;
                ck_modal.find(":text").each(function () {
                    if($(this).hasClass("mandatory") && $(this).val()==""){
                        $(this).parents(".form-group").addClass("has-error");
                        vaild=1;
                    }else{
                        if($(this).parents(".form-group").hasClass("has-error")){
                            $(this).parents(".form-group").removeClass("has-error");
                        }
                        date[$(this).attr("data-name")]=$(this).val();
                    }
                });
                Poss.radioVal(ck_modal, date);
                Poss.selectVal(ck_modal, date);
                var text = ck_modal.find("textarea");
                date[text.attr("data-name")] = text.val();
                callback(Poss.isJson(date),vaild);
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