define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon:$("#hideCon"),
                    url:"/marketing/exchange-diagram",
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
                    //this.loadSerach(this);
                    this.status=1;
                }
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.user=$("#proportion");
                    _this.bindEval();
                });
            },
            loadDate: function (callBack) {
                Poss.ajaxBack(Poss.baseUrl(this.url), "GET",{}, this.user, function (d, xhr) {
                    if (d.status == 0) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            href:"proportion",
                            list:d.data
                        };
                        $div.load('tpl/rabbit/proportion.html', function () {
                            var h=template('tpl-proportion',data);
                            callBack(h);
                        });
                    } else {
                        Poss.errorDate("接口调用失败，请刷新页面","proportion");
                    }
                });
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