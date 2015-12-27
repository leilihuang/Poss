define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
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
                    _this.edit(html);
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                //url:"http://192.168.2.11:8088/marketing/coupon-kinds",
                var _this=this;
                $.ajax({
                    url:"../../entries/test/ckSearch.json",
                    type:"GET",
                    dataType:"json",
                    contentType:"application/json",
                    success: function (date) {
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
                        //url:'http://192.168.2.11:8088/marketing/coupon-kinds',
                        $.ajax({
                            url:'../../entries/test/ckAdd.json',
                            type:'GET',
                            dataType:'json',
                            contentType:'application/json',
                            //data:date,
                            success: function (data) {
                                var html=template('ck-table',{list:data});
                                $("#ckSearch").find(".ck-table").empty();
                                $("#ckSearch").find(".ck-table").append(html);
                                //_this.tabCom.append(html);
                            }
                        })
                    });
                });
            },
            searchVild: function (callback) {
                var date={},ck_search=$("#ck_search")
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