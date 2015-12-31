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
                    this.user=$("#setting");
                    Poss.dateTime();
                    this.loadSerach(this);
                    this.addLoad();
                    this.addSub(this);
                    this.addCencer(this);
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
                var _this=this;
                $.ajax({
                    url:Poss.baseUrl(_this.url),
                    type:'GET',
                    dataType:'json',
                    contentType:'application/json',
                    success: function (date) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        for(var i=0;i<date.length;i++){
                            date[i].start_date=Poss.isDate(date[i].start_date,0);
                            date[i].end_date=Poss.isDate(date[i].end_date,0);
                        }
                        $div.load('tpl/rabbit/setting.html', function () {
                            var h=template('tpl-setting',{
                                href:"setting",
                                list:date
                            });
                            callBack(h);
                        });
                    }
                });
            },
            /**新增*/
            addLoad: function () {
                var _this=this;
                this.user.find(".set_add").on("click", function () {
                    _this.modelShow();
                });
            },
            addCencer: function (_this) {
                this.user.find(".ck_cancel").on("click", function () {
                    _this.modelHide();
                });
            },
            addSub: function (_this) {
                this.user.find(".ck_sub").on("click", function () {
                    _this.modelShow();
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#setting").find(".set_search").on("click", function () {
                    _this.searchVild(function (date) {
                        //     url:'../../entries/test/ckAdd.json',
                        $.ajax({
                            url:'../../entries/test/ttDetail.json',
                            type:'GET',
                            dataType:'json',
                            contentType:'application/json',
                            data:date,
                            success: function (data) {
                                var html=template('tt-table',{list:data});
                                $("#setting").find(".tt-table").empty();
                                $("#setting").find(".tt-table").append(html);
                            }
                        });
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