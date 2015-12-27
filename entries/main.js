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
                    alert(text);
                }
            }
        },
        /**时间控件初始化*/
        dateTime: function () {
            $(".datetime").datetimepicker({autoclose: true});
        },
        /**调用接口打印报错信息*/
        errorDate: function (text,href) {
            this.isDeBug(text,1);
            var h='<div class="tab-pane active cont" id='+href+'>'+text+'</div>';
            return h;
        },
        /**object对象转换json字符串*/
        isJson: function (obj) {
            return JSON.stringify(obj);
        },
        inputVal: function ($con,date) {
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
                date[$(this).attr("data-name")]=$(this).val();
            });
        }
    }


    function getBaseJsUrl(url){
        return baseJsUrl+url;
        //return "http://s.zzt.tm/portal-static/js/"+url;
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
        }
    };
    require.config(config);
})();