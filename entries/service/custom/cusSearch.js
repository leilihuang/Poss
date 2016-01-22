define(
    ['jQuery','entries/lib/ui/class','template', 'entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon: $("#hideCon"),
                    status:0,
                    user:null,
                    total: 1,
                    pagination:".pagination",   //分页
                    pagenumber:".number",       //分页的当前页数
                    cusSearch:{
                        ID:"tpl-cusSearch",             //页面ID
                        Href:"cusSearch",               //页面HREF
                        btnSearch:"cus-search",         //查询按钮ID
                        tabSearch:".cus-Search-table",   //会员列表table
                        inpstart:".del-start-search",       //开始时间控件样式
                        inpend:".del-end-search",           //结束时间控件样式
                    },
                    tabCus:{
                        ID:"tpl-tabSearch",           //会员列表ID
                        btnAcc:".customAcc",
                        btnAddr:".customAddrs"
                    },
                    customAcc:{
                        ID:"tpl-customAcc",                  //页面ID
                        href:"customAcc",                    //页面href
                        btnBack:".cus-back"                 //返回按钮Class
                    },
                    customAddrs:{
                        ID:"tpl-customAddrs",                //页面ID
                        href:"customAddrs",                  //页面href
                        btnBack:".cusaddr-back"             //返回按钮Class
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
                    this.hySearch(this);
                    this.user = $("#cusSearch");            //加载页面是给页面赋值user
                    this.url="/marketing/customaccs";
                    this.status=1;
                    this.page();
                    this.delDate(this);
                }

            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.bindEval();
                    Poss.dateTime();

                });
            },
            //加载页面
            loadDate: function (callBack) {
                var _this=this,
                    $div=$('<div></div>');
                $('body').append($div);
                $div.load('tpl/custom/cusSearch.html', function () {
                    var h=template(_this.cusSearch.ID,{
                        href:_this.cusSearch.Href
                    });
                    callBack(h);
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
                    var date = _this.searchVildcus();
                    Util.nextPage(pageCom, _this.url, date, function (d) {
                        _this.tableLoad(d);
                    });
                });
                pre.on("click", function () {
                    var date = _this.searchVildcus();
                    Util.prePage(pageCom, _this.url, date, function (d) {
                        _this.tableLoad(d);
                    });
                });
                number.find("input").on("keyup", function (event) {
                    var date = _this.searchVildcus();
                    Util.enterEval(pageCom, event, $(this), _this.url, date, function (d) {
                        _this.tableLoad(d);
                    });
                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            //格式化时间
            isDate: function (data) {
                for(var i=0;i<data.length;i++){
                    data[i].create_time=Poss.isDate(data[i].create_time,0);
                }
            },
            /**清除时间日期*/
            delDate: function (_this) {
                $(_this.cusSearch.inpstart).on("click", function () {
                    Util.delDate($(this));
                });
               $(_this.cusSearch.inpend).on("click", function () {
                    Util.delDate($(this));
               });
            },
            //查询会员列表
            hySearch: function (_this) {
                $("#"+_this.cusSearch.btnSearch).on("click", function () {
                    var data = _this.searchVildcus();
                    Util.initPage(data);
                    Poss.ajaxBack(Poss.baseUrl("/marketing/customaccs"), "GET", data, _this.user, function (d, xhr) {
                        if (d.status == 0) {
                            _this.total = xhr.getResponseHeader("X-Total-Count");
                            _this.isDate(d.data);
                            var h=template(_this.tabCus.ID,{
                                list:d.data
                            });
                            _this.user.find(_this.cusSearch.tabSearch).empty();
                            _this.edit(h, _this.user.find(_this.cusSearch.tabSearch));
                            Util.setTotal(_this.total);

                            var page=_this.user.find(_this.pagination);
                            page.find(_this.pagenumber).find("input").val(1);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                });
            },
            //获取参数列表
            searchVildcus: function () {
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
                date["last_cursor"]=0;
                date["count"]=Poss.count;
                Poss.selectVal(this.user, date);
                return date;
            },
            //填充页面数据
            tableLoad: function (data) {
                var _this=this;
                this.isDate(data);
                var html = template(_this.tabCus.ID, {list: data});
                var $table = _this.user.find(_this.cusSearch.tabSearch);
                _this.user.find(_this.cusSearch.tabSearch).empty();
                _this.edit(html, $table);
            },
            //添加绑定事件
            edit: function (html,$table) {
                var _this=this;
                //会员详情
                $(html).find(_this.tabCus.btnAcc).each(function () {
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href'),
                            ca_code=$(this).parents("tr").find("td").eq(2).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,ca_code,_this.customAcc.href);
                            }
                        });
                    })
                }).end().find(_this.tabCus.btnAddr).each(function () {
                    //会员收货地址
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href'),
                            ca_code=$(this).parents("tr").find("td").eq(2).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,ca_code,_this.customAddrs.href);
                            }
                        });
                    })
                }).end().appendTo($table);
            },
            //绑定新开面板事件
            isTab: function (text,ca_code,hrefId) {
                var _this=this,
                    html=template('tpl-tab',{
                        text:text,
                        href:"#"+hrefId
                    });
                if(_this.bool){
                    var i=_this.user.parent().index();
                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tplCon(ca_code,hrefId);
                }else{
                    _this.tabs.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i=$(this).parents("li").index();
                        if($(this).parents("li").hasClass('active')){
                            _this.delTab(i,true,hrefId);
                        }else{
                            _this.delTab(i,false,hrefId);
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find("#"+hrefId).addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo( _this.tabs);
                    _this.tplCon(ca_code,hrefId);
                }
                _this.bool=false;

            },
            //绑定删除面板事件
            delTab: function (i,bool,href) {
                var tabs_li=this.tabs.find('li'),
                    panel=this.tabCom.find("#"+href);
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                if(bool){
                    this.user.find(":text").each(function () {
                        $(this).val("");
                    });
                    this.user.find("select").each(function () {
                        $(this).val("");
                    });
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            },
            //新开页面
            tplCon: function (ca_code,hrefId) {
                var _this=this;
                //查询会员详情
                if(hrefId==_this.customAcc.href){
                    Poss.ajaxBack(Poss.baseUrl("/marketing/customaccs/"+ca_code), "GET", null, this.user, function (d, xhr) {
                        if (d.status == 0) {
                            _this.tabCom.find('.active').removeClass('active');
                            d.data.create_time=Poss.isDate( d.data.create_time,0);
                            if(d.data.effect_time!=undefined){
                                d.data.effect_time=Poss.isDate(d.data.effect_time,0);
                            }
                            if(d.data.birit!=undefined){
                                d.data.birit=Poss.isDate(d.data.birit,0);
                            }
                            if(d.data.birthc!=undefined){
                                d.data.birthc=Poss.isDate(d.data.birthc,0);
                            }
                            var h=template(_this.customAcc.ID,{
                                list:d.data,
                                accHref:_this.customAcc.href
                            });
                            //返回按钮绑定事件
                            $(h).find(_this.customAcc.btnBack).on('click', function () {
                                var i=$(this).parents("#"+_this.customAcc.ID).index();
                                _this.delTab(i,true,_this.customAcc.href);
                            }).end().find("a").on("click", function () {
                                _this.tabCom.find("#"+_this.customAcc.href).addClass("active").siblings(".active").removeClass("active");
                            }).end().appendTo(_this.tabCom);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                }else{
                    //查询会员收货地址列表
                    Poss.ajaxBack(Poss.baseUrl("/marketing/customaccs/"+ca_code+"/custom-addrs"), "GET", null, this.user, function (d, xhr) {
                        if (d.status == 0) {
                            _this.tabCom.find('.active').removeClass('active');
                            var h=template(_this.customAddrs.ID,{
                                list:d.data,
                                addrsHref:_this.customAddrs.href
                            });
                            //返回按钮绑定事件
                            $(h).find(_this.customAddrs.btnBack).on('click', function () {
                                var i=$(this).parents("#"+_this.customAddrs.ID).index();
                                _this.delTab(i,true,_this.customAddrs.href);
                            }).end().find("a").on("click", function () {
                                _this.tabCom.find("#"+_this.customAddrs.href).addClass("active").siblings(".active").removeClass("active");
                            }).end().appendTo(_this.tabCom);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                }
            }
        });
        var s=null;
        return {
            init: function () {
                if(s!=null){
                    s.init();
                }else{
                    s=new search();
                }
            }
        };
    }
)