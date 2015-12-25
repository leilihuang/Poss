define(
    ['../../lib/ui/class.js','../../util/tpl.js'],
    function (Class,Tpl) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    bool:false,
                    $this:null,
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content")
                }
                $.extend(true,this,opts,options);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.bindEval();
            }

        });
        return search;
    }
)