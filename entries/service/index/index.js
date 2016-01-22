define(
    ['jQuery','../../lib/ui/class.js','entries/util/util','template','bootstrap','datetimepicker'],
    function ($,Class,Util,template) {
        var index=Class.create({
            setOptions: function (opts) {
                var options={
                    bool:false,
                    $this:null,
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon:$("#hideCon"),
                    homeTpl:{
                        treeId:"treeMenu",
                        treeTpl:"index-tpl",
                        userDetail:"userDetail",
                        textLogin:".user",
                        textSection:"section",
                        btnExit:"indexExit",
                        exitUrl:"/system/session"
                    },
                    obj:{}
                };
                $.extend(true,this,opts,options);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.bindEval();
            },
            bindEval: function () {
                this.exitBind(this);
                this.showBody();
                //this.leftTree();
                this.tabTemplate();
                $('#tpl').load('tpl/tpl.html');
                Poss.dateTime();
            },
            exitBind: function (_this) {
                $("#"+this.homeTpl.userDetail).find(this.homeTpl.textLogin).text(Poss.users.name);
                $("#"+this.homeTpl.btnExit).on("click", function () {
                    Poss.ajaxBack(Poss.logUrl(_this.homeTpl.exitUrl),"DELETE",null,this.user ,function (data,jqXHR) {
                        if(data.status==0){
                            window.location.href="login.html";
                        }else{
                            Util.errorTip("提示信息","退出失败，请刷新重试！");
                        }
                    });
                });
            },
            rootsData: function (callback) {
               $.ajax({
                   url:"../jsonConfig/menuConfing.json",
                   type:"GET",
                   dataType:"json",
                   success: function (d) {
                      callback(d[1]);
                   }
               })
            },
            showBody: function () {
                $(".texture").css({
                    opacity: 1,
                    "margin-left": "0px"
                });
            },
            leftTree: function () {
                $(".cl-vnavigation").find(".parent").each(function () {
                    $(this).on('click', function () {
                        $(this).next('.sub-menu').toggle();
                        return false;
                    })
                });
                $("#sidebar-collapse").on('click', function () {
                    var i=$(this).find("i");
                    if(i.hasClass("fa-angle-left")){
                        i.removeClass("fa-angle-left").addClass("fa-angle-right");

                    }else{
                        i.removeClass("fa-angle-right").addClass("fa-angle-left");
                    }
                    $("#cl-wrapper").toggleClass("sb-collapsed");
                });
            },
            /**左侧菜单事件*/
            tabTemplate: function () {
                var _this=this;
                this.rootsData(function (data) {
/*                    for(var j=0;j<data.length;j++){
                        var a=0;
                        for(var k=0;k<data[j].resoureces.length;k++){
                            for(var i=0;i<Poss.users.resources.length;i<i++){
                                if(data[j].resoureces[k]==Poss.users.resources[i].id){
                                    a++;
                                }
                            }
                            if(k==data[j].resoureces.length-1){
                                if(a==data[j].resoureces.length){
                                    data[j].types=true;
                                }
                            }
                        }
                    }*/
                    for(var g=0;g<data.menus.length;g++){
                        for(var j=0;j<data.menus[g].menus.length;j++){
                            var a=0;
                            for(var k=0;k<data.menus[g].menus[j].resoureces.length;k++){
                                for(var i=0;i<Poss.users.resources.length;i<i++){
                                    if(data.menus[g].menus[j].resoureces[k]==Poss.users.resources[i].id){
                                        a++;
                                    }
                                }
                                if(k==data.menus[g].menus[j].resoureces.length-1){
                                    if(a==data.menus[g].menus[j].resoureces.length){
                                        data.menus[g].menus[j].types=true;
                                        data.menus[g].menusType=true;
                                    }
                                }
                            }
                        }

                    }
                    Poss.isDeBug(data.menus,0);
                    var h=template(_this.homeTpl.treeTpl,{
                        type:Poss.users.type,
                        data:data.menus
                    });
                   _this.tabBind(h);
                });
            },
            tabBind: function (h) {
                var _this=this;
                $(h).find(".parent").on("click", function () {
                    $(this).next(".sub-menu").toggle();
                }).end().find(".tab").each(function () {
                    $(this).on("click", function () {
                        var text=$(this).text(),
                            name=$(this).parents(".leve2").attr('data-name'),
                            href=$(this).attr('data-name');
                        $("#welcome").hide();
                        if(_this.tabs.find("a").length>0){
                            _this.tabs.find("a").each(function (i) {
                                if(href==$(this).attr("href")){
                                    _this.$this=$(this);
                                    _this.bool=true;
                                }
                                if(i== _this.tabs.find("a").length-1){
                                    _this.isTab(text,href,name);
                                }
                            });
                        }else{
                            _this.isTab(text,href,name);
                        }
                    })
                }).end().appendTo($("#"+_this.homeTpl.treeId));
                if($("#parents-index").find("li").length==0){
                    $("#parents-index").parents(".parent").hide();
                }
            },
            isTab: function (text,href,name) {
                var _this=this;
                if(_this.bool){
                    var id=_this.$this.attr("href"),
                        parent=_this.$this.parents("li");
                    parent.siblings('.active').removeClass('active');
                    parent.addClass('active');
                    _this.tabCom.find("#"+id).siblings('.active').removeClass('active');
                    _this.tabCom.find("#"+id).addClass("active");

/*                    var parent=_this.$this.parents("li"),
                        ind=parent.index();
                    parent.siblings('.active').removeClass('active');
                    parent.addClass('active');
                    _this.tabCom.find(".tab-pane").eq(ind).siblings('.active').removeClass('active');
                    _this.tabCom.find(".tab-pane").eq(ind).addClass("active");*/
                }else{
                    _this.tabs.find(".active").removeClass('active');
                    var html=template('tpl-tab',{
                        href:href,
                        text:text
                    });
                    $(html).find(".fa-times").on('click', function () {
                        var i=$(this).parents("li").index();
                        var id=$(this).parents("a").attr("href").replace("#","");
                        Util.clearVal(id);
                        if($(this).parents("li").hasClass('active')){
                            _this.delTab(i,true,href);
                        }else{
                            _this.delTab(i,false,href);
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        var h=$(this).attr("href");
                        _this.tabCom.find("#"+h).addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo( _this.tabs);
                    _this.dataTab(href);
                }
                _this.bool=false;
            },
            /**动态获取数据，加载模板
             *
             * */
            dataTab: function (href) {
                Poss.isDeBug(href);
                if(this.obj[href]){
                    //require([href]).callSomeFunction();
                    var p=this.hideCon.find('#'+href).addClass("active");
                    this.tabCom.children('.active').removeClass("active");
                    this.tabCom.append(p);
                }else{
                    require([href]);
                    this.obj[href]=$("#"+href);
                }
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
            }
        });
        return index;
    }
)