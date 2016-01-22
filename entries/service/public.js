define(
    ['jQuery'],
    function ($) {
        var base={
            tokenUser: function (callBack) {
                $.ajax({
                    url:Poss.logUrl("/system/session"),
                    type:"GET",
                    cache:false,
                    dataType:"json",
                    contentType:"application/json",
                    success:function(data){
                        Poss.users.domainId=data.domain.id;
                        Poss.users.name=data.user.name;
                        Poss.users.resources=data.resources;
                        Poss.users.type=data.user.type;
                        callBack();
                    },
                    complete: function (x) {
                        if(x.status=="200"){
                            //callBack();
                        }else{
                            window.location.href="login.html";
                        }
                    },
                    headers:{
                        "X-Auth-Token" :document.cookie.split(";")[0].split("=")[1]
                    }
                })
            }
        };
        return base;
    }
);