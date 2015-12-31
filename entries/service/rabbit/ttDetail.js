define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    $this:$("#ttDetail"),
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
                    Poss.dateTime();
                    this.loadAdd(this);
                    this.loadSerach(this);
                    this.cancel(this);
                    this.submit(this);
                    this.page();
                    this.status=1;
                }
            },
            /**
             * 第一个参数传递分页的容器
             * @url 分页接口
             * */
            page: function () {
                var pageCom=$("#ttDetail").find(".pagination"),
                    pre=pageCom.find(".prev"),
                    next=pageCom.find(".next"),
                    number=pageCom.find(".number"),
                    total=pageCom.find(".total"),
                    _this=this;
                Util.total=this.total;

                Util.prePage(pre,next,number,_this.url, function (data) {
                    _this.tableLoad(data);
                });
                Util.nextPage(pre,next,number,_this.url, function (data) {
                    _this.tableLoad(data);
                });
                Util.enterEval(pre,next,number.find("input"),_this.url, function (data) {
                    _this.tableLoad(data);
                });
                this.setCount(total);
            },
            tableLoad: function (data) {
                var html=template('tt-table',{list:data});
                this.$this=$("#ttDetail");
                this.$this.find(".tt-table").empty();
                this.$this.find(".tt-table").append(html);
            },
            /**设置分页总数*/
            setCount: function (total) {
                Util.total=Math.ceil(Number(this.total)/this.count);
                total.text(Util.total);
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
                $.ajax({
                    url:Poss.baseUrl(_this.url),
                    type:"GET",
                    dataType:"json",
                    contentType:"application/json",
                    data:{last_cursor:1,count:10},
                    success: function (date,textStatus, jqXHR) {
                        _this.total=jqXHR.getResponseHeader("X-Total-Count");
                        _this.isDate(date);
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            list:date,
                            href:"ttDetail"
                        };
                        $div.load('tpl/rabbit/detail.html', function () {
                            var h=template('tpl-ttDetail',data);
                            callBack(h);
                        });
                    },
                    error: function () {
                        var h=Poss.errorDate("接口调用失败","ckSearch");
                        callBack(h);

                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#ttDetail").find(".tt-search").on("click", function () {
                    _this.searchVild(function (date) {
                        date["last_cursor"]=1;
                        date["count"]=10;
                        $.ajax({
                            url:Poss.baseUrl('/marketing/rabbit-points?last_cursor=1&count=10'),
                            type:'GET',
                            dataType:'json',
                            contentType:'application/json',
                            data:date,
                            success: function (data,textStatus, jqXHR) {
                                _this.total=jqXHR.getResponseHeader("X-Total-Count");
                                var pageCom=$("#ckSearch").find(".pagination"),
                                    number=pageCom.find(".number"),
                                    total=pageCom.find(".total");
                                number.find("input").val(1);
                               _this.tableLoad(data);
                                _this.setCount(total);
                            }
                        })
                    });
                });
            },
            searchVild: function (callback) {
                var date={},ck_search=$("#ck_search");
                ck_search.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                Poss.selectVal(ck_search,date);
                callback(Poss.isJson(date));
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
                        $.ajax({
                            url:"http://192.168.2.11:8088/marketing/coupon-kinds",
                            type:"POST",
                            data:date,
                            dataType:'json',
                            contentType:"application/json",
                            success: function (date) {
                                _this.layout();
                                _this.modelHide();
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        })
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