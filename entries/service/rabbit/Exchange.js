define(
    ['jQuery','entries/lib/ui/class','template','entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    ck_search:$("#ck-search"),
                    ck_newAdd:$("#ck-newAdd"),
                    hideCon:$("#hideCon"),
                    url:"/marketing/rabbit-point-exchanges",
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
                    this.delDate();
                    this.status=1;
                }
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.user=$("#Exchange");
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
                //Util.totals = this.total;
                //Util.setTotal(this.total);
            },
            tableLoad: function (data) {
                for(var i=0;i<data.length;i++){
                    data[i].ex_time=Poss.isDate(data[i].ex_time,0);
                }
                var html=template('ex-table',{list:data});
                this.user.find(".tt-table").empty();
                this.user.find(".tt-table").append(html);
            },
            /**清除时间日期*/
            delDate: function () {
                $(".delDate").on("click", function () {
                    Util.delDate($(this));
                });
            },
            loadDate: function (callBack) {
                var $div=$('<div></div>');
                $('body').append($div);
                this.typeData(function (sel) {
                    var data={
                        href:"Exchange",
                        select:sel.data
                    };
                    $div.load('tpl/rabbit/exchange.html', function () {
                        var h=template('tpl-Exchange',data);
                        callBack(h);
                    });
                });
            },
            //兑换券类型查询
            typeData: function (callBack) {
                Poss.ajaxBack(Poss.baseUrl("/marketing/rabbit-point-exchanges/coupon-kinds"),"GET",{},this.user, function (d,xhr) {
                    if(d.status==0){
                        callBack(d);
                    }else{
                        Poss.errorDate("请刷新","Exchange");
                    }
                });
            },
            //查询
            loadSerach: function (_this) {
                this.user.find(".ex-search").on("click", function () {
                    var d = _this.searchVild();
                    Util.initPage(d);
                    Poss.ajaxBack(Poss.baseUrl(_this.url), "GET",d, this.user, function (d, xhr) {
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