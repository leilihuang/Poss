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
                    this.loadSerach(this);
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
                $.ajax({
                    url:'../../entries/test/dHuan.json',
                    type:'GET',
                    dataType:'json',
                    contentType:'application/json',
                    success: function (date) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            href:"proportion",
                            list:date
                        };
                        $div.load('tpl/rabbit/proportion.html', function () {
                            var h=template('tpl-proportion',data);
                            callBack(h);
                        });
                    }
                });

            },
            //查询
            loadSerach: function (_this) {
                $("#tt-search").on("click", function () {
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
                                $("#Exchange").find(".tt-table").empty();
                                $("#Exchange").find(".tt-table").append(html);
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