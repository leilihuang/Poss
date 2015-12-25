define(
    ['jQuery','../../lib/ui/class.js','../../util/tpl.js','template','bootstrap','datetimepicker'],
    function ($,Class,Tpl,template) {
        var index=Class.create({
            setOptions: function (opts) {
                var options={
                    bool:false,
                    $this:null,
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon:$("#hideCon"),
                    obj:{}
                }
                $.extend(true,this,opts,options);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.bindEval();
            },
            bindEval: function () {
                this.showBody();
                this.leftTree();
                this.tabTree();
                $('#tpl').load('tpl/tpl.html');
                Poss.dateTime();
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
            tabTree: function () {
                var _this=this;
                $(".cl-vnavigation").find(".tab").each(function () {
                    $(this).on("click", function () {
                        var text=$(this).text(),
                            name=$(this).parents(".leve2").attr('data-name'),
                            href=$(this).attr('href').replace("#",'');
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
                })
            },
            /**动态获取数据，加载模板
             *
             * */
            dataTab: function (href) {
                Poss.isDeBug(href);
                if(this.obj[href]){
                    var p=this.hideCon.find('#'+href).addClass("active");
                    this.tabCom.children('.active').removeClass("active");
                    this.tabCom.append(p);
                }else{
                    require([href]);
                    this.obj[href]=$("#"+href);
                }
            },
            isTab: function (text,href,name) {
                var _this=this;
                if(_this.bool){
                    var parent=_this.$this.parent("li"),
                        ind=parent.index();
                    parent.siblings('.active').removeClass('active');
                    parent.addClass('active');
                    _this.tabCom.find(".tab-pane").eq(ind).siblings('.active').removeClass('active');
                    _this.tabCom.find(".tab-pane").eq(ind).addClass("active");
                }else{
                    _this.tabs.find(".active").removeClass('active');

                    var html=template('tpl-tab',{
                        href:href,
                        text:text
                    });
                    $(html).find(".fa-times").on('click', function () {
                        var i=$(this).parents("li").index();
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
            delTab: function (i,bool,href) {
                var tabs_li=this.tabs.find('li'),
                    panel=this.tabCom.find("#"+href);
                    //tabs_con=this.tabCom.find('.tab-pane');
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                //tabs_con.eq(i).remove();
                if(bool){
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            }
        });
        return index;
    }
)