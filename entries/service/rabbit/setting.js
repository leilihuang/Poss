define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon:$("#hideCon"),
                    url:"/marketing/point-get-rule",
                    status:0,
                    user:null,
                    bool:false,
                    time:false
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
                    this.user=$("#setting");
                    Poss.dateTime();
                    this.loadSerach(this);
                    this.addLoad();
                    this.addSub(this);
                    this.addCencer(this);
                    this.dateKeyUp(this);
                    this.status=1;
                }
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.onBind(html,_this.tabCom);
                    _this.bindEval();
                });
            },
            /**初始化加载*/
            loadDate: function (callBack) {
                var _this=this;
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET",{}, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        for(var i=0;i<d.data.length;i++){
                            d.data[i].start_date=Poss.isDate(d.data[i].start_date,0);
                            d.data[i].end_date=Poss.isDate(d.data[i].end_date,0);
                        }
                        $div.load('tpl/rabbit/setting.html', function () {
                            var h=template('tpl-setting',{
                                href:"setting",
                                list:d.data
                            });
                            callBack(h);
                        });
                    } else {
                        Poss.errorDate("接口调用失败","setting");
                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#setting").find(".set_search").on("click", function () {
                   _this.dataBind(_this);
                });
            },
            dataBind: function (_this,$model,status) {
                Poss.ajaxBack(Poss.baseUrl(_this.url), "GET",{}, _this.user, function (d, xhr) {
                    if (d.status == 0) {
                        if(status==0){
                            _this.modelHide($model);
                        }
                        for(var i=0;i<d.data.length;i++){
                            d.data[i].start_date=Poss.isDate(d.data[i].start_date,0);
                            d.data[i].end_date=Poss.isDate(d.data[i].end_date,0);
                        }
                        var html=template('set-table',{list:d.data});
                        $("#setting").find(".tt-table").empty();
                        _this.onBind(html,$("#setting").find(".tt-table"));
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            //动态渲染页面，添加动态绑定事件
            onBind: function (html,$table) {
                var _this=this;
                $(html).find(".set_edit").each(function () {
                    $(this).on("click", function () {
                        _this.editBind($(this));
                    });
                }).end().find(".set_del").each(function () {
                    $(this).on("click", function () {
                        _this.delBind($(this));
                    });
                }).end().appendTo($table);
            },
            /**编辑*/
            editBind: function ($this) {
                var id=$this.parents("tr").find("td").eq(0).text(),_this=this,
                    url="/marketing/point-get-rule/"+id;
                Poss.ajaxBack(Poss.baseUrl(url), "GET",{}, _this.user, function (d, xhr) {
                    if (d.status == 0) {
                        d.data.start_date=Poss.isDate(d.data.start_date);
                        d.data.end_date=Poss.isDate(d.data.end_date);
                        var h=template('set-edit',{
                            data:d.data
                        });
                        _this.onEdit(h,id);
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            onEdit: function (html,id) {
                var _this=this;
                _this.user.find(".editSet").empty();
                $(html).find(".ck_sub").on("click", function () {
                    _this.timeOnChan(".setEdit",_this, function (data,$this) {
                        _this.timeLoad(data,$this, function () {
                            var data={};
                            _this.subVaild(_this.user.find(".setEdit"),data, function (status) {
                                if(status!=1 && _this.time){
                                    _this.subLoad(Poss.isJson(data),"/marketing/point-get-rule/"+id,"PATCH", function (d) {
                                        _this.dataBind(_this,_this.user.find(".editSet"),0);
                                    });
                                }
                            });
                        });
                    });
                }).end().find(".ck_cancel").on("click", function () {
                    _this.modelHide(_this.user.find(".editSet"));
                }).end().find(".datetime").datetimepicker({autoclose: true}).end().appendTo(_this.user.find(".editSet"));
                this.modelShow(_this.user.find(".editSet"));
            },
            /**删除*/
            delBind: function ($this) {
                var id=$this.parents("tr").find("td").eq(0).text(),_this=this,
                    url="/marketing/point-get-rule/"+id;
                Poss.ajaxBack(Poss.baseUrl(url), "DELETE",{}, _this.user, function (d, xhr) {
                    if (d.status == 0) {
                        _this.dataBind(_this);
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            /**新增*/
            addLoad: function () {
                var _this=this;
                this.user.find(".set_add").on("click", function () {
                    _this.user.find(".addSet").find(":text").val("");
                    _this.modelShow(_this.user.find(".set-add"));
                });
            },
            /**新增--取消事件*/
            addCencer: function (_this) {
                this.user.find(".ck_cancel").on("click", function () {
                    $(this).parents(".md-content").find(".has-error").removeClass("has-error");
                    _this.modelHide(_this.user.find(".set-add"));
                });
            },
            /**新增--提交事件*/
            addSub: function (_this) {
                this.user.find(".ck_sub").on("click", function () {
                    _this.timeOnChan(".addSet",_this, function (data,$this) {
                        _this.timeLoad(data,$this, function () {
                            var data={};
                            _this.subVaild(_this.user.find(".addSet"),data, function (status) {
                                if(status!=1 && _this.time){
                                    _this.subLoad(Poss.isJson(data),"/marketing/point-get-rule","POST", function (d) {
                                        _this.dataBind(_this,_this.user.find(".set-add"),0);
                                    });
                                }
                            });
                        });
                    });
                });
            },
            subVaild: function ($con,data,callBack) {
                var status=0;
                $con.find(":text").each(function (i) {
                    i++;
                    if($(this).val()==''&&$(this).attr("data-name")!="memo"){
                        $(this).parents('.form-group').addClass("has-error");
                        status=1;
                    }else{
                        $(this).parents('.form-group').removeClass("has-error");
                        data[$(this).attr("data-name")]=$(this).val();
                    }
                    if(i==$con.find(":text").length){
                        callBack(status);
                    }
                });
            },
            /**时间验证*/
            dateKeyUp: function (_this) {
                this.user.find(".addSet").find(".datetime").find(":text").each(function () {
                  _this.timeOn($(this),".addSet");
                });
            },
            timeOn: function ($this,clas) {
                var _this=this;
                $this.on("change", function () {
                    _this.timeOnChan(clas,_this, function (data,$this) {
                        _this.timeLoad(data,$this, function () {

                        });
                    });
                });
            },
            timeOnChan: function (clas,_this,callBack) {
                var data={},n=0;
                this.user.find(clas).find(".datetime").find(":text").each(function () {
                    if($(this).val()!=""){
                        data[$(this).attr("data-name")]=$(this).val();
                        $(this).parents(".form-group").removeClass("has-error");
                        n++;
                        if(n==2){
                            var start=new Date(data["start_date"]),
                                end=new Date(data["end_date"]);
                            if(start.getTime()<end.getTime()){
                                callBack(data,$(this));
                            }else{
                                $(this).parents(".form-group").addClass("has-error");
                                $(this).parents(".form-group").find(".errorTip").text("开始日期不能大于结束日期");
                            }
                        }
                    }else{
                        $(this).parents(".form-group").addClass("has-error");
                        $(this).parents(".form-group").find(".errorTip").text("时间不能为空");
                    }
                });
            },
            timeLoad: function (data,$this,callBack) {
                var _this=this;
                Poss.ajaxBack(Poss.baseUrl("/marketing/point-get-rule"), "GET",data, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        if(d.data.length>0){
                            _this.time=false;
                            $this.parents(".form-group").addClass("has-error");
                            $this.parents(".form-group").find(".errorTip").text("所选时间与其他活动时间冲突，请重新选择");
                        }else{
                            _this.time=true;
                            $this.parents(".form-group").find(".errorTip").text("");
                            callBack();
                        }
                    } else {
                        Poss.isDeBug("接口调用失败", 1);
                    }
                });
            },
            subLoad: function (data,url,type,callback) {
                Poss.ajaxBack(Poss.baseUrl(url), type,data, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        callback(d.data);
                    } else {
                        Util.errorTip("提示信息",d.data.message);
                    }
                });
            },
            //弹出层显示
            modelShow: function (model) {
                Util.modelShow(model);
            },
            //弹出层隐藏
            modelHide: function (model) {
                Util.modelHide(model);
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