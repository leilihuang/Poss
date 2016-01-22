define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
       var id = "couponsQuery";
        var url = "/marketing/coupons";
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    ck_search:$("#ck-search"),
                    ck_newAdd:$("#ck-newAdd"),
                    hideCon:$("#hideCon"),
                    url:"/marketing/coupons",
                    status:0,
                    total:0,
                    user:null,
                    $this:null,
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
                    this.page();
                    this.status=1;
                }
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.user=$("#"+id);
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
                Util.pageDemo(pageCom);
                next.on("click", function () {
                    var d = _this.searchVild();
                    Util.nextPage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                pre.on("click", function () {
                    var d = _this.searchVild();
                    Util.prePage(pageCom, _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
                number.find("input").on("keyup", function (event) {
                    var d = _this.searchVild();
                    Util.enterEval(pageCom, event, $(this), _this.url, d, function (data) {
                        _this.tableLoad(data);
                    });
                });
            },
            tableLoad: function (data) {
                var html=template('coupons-table',{list:data});
                this.user.find(".coupons-table").empty();
                this.user.find(".coupons-table").append(html);
            },
            loadDate: function (callBack) {
                var $div=$('<div></div>');
                $('body').append($div);
                this.typeData(function (sel) {
                    var data={
                        href:id,
                        select:sel.data
                    };
                    $div.load('tpl/markingMgm/couponsQuery.html', function () {
                        var h=template('tpl-couponsQuery',data);
                        callBack(h);
                    });
                });
            },
            typeData: function (callBack) {
                Poss.ajaxBack(Poss.baseUrl(url),"GET",{},this.user, function (d) {
                    if(d.status==0){
                        callBack(d);
                    }else{
                        Poss.errorDate("接口调用失败，请刷新页面",id);
                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                this.user.find("#coupons-button").on("click", function () {
                    var d = _this.searchVild();
                    Util.initPage(d);
                    Poss.ajaxBack(Poss.baseUrl(url), "GET",d, this.user, function (d, xhr) {
                        if (d.status == 0) {
                            _this.total=xhr.getResponseHeader("X-Total-Count");
                            var pageCom=_this.user.find(".pagination"),
                                number=pageCom.find(".number"),
                                total=pageCom.find(".total");
                            number.find("input").val(1);
                            _this.user.find(".tplPage").show();
                            _this.tableLoad(d.data);
                            Util.setTotal(_this.total);
                        } else {
                            Poss.isDeBug("接口调用失败", 1);
                        }
                    });
                });
            },
            searchVild: function () {
                var date={};
                this.user.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                Poss.selectVal(this.user,date);
                return date;
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
