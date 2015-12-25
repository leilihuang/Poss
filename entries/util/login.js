define(
    [],
    function(){
        var login={
            setOptions: function (opts) {
                var options={
                    log:$("#login"),
                    register:$("#register")
                }
              $.extend(true,this,options.opts);
            },
            init: function (opts) {
               this.setOptions(opts);
                this.bindEval();
            },
            load: function (callBack) {
                $.ajax({
                    url:"",
                    type:'POST',
                    dataType: function (date) {
                        callBack(date);
                    }
                })
            }
        }
        return login;
    }
)