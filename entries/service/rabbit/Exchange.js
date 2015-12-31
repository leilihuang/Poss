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
                    count:10,
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
                    _this.user=$("#Exchange");
                    _this.bindEval();
                });
            },
            /**
             * 第一个参数传递分页的容器
             * @url 分页接口
             * */
            page: function () {
                var pageCom=this.user.find(".pagination"),
                    pre=pageCom.find(".prev"),
                    next=pageCom.find(".next"),
                    number=pageCom.find(".number"),
                    total=pageCom.find(".total"),
                    _this=this;
                Util.total=this.total;

                Util.prePage(pre,next,number,_this.url, function (data) {
                    _this.tableLoad(data);
                });
                Util.nextPage(pre,next,number,_this.url, function (data) {
                    _this.tableLoad(data);
                });
                Util.enterEval(pre,next,number.find("input"),_this.url, function (data) {
                    _this.tableLoad(data);
                });
                this.setCount(total);
            },
            tableLoad: function (data) {
                var html=template('tt-table',{list:data});
                this.user.find(".tt-table").empty();
                this.user.find(".tt-table").append(html);
            },
            /**设置分页总数*/
            setCount: function (total) {
                Util.total=Math.ceil(Number(this.total)/this.count);
                total.text(Util.total);
            },
            loadDate: function (callBack) {
                var $div=$('<div></div>');
                $('body').append($div);
                var data={
                    href:"Exchange"
                };
                $div.load('tpl/rabbit/exchange.html', function () {
                    var h=template('tpl-Exchange',data);
                    callBack(h);
                });
            },
            //查询
            loadSerach: function (_this) {
                $("#Exchange").find(".ex-search").on("click", function () {
                    _this.searchVild(function (date) {
                        $.ajax({
                            url:Poss.baseUrl(_this.url),
                            type:'GET',
                            dataType:'json',
                            contentType:'application/json',
                            data:date,
                            success: function (data,textStatus, jqXHR) {
                                _this.total=jqXHR.getResponseHeader("X-Total-Count");
                                var pageCom=_this.user.find(".pagination"),
                                    number=pageCom.find(".number"),
                                    total=pageCom.find(".total");
                                number.find("input").val(1);
                                _this.user.find(".tplPage").show();
                                _this.tableLoad(data);
                                _this.setCount(total);
                            }
                        });
                    });
                });
            },
            searchVild: function (callback) {
                var date={};
                this.user.find(":text").each(function () {
                    date[$(this).attr("data-name")]=$(this).val();
                });
                Poss.selectVal(this.user,date);
                date["last_cursor"]=1;
                date["count"]=10;
                callback(date);
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