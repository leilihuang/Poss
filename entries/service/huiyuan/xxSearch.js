define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    status:0
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
                    this.status=1;
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
            loadDate: function (callBack) {
                var $div=$('<div></div>');
                $('body').append($div);
                $div.load('tpl/huiyuan/xxSearch.html', function () {
                    var h=template('xxSearch',{
                        href:"xxSearch"
                    });
                    callBack(h);
                });

            },
            //查询会员详情
            hySearch: function (_this) {
                $("#hy-search").on("click", function () {
                    _this.searchVild(function (date) {
                        $.ajax({
                            url:Poss.baseUrl("/marketing/customaccs"),
                            type:"get",
                            dataType:"json",
                            data:date,
                            success: function (date) {
                                date.start_time=Poss.isDate(date.start_time,0);
                                date.end_time=Poss.isDate(date.end_time,0);
                                var h=template('tpl-tabSearch',{
                                    list:date
                                });
                                $("#xxSearch").find(".tabSearch-table").empty();
                                _this.edit(h, $("#xxSearch").find(".tabSearch-table"));
                            }
                        });
                    });
                });
            },
            searchVild: function (callback) {
                var date={},ck_search=$("#xxSearch")
                ck_search.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                Poss.selectVal(ck_search,date);
                callback(date);
            },
            edit: function (html,$table) {
                var _this=this;
                $(html).find(".customAcc").each(function () {
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href'),
                            ca_code=$(this).parents("tr").find("td").eq(2).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,ca_code,"customAcc");
                            }
                        });
                    })
                }).end().find(".customAddrs").each(function () {
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href'),
                            ca_code=$(this).parents("tr").find("td").eq(2).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,ca_code,"customAddrs");
                            }
                        });
                    })
                }).end().appendTo($table);
            },
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
            tplCon: function (ca_code,hrefId) {
                var _this=this;
                if(hrefId=="customAcc"){
                    $.ajax({
                        url:Poss.baseUrl("/marketing/customaccs/"+ca_code),
                        type:"GET",
                        dataType:"JSON",
                        contentType:"application/json",
                        success: function (data) {
                            _this.tabCom.find('.active').removeClass('active');
                            var h=template('tpl-customAcc',{
                                list:data,
                                accHref:"customAcc"
                            });
                            _this.tabCom.append(h);
                        },
                        error: function () {

                        }
                    });
                }else{
                    $.ajax({
                        url:Poss.baseUrl("/marketing/customaccs/"+ca_code+"/custom-addrs"),
                        type:"GET",
                        dataType:"JSON",
                        contentType:"application/json",
                        success: function (data) {
                            _this.tabCom.find('.active').removeClass('active');
                            var h=template('tpl-customAddrs',{
                                list:data,
                                accHref:"customAddrs"
                            });
                            _this.tabCom.append(h);
                        },
                        error: function () {

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