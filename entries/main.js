(function(){
    var obj = document.getElementById('requirejs'),
        baseJsUrl =obj&& obj.getAttribute('data-url')?obj.getAttribute('data-url') : '/',
        slot = baseJsUrl.match(/[a-zA-Z]\d/),
        isDebug = 0,
        bool=true;
    //获取js路径

    if(slot && slot.length>0){
        slot =  slot[0];
        baseJsUrl = baseJsUrl.match(/http:\/\/[\w\.]*\//)[0];
    }

    if(typeof(window.poss) != 'object'){
        window.Poss={}
    }
    Poss={
        //每页显示条数
        count:10,
/*        base:"http://10.2.8.115:8088",
        log:"http://10.2.8.115:8089",*/
        base:"%baseUrl%",
        log:"%loginUrl%",
        token:document.cookie.split(";")[0].split("=")[1],
        /**
         * status 0表示年月日时分秒*/
        isDate: function (str,status) {
            if(str && str!="null"){
                if(typeof str !="number"){
                    str=str.replace("-","/").replace("T"," ");
                }
                var a=new Date(str),h=a.getHours(),f=a.getMinutes();
                var M=(a.getMonth()+1)>9 ? (a.getMonth()+1) :"0"+(a.getMonth()+1),
                    d=a.getDate() > 9 ? a.getDate() :"0"+a.getDate(),
                    time=a.getFullYear()+"-"+M+"-"+d;
                if(status==0){
                    if(Number(h)<10){
                        h="0"+h;
                    }
                    if(Number(f)<10){
                        f="0"+f;
                    }
                    time=time+" "+h+":"+f;
                }
                return time;
            }
        },
        /**分转元*/
        spun: function (num) {
            if(num=="" || !num){
                num=0;
            }
            //return Math.floor(Number(num))/100;
            return (Number(num)/100).toFixed(2);
        },
        /**url接口*/
        baseUrl: function (url) {
            return this.base+url;
        },
        /**登录接口*/
        logUrl: function (url) {
            return this.log+url;
        },
        /**打印日志
         * @text 内容
         * @status 0 在控制台打印  1 alert弹出层打印
         * */
        isDeBug: function (text,status) {
            if(!status){
                status=0;
            }
            if(bool){
                if(status==0){
                   console.log(text);
                }else{
                    $.gritter.add({
                        title: '提示信息',
                        text: text,
                        class_name: 'info'
                    });
                }
            }
        },
        /**时间控件初始化*/
        dateTime: function () {
            $(".datetime").datetimepicker({autoclose: true});
        },
        /**调用接口打印报错信息*/
        errorDate: function (text,href) {
            $("#tab-content").find(".active").removeClass("active");
            var h='<div class="tab-pane active cont" id='+href+'></div>';
            $(h).load("404.html").appendTo($("#tab-content"));
        },
        /**object对象转换json字符串*/
        isJson: function (obj) {
            return JSON.stringify(obj);
        },
        inputVal: function ($con,date,status) {
            $con.find(":text").each(function () {
                if($(this).val()==''){
                    $(this).parents('.form-group').addClass("has-error");
                }else{
                    $(this).parents('.form-group').removeClass("has-error");
                    date[$(this).attr("data-name")]=$(this).val();
                }
            });
        },
        radioVal: function ($con,date) {
            $con.find(":radio").each(function () {
                if($(this).attr("checked")=="checked"){
                    date[$(this).attr("name")]=$(this).val();
                }
            });
        },
        selectVal: function ($con,date) {
            $con.find("select").each(function () {
                console.log($(this).attr("data-name")+"----------"+$(this).val());
                date[$(this).attr("data-name")]=$(this).val();
            });
        },
        /**
         * ajax登录分装
         * url         接口地址
         * type        接口类型
         * data        传递参数
         * id          主页入口ID
         * callback   data.status==0表示成功  1表示失败回调函数
         * */
        ajaxBack: function (url,type,data,id,callBack) {
            $.ajax({
                url:url,
                type:type,
                data:data,
                cache:false,
                dataType:"json",
                contentType:"application/json",
                success: function (data,textStatus, jqXHR) {
                    callBack({
                        status:0,
                        data:data
                    },jqXHR);
                },
                error: function (d) {
                    //var h=Poss.errorDate("接口调用失败",id);
                    callBack({
                        status:1,
                        data:JSON.parse(d.responseText)
                    },null);
                },
                complete: function (x) {
                    if(x.status=="401"){
                        window.location.href="login.html";
                    }
                },
                headers:{
                    "X-Auth-Token" :document.cookie.split(";")[0].split("=")[1]
                }
            });
        },
        users:{
            domainId:"",
            name:"",
            rolesId:"",
            type:"",
            resources:null
        }
    };

    function getBaseJsUrl(url){
        return baseJsUrl+url;
    }
    var config = {
        paths: {
            jQuery: [
                getBaseJsUrl('jquery')
            ],
            juicer: [
                getBaseJsUrl('juicer-min')
            ],
            text: [
                getBaseJsUrl('text')
            ],
            datetimepicker: [
                getBaseJsUrl('bootstrap-datetimepicker')
            ],
            bootstrap: [
                getBaseJsUrl('bootstrap.min')
            ],
            ejs: [
                getBaseJsUrl('ejs.min')
            ],
            template: [
                getBaseJsUrl('template')
            ],
            fueluxLoader: [
                getBaseJsUrl('loader.min')
            ],
            bootstrapSwitch: [
                getBaseJsUrl('bootstrap-switch.min')
            ],
            model:[
                getBaseJsUrl('jquery.modalEffects')
            ],
            gritter:[
                getBaseJsUrl('jquery.gritter.min')
            ],
            parsley: [
                getBaseJsUrl('parsley')
            ],
            icheck: [
                getBaseJsUrl('icheck.min')
            ]
        },
        shim: {
            jQuery: {
                deps: [],
                exports: '$'
            },
            juicer: {
                deps: ['jQuery'],
                exports: 'juicer'
            },
            datetimepicker: {
                deps: ['jQuery'],
                exports: 'datetimepicker'
            },
            bootstrap: {
                deps: ['jQuery'],
                exports: 'bootstrap'
            },
            ejs:{
                deps:['jQuery'],
                exports:'ejs'
            },
            template:{
                deps:['jQuery'],
                exports:'template'
            },
            model:{
                deps:['jQuery'],
                exports:'model'
            },
            gritter:{
                deps:['jQuery'],
                exports:'gritter'
            },
            icheck:{
                deps:['jQuery'],
                exports:'icheck'
            }
        }
    };
    require.config(config);
})();