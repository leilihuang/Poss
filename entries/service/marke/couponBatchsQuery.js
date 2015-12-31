define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
        var id = "couponBatchsQuery";
        var editId = "couponBatchsEdit";
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    ck_search:$("#ck-search"),
                    ck_newAdd:$("#ck-newAdd"),
                    hideCon:$("#hideCon"),
                    status:0,
                    user:null,
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
                    Poss.dateTime();
                    this.loadAdd(this);
                    this.loadSerach(this);
                    this.cancel(this);
                    this.submit(this);
                    this.status=1;
                }
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
                $.ajax({
                    url:Poss.baseUrl("/marketing/coupon-batchs"),
                    type:"GET",
                    dataType:"json",
                    contentType:"application/json",
                    success: function (date) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            list:date,
                            href:id
                        };
                        $div.load('tpl/markingMgm/couponBatchsQuery.html', function () {
                            var h=template('tpl-couponBatchsQuery',data);
                            callBack(h);
                        });
                    },
                    error: function () {
                        var h=Poss.errorDate("接口调用失败","couponBatchsQuery");
                        callBack(h);

                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#couponBatchs-button").on("click", function () {
                       _this.searchVild(function (date) {
                       _this.loadEdit(date,_this);
                    });
                });
            },
            loadEdit: function (date) {
                var _this=this;
                $.ajax({
                    url:Poss.baseUrl('/marketing/coupon-batchs'),
                    type:'GET',
                    dataType:'json',
                    contentType:'application/json',
                    data:date,
                    success: function (data) {
                        var html=template('couponBatchs-table',{list:data});
                        $("#"+id).find(".couponBatchs-table").empty();
                        var $table=$("#"+id).find(".couponBatchs-table");
                        _this.edit(html,$table);
                    }
                });
            },
            searchVild: function (callback) {
                var date={},ck_search=$("#couponBatchs_query")
                ck_search.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
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
                            batch_no=$(this).parents("tr").find("td").eq(1).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,batch_no);
                            }
                        });
                    })
                }).end().appendTo($table);
            },
            isTab: function (text,batch_no) {
                var _this=this,
                    html=template('tpl-tab',{
                        text:text,
                        href:editId
                    });
                if(_this.bool){
                    var i=_this.user.parent().index();
                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tplCon(batch_no,0);
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
                        _this.tabCom.find(editId).addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo( _this.tabs);
                    _this.tplCon(batch_no);
                }
                _this.bool=false;

            },
            tplCon: function (batch_no,status) {
                var url="/marketing/coupon-batchs/"+batch_no,_this=this;
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