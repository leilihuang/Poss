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
        dateTime: function () {
            $(".datetime").datetimepicker({autoclose: true});
        },
        errorDate: function (text,href) {
            this.isDeBug(text,1);
            var h='<div class="tab-pane active cont" id='+href+'>'+text+'</div>';
            return h;
        },
        isJson: function (obj) {
            return JSON.stringify(obj);
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