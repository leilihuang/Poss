define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {
        var edit=Class.create({
            setOptions: function (opts) {
                var options={
                    tabCom:$("#tab-content")
                };
                $.extend(true,this,options,opts);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.bindEval();
            },
            bindEval: function () {
                this.layout();
            },
            layout: function () {
                var _this=this;
                this.loadDate(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    Poss.dateTime();
                });
            },
            loadDate: function (callBack) {
                $.ajax({
                    url:"../../entries/test/xxSearch.json",
                    type:"get",
                    dataType:"json",
                    success: function (date) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        date.href="xxEdit";
                        $div.load('tpl/huiyuan/xxEdit.html', function () {
                            var h=template('xxEdit',date);
                            callBack(h);
                        });
                    }
                });
            }
        });
        var s=null;
        return {
            init: function () {
                if(s!=null){
                    s.init();
                }else{
                    s=new edit();
                }
            }
        };
    }
)