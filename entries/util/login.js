define(
    ['jQuery','entries/util/util'],
    function($,Util){
        var login={
            setOptions: function (opts) {
                var options={
                    log:$("#login"),
                    register:$("#register"),
                    vaild:$("#log_content"),
                    url:"/system/session",
                    loginBtns:{
                        keyUpPassword:"password"
                    }
                };
              $.extend(true,this,options,opts);
            },
            init: function (opts) {
                this.setOptions(opts);
                this.bindEval();
            },
            bindEval: function () {
                this.login(this);
                this.passwordBind(this);
                $(".texture").css({
                    opacity: 1,
                    "margin-left": "0px"
                });
            },
            login: function (_this) {
                this.log.on("click", function () {
                    _this.load(function (d) {
                        document.cookie="log_token="+d.token;
                        window.location.href="index.html";
                    });
                });
            },
            passwordBind: function (_this) {
               $("#"+this.loginBtns.keyUpPassword).on("keyup", function (event) {
                   if(event.keyCode=="13"){
                       _this.load(function (d) {
                           document.cookie="log_token="+d.token;
                           window.location.href="index.html";
                       });
                   }
               })
            },
            reg: function () {
                this.register.on("click", function () {

                });
            },
            load: function (callBack) {
                var _this=this;
                this.validation(function (data,vaild) {
                    if(vaild!=1){
                        $.ajax({
                            url:Poss.logUrl(_this.url),
                            type:'POST',
                            dataType:"json",
                            contentType:"application/json",
                            data:Poss.isJson(data),
                            success: function (date) {
                                callBack(date);
                            },
                            error: function (d) {
                                console.log(d);
                                Util.errorTip("登录失败",JSON.parse(d.responseText).message);
                            }
                        });
                    }
                });

            },
            validation: function (callback) {
                var data={
                    "user":{
                        "login_name":null,
                        "password":null
                    },
                    "domain":{
                        "code":null
                    }
                },vaild=0;
                this.vaild.find("input").each(function () {
                    if($(this).hasClass("mandatory") && $(this).val()==""){
                        $(this).parents(".form-group").addClass("has-error");
                        vaild=1;
                    }else{
                        if($(this).parents(".form-group").hasClass("has-error")){
                            $(this).parents(".form-group").removeClass("has-error");
                        }
                        if($(this).attr("data-name")=="code"){
                            data.domain[$(this).attr("data-name")]=$(this).val();
                        }else{
                            data.user[$(this).attr("data-name")]=$(this).val();
                        }
                    }
                });
                callback(data,vaild);
            }
        };
        return login;
    }
)