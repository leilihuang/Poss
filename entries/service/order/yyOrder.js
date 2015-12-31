define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabCom:$("#tab-content"),
                    ck_search:$("#yy-search"),
                    tabs:$("#nav_tabs"),
                    hideCon:$("#hideCon"),
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
                    _this.detail(html,_this.tabCom);
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                    $.ajax({
                    url:Poss.baseUrl('/marketing/seller-orders'),
                    type:"GET",
                    dataType:"json",
                    contentType:"application/json",
                    success: function (date) {
                        for(var i = 0; i<date.length;i++){
                            date[i].raw_amount = Poss.spun(date[i].raw_amount);
                            date[i].raw_cash = Poss.spun(date[i].raw_cash);
                            date[i].raw_coupon = Poss.spun(date[i].raw_coupon);
                            date[i].raw_concessions_discount = Poss.spun(date[i].raw_concessions_discount);
                        }
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            list:date,
                            href:"yyOrder"
                        };
                        $div.load('tpl/order/yyOrder.html', function () {
                            var h=template('yyOrder',data);
                            callBack(h);
                        });
                    },
                    error: function () {
                        var h=Poss.errorDate("接口调用失败","yyOrder");
                        callBack(h);

                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#yy-search").on("click", function () {
                    _this.searchVild(function (date) {
                        $.ajax({
                            url:Poss.baseUrl('/marketing/seller-orders'),
                            type:'GET',
                            dataType:'json',
                            contentType:'application/json',
                            data:date,
                            success: function (data) {
                                for(var i = 0; i<data.length;i++){
                                    data[i].raw_amount = Poss.spun(data[i].raw_amount);
                                    data[i].raw_cash = Poss.spun(data[i].raw_cash);
                                    data[i].raw_coupon = Poss.spun(data[i].raw_coupon);
                                    data[i].raw_concessions_discount = Poss.spun(data[i].raw_concessions_discount);
                                }
                                var html=template('yy-table',{list:data});
                                $("#yyOrder").find(".yy-table").empty();
                                var $table=$("#yyOrder").find(".yy-table");
                                _this.detail(html,$table);

                            }
                        })
                    });
                });
            },
            searchVild: function (callback) {
                var date={},yy_search=$("#yy_search")
                yy_search.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                Poss.selectVal(yy_search,date);
                callback(date);
            },
            //新增
            loadAdd: function (_this) {
                $("#ck-newAdd").on("click", function () {
                    _this.modelShow();
                });
            },
            //取消
            cancel: function (_this) {
                $("#ck_cancel").on("click", function () {
                    _this.modelHide();
                });
            },
            //提交
            submit: function (_this) {
                $("#ck_submit").on("click", function () {
                    _this.validInp(function (date) {
                        $.ajax({
                            url:"",
                            type:"GET",
                            data:date,
                            dataType:'json',
                            success: function (date) {
                                _this.layout();
                            },
                            error: function (error) {
                                Poss.isDeBug(error);
                            }
                        })
                    });
                });
            },
            //详情
            detail: function (html,$table) {
                var _this=this;
                $(html).find(".yydetail").each(function () {
                    $(this).on('click', function () {
                        var text=$(this).text(),href=$(this).attr('href'),
                        so_code=$(this).parents("tr").find("th").eq(2).text();
                        _this.tabs.find("a").each(function (i) {
                            if(href==$(this).attr("href")){
                                _this.user=$(this);
                                _this.bool=true;
                            }
                            if(i== _this.tabs.find("a").length-1){
                                _this.isTab(text,so_code);
                            }
                        });
                    })
                }).end().appendTo($table);
            },
            isTab: function (text,so_code) {
                var _this=this,
                    html=template('tpl-tab',{
                        text:text,
                        href:'#yydetail'
                    });
                if(_this.bool){
                    var i=_this.user.parent().index();
                    _this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                    _this.tplCon(so_code,0);
                }else{
                    _this.tabs.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i=$(this).parents("li").index();
                        if($(this).parents("li").hasClass('active')){
                            _this.delTab(i,true,"detail");
                        }else{
                            _this.delTab(i,false,"detail");
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find("#yydetail").addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo( _this.tabs);
                    _this.tplCon(so_code);
                }
                _this.bool=false;

            },
            tplCon: function (ck_id,status) {
                var url="/marketing/seller-orders/"+ck_id,_this=this;
                $.ajax({
                    url:Poss.baseUrl(url),
                    type:"GET",
                    dataType:"JSON",
                    contentType:"application/json",
                    success: function (data) {
                        data.create_time= Poss.isDate( data.create_time,0);
                        data.deliver_time= Poss.isDate( data.deliver_time,0);
                        data.effect_time= Poss.isDate( data.effect_time,0);
                        data.complete_deadline= Poss.isDate( data.complete_deadline,0);
                        data.complete_time= Poss.isDate( data.complete_time,0);
                        data.raw_amount = Poss.spun(data.raw_amount);
                        data.raw_cash = Poss.spun(data.raw_cash);
                        data.raw_coupon = Poss.spun(data.raw_coupon);
                        data.raw_concessions_discount = Poss.spun(data.raw_concessions_discount);
                        var  orderItems = data.order_items;
                        for(var i = 0; i<orderItems.length;i++){
                            orderItems[i].unit_amount = Poss.spun(orderItems[i].unit_amount);
                            orderItems[i].raw_amount = Poss.spun(orderItems[i].raw_amount);
                        }
                        if(status==0){
                            var h=template('yy-detail',{
                                list:data
                            });
                            _this.tabCom.find("#yydetail").empty();
                            _this.tabCom.find("#yydetail").append(h);
                        }else{
                            var h=template('yy-detail',{
                                editHref:'yydetail',
                                list:data
                            });
                            _this.tabCom.find('.active').removeClass('active');
                            $(h).appendTo(_this.tabCom);
                        }
                    },
                    error: function () {

                    }
                });
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
            validInp: function (callback) {
                var date={},ck_modal=$("#ck_modal");
                ck_modal.find(":text").each(function () {
                  if($(this).val()==''){
                      $(this).parents('.form-group').addClass("has-error");
                  }else{
                      $(this).parents('.form-group').removeClass("has-error");
                      date[$(this).attr("data-name")]=$(this).val();
                  }
              });
                ck_modal.find(":radio").each(function () {
                  if($(this).attr("checked")=="checked"){
                      date[$(this).attr("name")]=$(this).val();
                  }
              });
                ck_modal.find("select").each(function () {
                  date[$(this).attr("data-name")]=$(this).val();
              });
              var text=ck_modal.find("textarea");
                date[text.attr("data-name")]=text.val();
                callback(date);
            },
            modelShow: function () {
                $("#form-primary").addClass("md-show").css("perspective","none");
            },
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