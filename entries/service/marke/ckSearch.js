define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    ck_search:$("#ck-search"),
                    ck_newAdd:$("#ck-newAdd"),
                    hideCon:$("#hideCon"),
                    status:0,
                    total:0,
                    $this:null,
                    user:null,
                    count:10,
                    bool:false
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
                    this.user=$("#ckSearch");
                    this.status=1;
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
                var pageCom=this.user.find(".pagination"),
                    pre=pageCom.find(".prev"),
                    next=pageCom.find(".next"),
                    number=pageCom.find(".number"),
                    total=pageCom.find(".total"),
                    _this=this;
                Util.prePage(pre,next,number,"/marketing/coupon-kinds", function (data) {
                    _this.tableLoad(data);
                });
                Util.nextPage(pre,next,number,"/marketing/coupon-kinds", function (data) {
                    _this.tableLoad(data);
                });
                Util.enterEval(pre,next,number.find("input"),"/marketing/coupon-kinds", function (data) {
                    _this.tableLoad(data);
                });
                this.setCount(total);
            },
            /**设置分页总数*/
            setCount: function (total) {
                Util.total=Math.ceil(Number(this.total)/this.count);
                total.text(Util.total);
            },
            tableLoad: function (data) {
                var html=template('ck-table',{list:data});
                var $table=this.user.find(".ck-table");
                this.user.find(".ck-table").empty();
                this.edit(html,$table);
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.edit(html,_this.tabCom);
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                var _this=this;
                $.ajax({
                    url:Poss.baseUrl("/marketing/coupon-kinds"),
                    type:"GET",
                    dataType:"json",
                    contentType:"application/json",
                    data:{ last_cursor:"1",count:_this.count},
                    success: function (date,textStatus, jqXHR) {
                        _this.total=jqXHR.getResponseHeader("X-Total-Count");
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            list:date,
                            href:"ckSearch"
                        };
                        $div.load('tpl/markingMgm/ckSearch.html', function () {
                            var h=template('tpl-ckSearch',data);
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
                $("#ck-search").on("click", function () {
                    _this.searchVild(function (date) {
                      _this.loadEdit(date,_this);
                    });
                });
            },
            loadEdit: function (date,_this) {
                $.ajax({
                    url:Poss.baseUrl('/marketing/coupon-kinds'),
                    type:'GET',
                    dataType:'json',
                    contentType:'application/json',
                    data:Poss.isJson(date),
                    success: function (data,textStatus, jqXHR) {
                        _this.total=jqXHR.getResponseHeader("X-Total-Count");
                        var pageCom=$("#ckSearch").find(".pagination"),
                            number=pageCom.find(".number"),
                            total=pageCom.find(".total");
                        number.find("input").val(1);
                       _this.tableLoad(data);
                        _this.setCount(total);
                    }
                });
            },
            searchVild: function (callback) {
                var date={},ck_search=$("#ck_search");
                ck_search.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                date["last_cursor"]=1;
                date["count"]=10;
                Poss.selectVal(ck_search,date);
                callback(date);
            },
            //新增
            loadAdd: function (_this) {
                $("#ck-newAdd").on("click", function () {
                    _this.modelShow();
                });
            },
            //修改内容
            edit: function (html,$table) {
                var _this=this;
                $(html).find(".edits").each(function () {
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href'),
                            ck_id=$(this).parents("tr").find("td").eq(1).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.$this=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,ck_id);
                            }
                        });
                    })
                }).end().appendTo($table);
            },
            isTab: function (text,ck_id) {
                var _this=this;
                Util.isTab(text,'#ckEdit',this.bool,this.$this, function (status) {
                    if(status==0){
                        _this.tplCon(ck_id,0);
                    }else{
                        _this.tplCon(ck_id);
                    }
                });
                this.bool=false;
                /*                var _this=this,
                                    html=template('tpl-tab',{
                                        text:text,
                                        href:'#ckEdit'
                                    });
                                if(_this.bool){
                                    var i=_this.user.parent().index();
                                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                                    _this.tplCon(ck_id,0);
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
                                    _this.tplCon(ck_id);
                                }*/
            },
            tplCon: function (ck_id,status) {
                var url="/marketing/coupon-kinds/"+ck_id,_this=this;
                $.ajax({
                   url:Poss.baseUrl(url),
                    type:"GET",
                    dataType:"JSON",
                    contentType:"application/json",
                    success: function (data) {
                        if(status==0){
                            var h=template('editUp',{
                                list:data
                            });
                            _this.tabCom.find("#ckEdit").find(".editUp").empty();
                            _this.tabCom.find("#ckEdit").find(".editUp").append(h);
                        }else{
                            var h=template('tpl-ckEdit',{
                                editHref:'ckEdit',
                                list:data
                            });
                            _this.tabCom.find('.active').removeClass('active');
                            $(h).find(".edit-cen").on("click", function () {

                                _this.delTab($("#ckEdit").index(),true,"ckEdit");
                            }).end().find(".edit-sub").on("click", function () {
                                _this.editSub();
                            }).end().appendTo(_this.tabCom);
                        }
                    },
                    error: function () {

                    }
                });
            },
            editSub: function () {
                var _this=this;
                this.editVail(function (data) {
                  var  url="/marketing/coupon-kinds/"+data["ck_id"];
                    $.ajax({
                        url:Poss.baseUrl(url),
                        type:"PUT",
                        dataType:"json",
                        data:Poss.isJson(data),
                        contentType:"application/json",
                        success: function (data) {
                            var i=_this.tabs.find(".active").index();
                            _this.delTab(i,true,"ckEdit");
                            _this.loadEdit();
                        },
                        error: function () {

                        }
                    })
                });
            },
            editVail: function (callback) {
                var date={},ck_modal=$("#ckEdit").find(".editUp");
                Poss.inputVal(ck_modal,date);
                Poss.radioVal(ck_modal,date);
                Poss.selectVal(ck_modal,date);
                callback(date);
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
                            url:Poss.baseUrl("/marketing/coupon-kinds"),
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
               Util.modelShow(this.user);
            },
            //弹出层隐藏
            modelHide: function () {
                Util.modelHide(this.user);
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