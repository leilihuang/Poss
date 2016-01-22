define(
    ['jQuery', 'entries/lib/ui/class', 'template', 'entries/util/util'],
    function ($, Class, template, Util) {
        var search = Class.create({
            setOptions: function (opts) {
                var options = {
                    tabCom: $("#tab-content"),
                    rule_add: $("#rule-add"),
                    ck_newAdd: $("#ck-newAdd"),
                    $this: null,
                    tabs: $("#nav_tabs"),
                    status: 0,
                    user: null,
                    total: 0,
                    qr_id: 0,
                    url: "/marketing/full-return/rules",
                    homeid: "ruleSetting"
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
                    this.status = 1;
                    this.addRule();
                    this.queryRule(this);
                    this.page();
                }
            },
            layout: function () {
                var _this = this;
                var data = {};
                this.loadData(data, function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.edit(html, _this.tabCom);
                    _this.clearContent();
                    _this.bindEval(html);
                }, 0);
            },
            //点击查询规则列表
            queryRule: function (_this) {
                $("#rule-search").on("click", function () {
                    _this.searchVild(function (data) {
                        _this.loadData(data, function () {
                        }, 1);
                    }, 0);
                });
            },
            //获取查询参数
            searchVild: function (callback, status) {
                var date = {};
                $(".rulesetting").find(":text").each(function () {
                    date[$(this).attr("data-name")] = $(this).val();
                });
                if (status == 0) {
                    callback(date);
                }
                return date
            },
            //进入页面查询规则列表
            loadData: function (data, callBack, status) {
                var _this = this;
                Util.initPage(data);
                Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/rules'), "GET", data, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        if (status == 0) {
                            var $div = $('<div></div>');
                            $('body').append($div);
                            var data = {
                                list: d.data,
                                href: "ruleSetting"
                            };
                            $div.load('tpl/fullreturn/ruleSetting.html', function () {
                                var h = template('tpl-ruleSetting', data);
                                callBack(h);
                            });
                        } else {
                            var pageCom = $("#ruleSetting").find(".pagination"),
                                pre = pageCom.find(".prev"),
                                next = pageCom.find(".next"),
                                number = pageCom.find(".number");
                            Util.pageDemo(pageCom);
                            Util.setTotal(_this.total);
                            number.find("input").val("1");
                            _this.tableLoad(d.data);
                        }
                    } else {
                        Poss.errorDate("接口调用失败", "ruleSetting");
                    }
                });
            },
            //修改规则页面跳转
            edit: function (html, $table) {
                var _this = this;
                $(html).find(".edits").each(function () {
                    $(this).on('click', function () {
                        var text = $(this).text(), href = $(this).attr('href');
                        _this.qr_id = $(this).parents("tr").find("td").eq(2).text();
                        _this.tabs.find("a").each(function (i) {
                            if (href == $(this).attr("href")) {
                                _this.user = $(this);
                                _this.$this = $(this);
                                _this.bool = true;
                            }
                            if (i == _this.tabs.find("a").length - 1) {
                                _this.isTab(text, 'tpl-ruleEdit', '#ruleEdit');
                            }
                        });
                    })
                }).end().appendTo($table);
            }
            ,
            //新增规则切换模板
            addRule: function () {
                var _this = this;
                $("#rule-add").on('click', function () {
                    var text = $(this).text(), href = $(this).attr('href');
                    _this.tabs.find("a").each(function (i) {
                        if (href == $(this).attr("href")) {
                            _this.$this = $(this);
                            _this.bool = true;
                        }
                        if (i == _this.tabs.find("a").length - 1) {
                            _this.isTab(text, 'tpl-addRule', '#addRule');
                        }
                    });
                })
            },
            //规则列表页面清空输入框内容
            clearContent: function () {
                $("#qury-clear").on('click', function () {
                    $("#ruleSetting").find(".form-control").val('');
                });
            },
            isTab: function (text, temp, tabid) {
                var _this = this;
                Util.isTab(text, tabid, this.bool, this.$this, function (status) {
                    if (status == 1) {
                        if (tabid == "#ruleEdit") {
                            _this.reviseQuery(_this.qr_id);
                        }
                        _this.tplCon(temp, tabid);
                    }
                });
                this.bool = false;
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
            tplCon: function (temp, tabid) {
                var _this = this;
                var h = template(temp, {
                    addRule: tabid.replace("#", "")
                });
                this.tabCom.find('.active').removeClass('active');
                $(h).find(".datetime").datetimepicker({autoclose: true}).end()
                    .find("#add_items").on('click', function () {
                        var $this = $(this);
                        var pass = 1;
                        var data = {
                            coupon_id: []
                        };
                        //新增一条规则
                        //输入校验
                        $("#create_Rules").find("input").each(function () {
                            if ($(this).hasClass("mandatory") && $(this).val() == "") {
                                $(this).parents(".form-group").addClass("has-error");
                                pass = 0;
                            } else {
                                if ($(this).parents(".form-group").hasClass("has-error")) {
                                    $(this).parents(".form-group").removeClass("has-error");
                                }
                                data[$(this).attr("data-name")] = $(this).val();
                            }
                        });
                        if (pass == 1) {
                            //验证通过
                            $("#newcouponDiv").find(":text").each(function () {
                                if ($(this).hasClass("ck_id")) {
                                    if ($(this).val() != '') {
                                        data.coupon_id.push({ck_id: $(this).val()});
                                    }
                                }
                            });
                            //判断添加是优惠券id是否重复
                            var couponid_list = [];
                            $.each(data.coupon_id, function (n, value) {
                                couponid_list.push(value.ck_id)
                            });

                            var isRepeat = 0;
                            var isVaild = 0;
                            var nary = couponid_list.sort();
                            for (var i = 0; i < couponid_list.length; i++) {
                                if (nary[i] == nary[i + 1]) {
                                    isRepeat = 1;
                                }
                            }
                            $("#newcouponDiv").find(":text").each(function () {
                                if ($(this).hasClass("man_new")) {
                                    if ($(this).val() == '') {
                                        isVaild = 1;
                                    }
                                }
                            });
                            if (isRepeat == 0) {
                                //优惠券合法
                                if (isVaild == 0) {
                                    Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/rules'), "POST", Poss.isJson(data), this.user, function (d, xhr) {
                                        if (d.status == 0) {
                                            Poss.isDeBug("规则添加成功!", 1);
                                            //关闭tab
                                            var i = $this.parents("#addRule").index();
                                            var tabs_li = $("#nav_tabs").find('li'),
                                                panel = $("#tab-content").find("#addRule");
                                            tabs_li.eq(i).remove();
                                            $("#hideCon").append(panel);
                                            if (true) {
                                                $("#nav_tabs").find('li').eq(0).addClass("active");
                                                $("#tab-content").find('.tab-pane').eq(0).addClass("active");
                                            }
                                            //返回到主页
                                            Util.homeTab("ruleSetting");
                                        } else {
                                            Poss.isDeBug(d.data.message, 1);
                                        }
                                    });
                                }else{
                                    Poss.isDeBug("优惠券类型不合法,请确认!", 1);
                                }
                            } else {
                                Poss.isDeBug("包含相同的优惠券类型，请确认！", 1);
                            }
                        }
                    }).end()
                    .find(".newId").on('click', function () {
                        //新增规则界面增加优惠券规则
                        var h = $("#noDatacouponItems").html();
                        $(h).find(".deteleCoupon").on("click", function () {
                            var i = $(this).parents(".form-group").index();
                            console.log(i);
                            if (i != 0) {
                                $(this).parents('.form-group').remove();
                            } else {
                                Util.errorTip("提示信息", "不可删除,至少匹配一个优惠券类型");
                            }
                        }).end().find(".ck_id").on("focusout", function () {
                            //动态绑定事件
                            var ck_value = $(this).val(), $this = $(this);
                            if (ck_value == '') {
                                Poss.isDeBug("优惠券类型id不能为空", 1);
                            } else {
                                var date = {};
                                date["ck_id"] = ck_value;
                                Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/coupon-exsit'), "GET", date, this.user, function (d, xhr) {
                                    if (d.status == 0) {
                                        $this.nextAll(".man_new").val(d.data.requirement * 0.01);
                                        $this.nextAll(".jian_new").val(d.data.value * 0.01);
                                    } else {
                                        Poss.isDeBug(d.data.message, 1);
                                    }
                                });
                            }
                        }).end().appendTo($("#newcouponDiv"));
                    }).end()
                    .find("#confirm_add").on('click', function () {
                        var $this = $(this);
                        var pass = 1;
                        var data = {
                            coupon_id: []
                        };
                        //修改规则非空校验
                        $("#alter_rule").find("input").each(function () {
                            if ($(this).hasClass("mandatory") && $(this).val() == "") {
                                $(this).parents(".form-group").addClass("has-error");
                                pass = 0;
                            } else {
                                if ($(this).parents(".form-group").hasClass("has-error")) {
                                    $(this).parents(".form-group").removeClass("has-error");
                                }
                                data[$(this).attr("data-name")] = $(this).val();
                            }
                        });
                        if (pass == 1) {
                            //修改规则
                            $("#couponDiv").find(":text").each(function () {
                                if ($(this).hasClass("ck_id")) {
                                    if ($(this).val() != '') {
                                        data.coupon_id.push({ck_id: $(this).val()});
                                    }
                                }
                            });
                            //判断是否优惠券是否重复
                            var couponid_list = [];
                            $.each(data.coupon_id, function (n, value) {
                                couponid_list.push(value.ck_id)
                            });
                            var isVaild = 0;
                            var isRepeat = 0;
                            var nary = couponid_list.sort();
                            for (var i = 0; i < couponid_list.length; i++) {
                                if (nary[i] == nary[i + 1]) {
                                    isRepeat = 1;
                                }
                            }

                            $("#couponDiv").find(":text").each(function () {
                                if ($(this).hasClass("man_new")) {
                                    if ($(this).val() == '') {
                                        isVaild=1
                                    }
                                }
                            });

                            //判断优惠券存不存在
                            if (isRepeat == 0) {
                                if (isVaild == 0) {
                                    //修改手动添加
                                    var qr_id = $("#alter_rule").find("#qr_id").val();
                                    var url = '/marketing/full-return/rules/' + qr_id
                                    Poss.ajaxBack(Poss.baseUrl(url), "PATCH", Poss.isJson(data), this.user, function (d, xhr) {
                                        if (d.status == 0) {
                                            Poss.isDeBug("规则修改成功!", 1);
                                            //关闭tab
                                            var i = $this.parents("#ruleEdit").index();
                                            var tabs_li = $("#nav_tabs").find('li'),
                                                panel = $("#tab-content").find("#ruleEdit");
                                            tabs_li.eq(i).remove();
                                            $("#hideCon").append(panel);
                                            if (true) {
                                                $("#nav_tabs").find('li').eq(0).addClass("active");
                                                $("#tab-content").find('.tab-pane').eq(0).addClass("active");
                                            }
                                            //返回到主页
                                            Util.homeTab("ruleSetting");
                                        } else {
                                            Poss.isDeBug(d.data.message, 1);
                                        }
                                    });
                                } else {
                                    Poss.isDeBug("优惠券类型不合法,请确认!", 1);
                                }
                            } else {
                                Poss.isDeBug("包含相同的优惠券类型，请确认！", 1);
                            }
                        }
                    }).end()
                    .find("#close_item").on('click', function () {
                        var i = $(this).parents("#tpl-addRule").index();
                        var tabs_li = $("#nav_tabs").find('li'),
                            panel = $("#tab-content").find("#addRule");
                        tabs_li.eq(i).remove();
                        $("#hideCon").append(panel);
                        if (true) {
                            $("#nav_tabs").find('li').eq(0).addClass("active");
                            $("#tab-content").find('.tab-pane').eq(0).addClass("active");
                        }
                        Util.homeTab("ruleSetting");
                    }).end()
                    .find("#alert_cancel").on('click', function () {
                        var i = $(this).parents("#tpl-ruleEdit").index();
                        var tabs_li = $("#nav_tabs").find('li'),
                            panel = $("#tab-content").find("#ruleEdit");
                        tabs_li.eq(i).remove();
                        $("#hideCon").append(panel);
                        if (true) {
                            $("#nav_tabs").find('li').eq(0).addClass("active");
                            $("#tab-content").find('.tab-pane').eq(0).addClass("active");
                        }
                        Util.homeTab("ruleSetting");
                    }).end()
                    .find(".addcoupon").on('click', function () {
                        //修改界面新增优惠券规则
                        var h = $("#noDatacouponItems").html();
                        $(h).find(".deteleCoupon").on("click", function () {
                            var i = $(this).parents(".form-group").index();
                            if (i != 0) {
                                $(this).parents('.form-group').remove();
                            } else {
                                Util.errorTip("提示信息", "不可删除,至少匹配一个优惠券类型");
                            }
                        }).end().find(".ck_id").on("focusout", function () {
                            var $this = $(this);
                            //修改手动添加
                            var ck_value = $(this).val();
                            if (ck_value == '') {
                                Poss.isDeBug("优惠券类型id不能为空", 1);
                            } else {
                                var date = {};
                                date["ck_id"] = ck_value;
                                Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/coupon-exsit'), "GET", date, this.user, function (d, xhr) {
                                    if (d.status == 0) {
                                        $this.nextAll(".man_new").val(d.data.requirement * 0.01);
                                        $this.nextAll(".jian_new").val(d.data.value * 0.01);
                                    } else {
                                        Poss.isDeBug(d.data.message, 1);
                                    }
                                });
                            }
                        }).end().appendTo($("#couponDiv"));
                    }).end()
                    //第一条数据
                    .find(".ck_id").on('focusout', function () {
                        var ck_value = $(this).val(), $this = $(this);
                        if (ck_value == '') {
                            Poss.isDeBug("优惠券类型id不能为空", 1);
                        } else {
                            var date = {};
                            date["ck_id"] = ck_value;
                            Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/coupon-exsit'), "GET", date, this.user, function (d, xhr) {
                                if (d.status == 0) {
                                    $this.nextAll(".man_new").val(d.data.requirement * 0.01);
                                    $this.nextAll(".jian_new").val(d.data.value * 0.01);
                                } else {
                                    Poss.isDeBug(d.data.message, 1);
                                }
                            });
                        }
                    }).end()
                    .find(".coupon-value").on('click', function () {
                        //新增规则页面计算优惠券总额度
                        var $this = $(this);
                        var array = [];
                        $("#newcouponDiv").find(":text").each(function () {
                            if ($(this).hasClass("jian_new")) {
                                if ($(this).val() != '') {
                                    array.push($(this).val());
                                }
                            }
                        });
                        var sum = 0;
                        for (var i = 0; i < array.length; i++) {
                            var result = parseInt(array[i]);
                            sum += result;
                        }
                        $this.nextAll(".coupon-count").val(sum);
                    }).end()
                    .find(".alert-coupon-value").on('click', function () {
                        //新增规则页面计算优惠券总额度
                        var $this = $(this);
                        var array = [];
                        $("#couponDiv").find(":text").each(function () {
                            if ($(this).hasClass("jian_new")) {
                                if ($(this).val() != '') {
                                    array.push($(this).val());
                                }
                            }
                        });
                        var sum = 0;
                        for (var i = 0; i < array.length; i++) {
                            var result = parseInt(array[i]);
                            sum += result;
                        }
                        $this.nextAll(".coupon-count").val(sum);
                    }).end()
                    .find(".delDate").on('click', function () {
                        Util.delDate($(this));
                    }).end().appendTo(this.tabCom);
            },
            //修改查询
            reviseQuery: function (data) {
                var _this = this;
                var date = {};
                date["ck_id"] = data;
                date["last_cursor"] = 0;
                date["count"] = 10;
                Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/rules'), "GET", date, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        if (d.data[0].name != null) {
                            $("#ruleEdit").find("#name").val(d.data[0].name);
                        }
                        if (d.data[0].end_date != null) {
                            $("#ruleEdit").find("#endtime").val(d.data[0].end_date);
                        }
                        if (d.data[0].limit_nums != null) {
                            $("#ruleEdit").find("#nums").val(d.data[0].limit_nums);
                        }
                        if (d.data[0].start_date != null) {
                            $("#ruleEdit").find("#starttime").val(d.data[0].start_date);
                        }
                        if (d.data[0].limit_amount != null) {
                            $("#ruleEdit").find("#limit").val(d.data[0].limit_amount);
                        }
                        if (d.data[0].qr_id != null) {
                            $("#ruleEdit").find("#qr_id").val(d.data[0].qr_id);
                        }
                        //优惠券列表
                        _this.queryCoupon(d.data[0].qr_id);
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            //通过规则id查询匹配的优惠规则
            queryCoupon: function (couponid) {
                var date = {};
                date["qr_id"] = couponid;
                Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/coupon-types'), "GET", date, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        var h = template('couponItems', {
                            data: d.data
                        });
                        $(h).find(".deteleCoupon").on("click", function () {
                            var i = $(this).parents(".form-group").index();
                            console.log(i);
                            if (i != 0) {
                                $(this).parents('.form-group').remove();
                            } else {
                                Util.errorTip("提示信息", "最少要保留一条数据!");
                            }
                        }).end().find(".ck_id").on("focusout", function () {
                            //查询出来自动添加
                            var ck_value = $(this).val(), $this = $(this);
                            if (ck_value == '') {
                                Poss.isDeBug("优惠券类型id不能为空", 1);
                            } else {
                                var date = {};
                                date["ck_id"] = ck_value;
                                Poss.ajaxBack(Poss.baseUrl('/marketing/full-return/coupon-exsit'), "GET", date, this.user, function (d, xhr) {
                                    if (d.status == 0) {
                                        $this.nextAll(".man_new").val(d.data.requirement * 0.01);
                                        $this.nextAll(".jian_new").val(d.data.value * 0.01);
                                    } else {
                                        Poss.isDeBug(d.data.message, 1);
                                    }
                                });
                            }
                        }).end().appendTo($("#couponDiv"));
                    } else {
                        Poss.isDeBug(d.data.message, 1);
                    }
                });
            },
            /**
             * 第一个参数传递分页的容器
             * @url 分页接口
             * */
            page: function () {
                var pageCom = $("#ruleSetting").find(".pagination"),
                    pre = pageCom.find(".prev"),
                    next = pageCom.find(".next"),
                    number = pageCom.find(".number"),
                    _this = this;
                Util.pageDemo(pageCom);
                next.on("click", function () {
                    var d = _this.searchVild(null, 1);
                    Util.nextPage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });

                });
                pre.on("click", function () {
                    var d = _this.searchVild(null, 1);
                    Util.prePage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });

                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVild(null, 1);
                    Util.enterEval(pageCom, event, $(this), _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });

                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            tableLoad: function (data) {
                var html = template('rule-table', {list: data});
                $("#ruleSetting").find(".ck-table").empty();
                this.edit(html, $("#ruleSetting").find(".ck-table"));
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