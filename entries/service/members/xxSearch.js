define(
    ['jQuery','lib/ui/class'],
    function ($,Class) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={

                };
                $.extend(true,this,options,opts);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.bindEval();
            },
            bindEval: function () {
                Poss.isDeBug("出来了");
            }
        });
        return search;
    }
)