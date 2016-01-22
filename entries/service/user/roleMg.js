define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util','bootstrapSwitch'],
    function ($,Class,template,Util) {
        var mg=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon:$("#hideCon"),
                    url:"/system/domains/"+Poss.users.domainId+"/roles",
                    status:0,
                    total:0,
                    user:null,
                    homeTpl:{
                        tplUrl:'tpl/user/roleMg.html',
                        userId:"roleMg",            //页面唯一id字符串
                        tplRole:"tpl-roleMg",       //页面模板id
                        roleTable:"role-table",      //页面table模板Id
                        btnSearch:".role-search",   //页面查询按钮
                        btnAdd:".role-create",      //页面添加按钮
                        btnEdit:".userEdit",        //角色编辑
                        btnDel:".userDel"           //角色删除
                    },
                    addRole:{
                        tpl:"role-add",         //新增页面模板ID
                        id:"roleAdd",           //新增页面唯一ID
                        domainUrl:"/system/domains/"+Poss.users.domainId,    //获取当前域下的权限列表,
                        domainTpl:'add-domain',     //
                        $domain:".add-domain",
                        domainSelect:''         //保存下拉框选择域
                    },
                    editRole:{
                        tpl: "role-edit",     //编辑页面模板ID
                        id:"roleEdit"        //编辑页面唯一ID
                    },
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
                    this.loadSerach(this);
                    this.createRole();
                    this.page();
                    this.status=1;
                }
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    $(html).find(_this.homeTpl.btnEdit).on("click", function () {
                        _this.eidtBind($(this));
                    }).end().find(_this.homeTpl.btnDel).on("click", function () {
                        _this.delBind($(this));
                    }).end().appendTo(_this.tabCom);
                    _this.user=$("#"+_this.homeTpl.userId);
                    _this.bindEval();
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
                Util.pageDemo(pageCom,"users");
                next.on("click", function () {
                    var d = _this.searchVild(),
                        url=_this.typeUrl(_this.url);
                    Util.nextPage(pageCom, url, d, function (data) {
                        _this.tableLoad(data);
                    },'users');
                });
                pre.on("click", function () {
                    var d = _this.searchVild(),
                        url=_this.typeUrl(_this.url);
                    Util.prePage(pageCom,url, d, function (data) {
                        _this.tableLoad(data);
                    },'users');
                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVild(),
                        url=_this.typeUrl(_this.url);
                    Util.enterEval(pageCom, event, $(this), url, d, function (data) {
                        _this.tableLoad(data);
                    },'users');
                });
                Util.totals = this.total;
                Util.setTotal(this.total);
            },
            typeUrl: function (url) {
                if(Poss.users.type=="9"){
                    url="/system/domains/"+this.user.find(".addSelect").val()+"/roles";
                }
                return url;
            },
            tableLoad: function (data) {
                var html=template(this.homeTpl.roleTable,{list:data}),_this=this;
                this.user.find(".ck-table").empty();
                $(html).find(_this.homeTpl.btnEdit).on("click", function () {
                    _this.eidtBind($(this));
                }).end().find(_this.homeTpl.btnDel).on("click", function () {
                    _this.delBind($(this));
                }).end().appendTo(_this.user.find(".ck-table"));

            },
            loadDate: function (callBack) {
                var _this=this;
                this.Data({},this,this.url, function (data) {
                    var da={
                        href:_this.homeTpl.userId,
                        list:data,
                        type:Poss.users.type
                    };
                    var $div=$('<div></div>');
                    $('body').append($div);
                    if(Poss.users.type=="9"){
                        _this.gainDomain(function (d) {
                            da["roots"]=d;
                            console.log(da);
                            $div.load(_this.homeTpl.tplUrl, function () {
                                var h=template(_this.homeTpl.tplRole,da);
                                callBack(h);
                            });
                        });
                    }else{
                        $div.load(_this.homeTpl.tplUrl, function () {
                            var h=template(_this.homeTpl.tplRole,da);
                            callBack(h);
                        });
                    }
                },1);
            },
            Data: function (date,_this,url,callback,status) {
                Util.initPage(date);
                if(Poss.users.type=="9" && status==1){
                    callback();
                }else{
                    Poss.ajaxBack(Poss.logUrl(url),"GET",date,this.user ,function (data,jqXHR) {
                        if(data.status==0){
                            /*     for(var i=0;i<data.length;i++){
                             data[i].last_login_time=Poss.isDate(data[i].last_login_time,0);
                             }*/
                            _this.total=jqXHR.getResponseHeader("X-Total-Count");
                            //_this.setCount();
                            callback(data.data);
                        }else{
                            if(status==1){
                                Poss.errorDate("接口调用失败，请刷新页面",_this.homeTpl.userId);
                            }else{
                                Util.errorTip("提示信息","操作异常，请重试");
                            }
                        }
                    });
                }
            },
            searchVild: function () {
                var date={};
                this.user.find(":text").each(function () {
                    if($(this).attr("data-name")){
                        date[$(this).attr("data-name")]=$(this).val();
                    }
                });
                Poss.selectVal(this.user,date);
                return date;
            },
            //查询
            loadSerach: function (_this) {
                this.user.find(_this.homeTpl.btnSearch).on("click", function () {
                    _this.searchBind(_this);
                });
            },
            searchBind: function (_this) {
                var d = this.searchVild(),
                    id=Poss.users.domainId;
                if(Poss.users.type=="9"){
                    id=this.user.find(".addSelect").val();
                }
                var  url="/system/domains/"+id+"/roles";
                Util.initPage(d);
                this.Data(d,this,url, function (data) {
                    var pageCom=_this.user.find(".pagination"),
                        number=pageCom.find(".number"),
                        total=pageCom.find(".total");
                    number.find("input").val(1);
                    _this.user.find(".tplPage").show();
                    _this.tableLoad(data);
                },0);
            },
            //删除角色
            delBind: function ($this) {
                var dom=Poss.users.domainId,
                    roleId=$this.parents("tr").find("td").eq(0).text(),
                    url="",
                    _this=this;
                    name=$this.attr("data-name");

                if(Poss.users.type=="9"){
                    dom=this.user.find(".addSelect").val();
                }
                url="/system/domains/"+dom+"/roles/"+roleId;
                Poss.ajaxBack(Poss.logUrl(url),"DELETE",null,this.user ,function (data,jqXHR) {
                    if(data.status==0){
                        _this.searchBind(_this);
                        Util.successTip("提示信息","删除角色成功！");
                    }else{
                        Util.errorTip("提示信息","删除角色失败！");
                    }
                });
            },
            //编辑角色
            eidtBind: function ($this) {
                var _this=this;
                var dom=Poss.users.domainId,
                    roleId=$this.parents("tr").find("td").eq(0).text(),
                    url="",
                    name=$this.attr("data-name");

                if(Poss.users.type=="9"){
                    dom=_this.user.find(".addSelect").val();
                }
                url="/system/domains/"+dom+"/roles/"+roleId;

                _this.tabs.find("a").each(function (i) {
                    if (name == $(this).attr("href").replace("#",'')) {
                        _this.$this = $(this);
                        _this.bool = true;
                    }
                    if (i == _this.tabs.find("a").length - 1) {
                        _this.isTab("修改角色信息",_this.editRole.id, function (status) {
                            _this.eidtRoot(function (roots) {
                                if (status == 0) {
                                    _this.tabCom.find("#"+_this.editRole.id).remove();
                                    _this.eidtData(_this,url,roots);
                                }else{
                                    _this.eidtData(_this,url,roots);
                                }
                            });

                        });
                    }
                });
            },
            eidtRoot: function (callBack) {
                var url="";
                if(Poss.users.type=="9"){
                    url="/system/domains/"+this.user.find(".addSelect").val();
                }else{
                    url="/system/domains/"+Poss.users.domainId;
                }
                Poss.ajaxBack(Poss.logUrl(url),"GET",null,null ,function (data,jqXHR) {
                    if(data.status==0){
                        callBack(data.data.resources);
                    }else{
                        Util.errorDate("提示信息","权限获取失败，请重新点击");
                    }
                });
            },
            eidtData: function (_this,url,roots) {
                Poss.ajaxBack(Poss.logUrl(url),"GET",null,null ,function (data,jqXHR) {
                    if(data.status==0){
                        for(var i=0;i<roots.length;i++){
                            for(var j=0;j<data.data.resources.length;j++){
                                if(roots[i].id==data.data.resources[j].id){
                                    roots[i].rootType="1";
                                }
                            }
                        }
                        var h=template(_this.editRole.tpl,{
                            data:data.data,
                            href:_this.editRole.id,
                            root:roots
                        });
                        $(h).find(".sub-success").on("click", function () {
                            _this.mandatoryIpt(_this.editRole.id,url,"PUT");
                        }).end().find('.switch').bootstrapSwitch().end().appendTo(_this.tabCom);
                    }else{
                        Util.errorDate("接口调用失败，请刷新页面");
                    }
                });
            },
            //创建域角色
            createRole: function () {
                var _this=this;
                this.user.find(_this.homeTpl.btnAdd).on("click", function () {
                    var text = $(this).text(), href = $(this).attr('data-name');
                    _this.tabs.find("a").each(function (i) {
                        if (href == $(this).attr("href").replace("#",'')) {
                            _this.$this = $(this);
                            _this.bool = true;
                        }
                        if (i == _this.tabs.find("a").length - 1) {
                            _this.isTab(text,_this.addRole.id, function (status) {
                                if (status != 0) {
                                    var url=_this.addRole.domainUrl;
                                    if(Poss.users.type=="9"){
                                        url="/system/domains/1";
                                        _this.gainDomain(function (d) {
                                            _this.rootDate(url,d);
                                        });
                                    }else{
                                        _this.rootDate(url);
                                    }
                                }
                            });
                        }
                    });
                });
            },
            isTab: function (text,id,callBack) {
                Util.isTab(text, '#'+id, this.bool, this.$this, function (status) {
                    callBack(status);
                });
                this.bool = false;
            },
            //获取权限数据
            rootDate: function (url,d) {
                var _this=this;
                Poss.ajaxBack(Poss.logUrl(url),"GET",null,this.user ,function (data,jqXHR) {
                    if(data.status==0){
                        var dd={
                            href:_this.addRole.id,
                            data:data.data.resources,
                            type:Poss.users.type
                        };
                        if(d){
                            dd["roots"]=d;
                        }
                        var h=template(_this.addRole.tpl,dd);
                        _this.tabCom.find(".active").removeClass('active');
                        $(h).find('.switch').bootstrapSwitch().end().find(".addSelect").on("change", function () {
                            _this.changeDomain($(this).val());
                        }).end().find(".sub-success").on("click", function () {
                            var id=Poss.users.domainId;
                            if(Poss.users.type=="9"){
                                id=$("#"+_this.addRole.id).find(".addSelect").val();
                            }
                            _this.mandatoryIpt(_this.addRole.id,"/system/domains/"+id+"/roles","POST");
                        }).end().appendTo(_this.tabCom);
                    }else{
                        Poss.errorDate("接口调用失败，请刷新页面",_this.addRole.id);
                    }
                });
            },
            //用户是超级管理员的时候，加载域
            gainDomain: function (callBack) {
                Poss.ajaxBack(Poss.logUrl("/system/domains"),"GET",null,this.user ,function (data,jqXHR) {
                    if(data.status==0){
                        d=data.data;
                        callBack(data.data);
                    }else{
                        Util.errorTip("提示信息","获取域信息失败！");
                    }
                });
            },
            //超级用户有选择域的权限
            changeDomain: function (id) {
                this.addRole.domainSelect=id;
                var _this=this;
                Poss.ajaxBack(Poss.logUrl("/system/domains/"+id),"GET",null,this.user ,function (data,jqXHR) {
                    if(data.status==0){
                        var h=template(_this.addRole.domainTpl,{
                            data:data.data.resources
                        });
                        var $d=$("#"+_this.addRole.id).find(_this.addRole.$domain);
                        $d.empty();
                        $(h).find('.switch').bootstrapSwitch().end().appendTo($d);
                    }else{
                        Poss.errorDate("接口调用失败，请刷新页面",_this.addRole.id);
                    }
                });
            },
            mandatoryIpt: function (com,url,type) {
                var data={
                    resources:[]
                },vaild=0,$Com=$("#"+com);
                $Com.find(":text").each(function () {
                    if($(this).hasClass("mandatory") && $(this).val()==""){
                        $(this).parents(".form-group").addClass("has-error");
                        vaild=1;
                    }else{
                        if($(this).parents(".form-group").hasClass("has-error")){
                            $(this).parents(".form-group").removeClass("has-error");
                        }
                        data[$(this).attr("data-name")]=$(this).val();
                    }
                });
                $Com.find("select").each(function () {
                    data[$(this).attr("data-name")]=$(this).val();
                });
                $Com.find(":checkbox").each(function () {
                    if($(this).attr("checked")=="checked"){
                        data.resources.push({id:$(this).attr("data-value")});
                    }
                });
                this.subDomain(data,vaild,url,type,com);
            },
            subDomain: function (data,vaild,url,type,com) {
                var _this=this;
                if(vaild==0){
                    Poss.ajaxBack(Poss.logUrl(url),type,Poss.isJson(data),this.addRole.id ,function (data,jqXHR) {
                        if(data.status==0){
                            var i=$("#"+com).index();
                            Util.delTab(i,true,com);
                            _this.searchBind(_this);
                            Util.homeTab(_this.homeTpl.userId);
                            Util.successTip("提示信息","操作成功");
                        }else{
                            Util.errorTip("提示信息",data.data.message);
                        }
                    });
                }
            }
        });
        var s=null;
        return {
            init: function () {
                if(s!=null){
                    s.layout();
                }else{
                    s=new mg();
                }
            }
        };
    }
)