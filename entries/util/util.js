define(
    ['jQuery','template'],
    function ($,template) {
        var Util={
            total:0,
            tabs:$("#nav_tabs"),
            tabCom:$("#tab-content"),
            hideCon:$("#hideCon"),
            /**
             * pageNum 页码
             * total 总数
             * */
            pageNum: function (url,data,callback) {
                $.ajax({
                    url:Poss.baseUrl(url),
                    type:"GET",
                    data:data,
                    dataType:"json",
                    contentType:"application/json",
                    success: function (date) {
                        callback(date);
                    }
                });
            },
            /**
             * 下一页*/
            nextPage: function (pre,next,number,url,callback) {
                var _this=this;
                next.on("click", function () {
                    var pageNum=Number(number.find("input").val())+1;
                    if(pageNum==_this.total){
                        next.addClass("disabled");
                    }else if(pageNum>_this.total){
                        return false;
                    }else{
                        number.find("input").val(pageNum);
                        pre.removeClass("disabled");
                        _this.pageNum(url,{
                            last_cursor:pageNum,
                            count:10
                        }, function (data) {
                            callback(data);
                        });
                    }
                });
            },
            /**上一页*/
            prePage: function (pre,next,number,url,callback) {
                var _this=this;
                pre.on("click", function () {
                    var pageNum=Number(number.find("input").val())-1;
                    if(pageNum==1){
                        pre.addClass("disabled");
                    }else if(pageNum<1){
                        return false;
                    }else{
                        number.find("input").val(pageNum);
                        next.removeClass("disabled");
                        _this.pageNum(url,{
                            last_cursor:pageNum,
                            count:10
                        }, function (data) {
                            callback(data);
                        });
                    }

                });
            },
            /**按回车键查询*/
            enterEval: function (pre,next,$input,url,callback) {
                var _this=this;
                $input.on("keyup", function (event) {
                    if(event.keyCode==13){
                        if($input.val()==1){
                            pre.addClass("disabled");
                            next.removeClass("disabled");
                        }else if($input.val()==_this.total){
                            next.addClass("disabled");
                            pre.removeClass("disabled");
                        }else{
                            pre.removeClass("disabled");
                            next.removeClass("disabled");
                        }
                        _this.pageNum(url,{
                            last_cursor:$(this).val(),
                            count:10
                        }, function (data) {
                            callback(data);
                        });
                    }else{
                        if(Number($input.val())<1){
                            $input.val(1);
                        }else if(Number($input.val())>_this.total){
                            $input.val(_this.total);
                        }
                        $input.val($input.val().replace(/\D/g,''));
                    }
                });
            },
            /**判断是否打开了一个tab，并且添加tab切换事件和关闭事件*/
            isTab: function (text,newId,bool,$this,callback) {
                var _this=this,html=template('tpl-tab',{
                        text:text,
                        href:newId
                    });
                var h=newId.replace("#",'');
                if(bool){
                    var i=$this.parent().index();
                    this.tabs.find("li").eq(i).addClass("active").siblings(".active").removeClass("active");
                    this.tabCom.find(".tab-pane").eq(i).addClass("active").siblings(".active").removeClass("active");
                    callback(0);
                }else{
                    this.tabs.find(".active").removeClass('active');
                    $(html).find(".fa-times").on('click', function () {
                        var i=$(this).parents("li").index();
                        if($(this).parents("li").hasClass('active')){
                            _this.delTab(i,true,h);
                        }else{
                            _this.delTab(i,false,h);
                        }
                        return false;
                    }).end().find("a").on("click", function () {
                        _this.tabCom.find(newId).addClass("active").siblings(".active").removeClass("active");
                    }).end().appendTo( _this.tabs);
                    callback(1);
                }
            },
            /**关闭tab*/
            delTab: function (i,bool,href) {
                var tabs_li=this.tabs.find('li'),
                    panel=this.tabCom.find("#"+href);
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                if(bool){
                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            },
           /**公用弹出层显示*/
            modelShow: function ($this) {
                $this.find(".form-primary").addClass("md-show").css("perspective","none");
            },
            /**公用弹出层隐藏*/
            modelHide: function ($this) {
                $this.find(".form-primary").removeClass("md-show").css("perspective","1300px");
            }
        }
        return Util;
    }
)