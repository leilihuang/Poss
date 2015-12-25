define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabCom:$("#tab-content"),
                    ck_search:$("#ck-search"),
                    ck_newAdd:$("#ck-newAdd"),
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
                    _this.tabCom.append(html);
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                //url:"http://192.168.2.11:8088/marketing/coupon-kinds",
                $.ajax({
                    url:"http://192.168.2.11:8088/marketing/coupon-kinds",
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
                            var h=template('ckSearch',data);
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
                        $.ajax({
                            url:'http://192.168.2.11:8088/marketing/coupon-kinds',
                            type:'GET',
                            dataType:'json',
                            contentType:'application/json',
                            data:date,
                            success: function (data) {
                                var html=template('ckSearch',data);
                                _this.tabCom.find(".active").removeClass('active');
                                _this.tabCom.append(html);
                                console.log(data);
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
                ck_search.find("select").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                callback(Poss.isJson(date));
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
                        console.log(date);
                        $.ajax({
                            url:"http://192.168.2.11:8088/marketing/coupon-kinds",
                            type:"POST",
                            data:date,
                            dataType:'json',
                            contentType:"application/json",
                            success: function (date) {
                                console.log(date);
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
                callback(Poss.isJson(date));
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