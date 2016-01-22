define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
        var edit=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs: $("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon: $("#hideCon"),
                    user: null,
                    url:"/marketing/customaccs",
                    ca_code:0,
                    status:0,
                    state:0,
                    total: 1,
                    pagination:".pagination",   //分页
                    pagenumber:".number",       //分页的当前页数
                    editTpl:{
                        ID:"tpl-cusEdit",            //修改会员页模板ID
                        Href:"cusEdit",              //修改会员页HREF
                        btnQuery:"hy-edit",          //查询按钮ID
                        cusTable:".cus-table",         //会员列表tab
                        inpstart:".del-start-edit",       //开始时间控件样式
                        inpend:".del-end-edit",           //结束时间控件样式
                    },
                    tabEdit:{
                        ID:"tpl-tabEdit",            //会员信息列表ID
                        btnModify:".cus-modify"       //冻结解冻按钮CLASS
                    },
                    hyAffairs:{
                        formEdit:".form-affairs",    //(弹窗)修改会员状态页面CLASS
                        btnHeadh:"hy_header_hied",  //头部关闭按钮ID
                        btnHidef:"hy_footer_hide",  //底部关闭按钮ID
                        btnsub:".hy_submit"          //确定提交按钮CLASS
                    }
                };
                $.extend(true,this,options,opts);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.layout();
            },
            bindEval: function () {
                if(this.status==0){
                    this.cusEdit(this);
                    this.cusModify(this);
                    this.cusHide(this);
                    this.cusSubmit(this);
                    this.page();
                    this.status=1;
                    this.delDate(this);
                }
            },layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.user=$("#cusEdit");       //加载页面是给用户赋值
                    _this.bindEval();
                    Poss.dateTime();

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
                    var d = _this.searchVildedit();
                    Util.nextPage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                pre.on("click", function () {
                    var d = _this.searchVildedit();
                    Util.prePage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVildedit();
                    Util.enterEval(pageCom, event, $(this), _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            tableLoad: function (data) {
                var _this=this;
                _this.isDate(data);
                var html=template(_this.tabEdit.ID,{list:data});
                var $table=this.user.find( _this.editTpl.cusTable);
                _this.user.find( _this.editTpl.cusTable).empty();
                this.edit(html,$table);
            },
            loadDate: function (callBack) {
                var $div=$('<div></div>');
                $('body').append($div);
                var _this=this;
                $div.load('tpl/custom/cusEdit.html', function () {
                    var h=template(_this.editTpl.ID,{
                        href:_this.editTpl.Href
                    });
                    callBack(h);
                });
            },
            isDate: function (date) {
                for(var i=0;i<date.length;i++){
                    date[i].create_time=Poss.isDate(date[i].create_time,0);
                }
            },
            /**清除时间日期*/
            delDate: function (_this) {
                $(_this.editTpl.inpstart).on("click", function () {
                    Util.delDate($(this));
                });
                $(_this.editTpl.inpend).on("click", function () {
                    Util.delDate($(this));
                });
            },
            //绑定查询会员列表
            cusEdit: function (_this) {
                $("#"+_this.editTpl.btnQuery).on("click", function () {
                    _this.findCus(_this);
                });
            },
            //查询会员信息列表
            findCus:function(_this){
                var d = _this.searchVildedit();
                Util.initPage(d);
                Poss.ajaxBack(Poss.baseUrl("/marketing/customaccs"), "GET", d, this.user, function (data, xhr) {
                    if (data.status == 0) {
                        _this.total = xhr.getResponseHeader("X-Total-Count");
                        _this.isDate(data.data);
                        _this.tableLoad(data.data);
                        Util.setTotal(_this.total);
                        var page=_this.user.find(_this.pagination);
                        page.find(_this.pagenumber).find("input").val(1);
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            //修改会员状态事件
            cusSubmit: function (_this) {
                _this.user.find(_this.hyAffairs.btnsub).on("click", function () {
                    var data = _this.searchVildedit();
                    var text= _this.user.find(_this.hyAffairs.formEdit).find("textarea");
                    data[text.attr("data-name")]=text.val();
                    if(_this.state=="冻结"){
                        data["state"]=1;
                    }else{
                        data["state"]=0;
                    }
                    Util.initPage(data);
                    Poss.ajaxBack(Poss.baseUrl("/marketing/customaccs/"+_this.ca_code), "patch", Poss.isJson(data), this.user, function (d, xhr) {
                        if (d.status == 0) {
                            _this.total = xhr.getResponseHeader("X-Total-Count");
                            Poss.isDeBug("修改成功",1);
                            _this.modelHide();
                            _this.findCus(_this);
                            Util.setTotal(_this.total);
                        } else {
                            Poss.isDeBug("修改失败",1);
                            _this.modelHide();
                        }
                    });
                });

            },
            //隐藏弹出层事件
            cusHide: function (_this) {
                $("#"+_this.hyAffairs.btnHeadh).on("click", function () {
                    _this.modelHide();
                });
                $("#"+_this.hyAffairs.btnHidef).on("click", function () {
                    _this.modelHide();
                });
            },
            //获取参数列表
            searchVildedit: function () {
                var date = {};
                this.user.find(":text").each(function () {
                    if ($(this).val() != '') {
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                this.user.find("select").each(function () {
                    if ($(this).val() != '') {
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                var text= this.user.find("textarea");
                date[text.attr("data-name")]=text.val();
                date["last_cursor"]=0;
                date["count"]=Poss.count;
                Poss.selectVal(this.user, date);
                return date;
            },
            //添加绑定事件
            edit: function (html,$table) {
                var _this=this;
                $(html).find(_this.tabEdit.btnModify).each(function () {
                    $(this).on('click', function () {
                        _this.ca_code=$(this).parents("tr").find("td").eq(2).text();
                        _this.state=$(this).parents("tr").find("td").eq(7).text();
                        _this.modelShow();
                    })
                }).end().appendTo($table);
            },
            //修改会员状态（冻结&解冻）
            cusModify: function (_this) {
                $(_this.tabEdit.btnModify).on("click", function () {
                    _this.modelShow();
                });
            },
            //弹出层显示
            modelShow: function () {
               var _this=this;
                _this.user.find(_this.hyAffairs.formEdit).addClass("md-show").css("perspective","none");
            },
            //弹出层隐藏
            modelHide: function () {
                var _this=this;
                _this.user.find("textarea").val("");
                _this.user.find(_this.hyAffairs.formEdit).removeClass("md-show").css("perspective","1300px");
            }
        });
        var s=null;
        return {
            init: function () {
                if(s!=null){
                    s.init();
                }else{
                    s=new edit();
                }
            }
        };
    }
)