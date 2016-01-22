define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    url:"/marketing/rabbit-points",
                    ck_newAdd:$("#ck-newAdd"),
                    hideCon:$("#hideCon"),
                    status:0,
                    total:0,
                    user:null,
                    bool:false
                };
                $.extend(true,this,options,opts);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.layout(opts);
            },
            bindEval: function () {
                if(this.status==0){
                    this.user=$("#ttDetail");
                    Poss.dateTime();
                    this.loadAdd(this);
                    this.loadSerach(this);
                    this.cancel(this);
                    this.submit(this);
                    this.page();
                    this.delDate();
                    this.status=1;
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
                for(var i=0;i<data.length;i++){
                    data[i].create_time=Poss.isDate(data[i].create_time,0);
                }
                var html=template('tt-table',{list:data});
                this.user.find(".tt-table").empty();
                this.user.find(".tt-table").append(html);
            },
            /**清除时间日期*/
            delDate: function () {
                $(".delDate").on("click", function () {
                    Util.delDate($(this));
                });
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.edit(html);
                    _this.bindEval();
                });
            },
            isDate: function (date) {
                for(var i=0;i<date.length;i++){
                    date[i].create_time=Poss.isDate(date[i].create_time,0);
                }
            },
            loadDate: function (callBack) {
                var _this=this;
                var da = {};
                Util.initPage(da);
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET", da, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.total=xhr.getResponseHeader("X-Total-Count");
                        _this.isDate(d.data);
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            list:d.data,
                            href:"ttDetail"
                        };
                        $div.load('tpl/rabbit/detail.html', function () {
                            var h=template('tpl-ttDetail',data);
                            callBack(h);
                        });
                    } else {
                        Poss.errorDate("接口调用失败","ttDetail");
                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                this.user.find(".tt-search").on("click", function () {
                    var d = _this.searchVild();
                    Util.initPage(d);
                    Poss.ajaxBack(Poss.baseUrl('/marketing/rabbit-points'), "GET",d, this.user, function (d, xhr) {
                        if (d.status == 0) {
                            _this.total=xhr.getResponseHeader("X-Total-Count");
                            var pageCom=_this.user.find(".pagination"),
                                number=pageCom.find(".number"),
                                total=pageCom.find(".total");
                            number.find("input").val(1);
                            _this.tableLoad(d.data);
                            Util.setTotal(_this.total);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                });
            },
            searchVild: function () {
                var date={},ck_search=this.user.find(".ck_search");
                ck_search.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                Poss.selectVal(ck_search,date);
                return date;
            },
            //新增
            loadAdd: function (_this) {
                $("#ck-newAdd").on("click", function () {
                    _this.modelShow();
                });
            },
            //修改内容
            edit: function (html) {
                var _this=this;
                $(html).find(".edits").each(function () {
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href');
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                console.log($(this));
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text);
                            }
                        });
                    })
                }).end().appendTo(_this.tabCom);
            },
            isTab: function (text) {
                var _this=this,
                    html=template('tpl-tab',{
                        text:text,
                        href:'#ckEdit'
                    });
                if(_this.bool){
                    var i=_this.user.parent().index();
                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                }else{
                    _this.tabs.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i=$(this).parents("li").index();
                        if($(this).parents("li").hasClass('active')){
                            _this.delTab(i,true,"ckEdit");
                        }else{
                            _this.delTab(i,false,"ckEdit");
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find("#ckEdit").addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo( _this.tabs);
                    _this.tplCon();
                }
                _this.bool=false;

            },
            delTab: function (i,bool,href) {
                var tabs_li=this.tabs.find('li'),
                    panel=this.tabCom.find("#"+href);
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                if(bool){
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            },
            tplCon: function () {
                var h=template('tpl-ckEdit',{
                    editHref:'ckEdit'
                });
                this.tabCom.find('.active').removeClass('active');
                this.tabCom.append(h);
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
                    _this.validInp(function (date) {
                        Poss.ajaxBack(Poss.baseUrl('/marketing/coupon-kinds'), "POST", date, this.user, function (d, xhr) {
                            if (d.status == 0) {
                                _this.layout();
                                _this.modelHide();
                            } else {
                                Poss.isDeBug("接口调用失败", 1);
                            }
                        });
                    });
                });
            },
            //新增数据
            validInp: function (callback) {
                var date={},ck_modal=$("#ck_modal");
                Poss.inputVal(ck_modal,date);
                Poss.radioVal(ck_modal,date);
                Poss.selectVal(ck_modal,date);
                var text=ck_modal.find("textarea");
                date[text.attr("data-name")]=text.val();
                callback(Poss.isJson(date));
            },
            //弹出层显示
            modelShow: function () {
                $("#form-primary").addClass("md-show").css("perspective","none");
            },
            //弹出层隐藏
            modelHide: function () {
                $("#form-primary").removeClass("md-show").css("perspective","1300px");
            }
        });
        var s=null;
        return {
            init: function () {
                if(s!=null){
                    s.layout();
                }else{
                    s=new search();
                }
            }
        };
    }
)