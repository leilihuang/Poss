define(
    ['jQuery','entries/lib/ui/class','template', 'entries/util/util'],
    function ($,Class,template,Util) {
        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    hideCon: $("#hideCon"),
                    user:null,
                    status:0,
                    $this:null,
                    bool:true,
                    loadHtml:"tpl/markingMgm/generateCoupons.html",
                    gCoupons:{
                        ID:"tpl-generateCoupons",       //生成优惠劵页面ID
                        href:"generateCoupons",         //生成优惠劵页面href
                        selapply:".apply_limit",        //优惠劵类型下拉框SELECT class
                        inpSsid:".apply-ssid",           //专场优惠劵号INPUT
                        addSSid:".add-ssid",            //添加活动ID
                        delSSid:".del-ssid",            //删除活动ID
                        btnCps:".cps-submit",           //确定按钮CLASS
                        formCps:".form-coupon",         //表单信息
                        selCkid:".sel-ckid",            //优惠劵类型下拉框
                        inpqua:"quantity",              //优惠劵数量输入框ID
                        inpdate:".del-validity-start",   //优惠券开始日期控件样式
                        btnCancel:".cancelTab"          //取消按钮样式
                    }
                };
                $.extend(true,this,options,opts);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);
                this.layout();
            },
            bindEval: function () {
                if(this.status==0){
                    this.status=1;
                    this.sureToSubmit(this);
                    this.applyLimit(this);
                    this.inpAddssid(this);
                    Poss.dateTime();
                    this.delDate(this);
                    this.cancelTab(this);
                }
            },
            layout: function () {
                var _this=this;
                this.loadData(function (html) {
                    _this.tabCom.find(".active").removeClass('active');
                    _this.tabCom.append(html);
                    _this.user=$("#generateCoupons");
                    _this.bindEval();
                });
            },
            //加载页面事件
            loadData: function (callBack) {
                var _this=this;
                Poss.ajaxBack(Poss.baseUrl("/marketing/coupon-kind"), "GET", null, _this.user, function (d, xhr) {
                    if (d.status == 0) {
                        var $div=$('<div></div>');
                        $('body').append($div);
                        var data={
                            list: d.data.couponKinds,
                            href:_this.gCoupons.href
                        };
                        $div.load(_this.loadHtml, function () {
                            var h=template(_this.gCoupons.ID,data);
                            callBack(h);
                        });
                    } else {
                       Poss.errorDate("接口调用失败，请刷新页面。",_this.href)
                    }
                });
            },
            //优惠劵类型改变事件
            applyLimit:function(_this){
                $(_this.gCoupons.selapply).on("change", function () {
                    var apply=$(_this.gCoupons.selapply).val();
                    if(apply==1){
                        $(_this.gCoupons.inpSsid).css("display","block");
                    }else{
                        $(_this.gCoupons.inpSsid).css("display","none");
                    }
                });
            },
            /**清除时间日期*/
            delDate: function (_this) {
                $(_this.gCoupons.inpdate).on("click", function () {
                    Util.delDate($(this));
                });
            },
            //取消事件
            cancelTab: function (_this) {
                $(_this.gCoupons.btnCancel).on('click', function () {
                    var i=$(this).parents("#"+_this.gCoupons.href).index();
                    _this.delTab(i,true,_this.gCoupons.href);
                })
            },
            //绑定删除面板事件
            delTab: function (i,bool,href) {
                var tabs_li=this.tabs.find('li'),
                    panel=this.tabCom.find("#"+href);
                tabs_li.eq(i).remove();
                this.hideCon.append(panel);
                if(bool){
                    //页面数据清空
                    var con = $(this.gCoupons.formCps);
                    con.find(":text").each(function () {
                        $(this).val("");
                    });
                    $("#"+this.gCoupons.inpqua).val("")
                    con.find(this.gCoupons.selCkid).val("");

                    this.tabs.find('li').eq(0).addClass("active");
                    this.tabCom.find('.tab-pane').eq(0).addClass("active");
                }
            },
            //添加活动编号输入框
            inpAddssid: function(_this){
                $(_this.gCoupons.addSSid).on("click", function () {
                    $(_this.gCoupons.inpSsid).append($("#addCon").html());
                    _this.inpDelssid(_this);
                });
            },
            //删除活动编号输入框
            inpDelssid: function(_this){
                $(_this.gCoupons.delSSid).on("click", function () {
                   $(this).parents('.form-group').remove();
                });
            },
            //生成优惠劵
            sureToSubmit:function(_this){
                $(_this.gCoupons.btnCps).on("click", function () {
                    var con = $(_this.gCoupons.formCps);
                    var d = _this.searchVild();
                    _this.inputVal(_this,con, d);
                    if(_this.bool) {
                        Poss.ajaxBack(Poss.baseUrl("/marketing/coupons"), "POST", Poss.isJson(d), this.user, function (data, xhr) {
                            if (data.status == 0) {
                                Poss.isDeBug("生成优惠劵成功，批次号：" + data.data.couponCreate.batchNo, 1);
                            } else {
                                Poss.isDeBug(data.data.message, 1);
                            }
                        });
                    }
                });
            },
            //校验参数列表
            inputVal: function (_this,$con,date) {
                var ckid= $con.find(_this.gCoupons.selCkid).val();
                $con.find(":text").each(function () {
                    if($(this).val()==''){
                        if(!$(this).parents(_this.gCoupons.inpSsid).is(":hidden")){
                            _this.bool=false;
                            $(this).parents('.form-group').addClass("has-error");
                        }
                    }else{
                        _this.bool=true;
                        $(this).parents('.form-group').removeClass("has-error");
                        date[$(this).attr("data-name")]=$(this).val();
                    }
                });
                if($("#"+_this.gCoupons.inpqua).val()<=0){
                    _this.bool=false;
                    $("#"+_this.gCoupons.inpqua).parents('.form-group').addClass("has-error");
                }else{
                    _this.bool=true;
                    $("#"+_this.gCoupons.inpqua).parents('.form-group').removeClass("has-error");
                }
                if(ckid=="请选择优惠劵名称"||ckid=="undefined"|| ckid==""){
                    _this.bool=false;
                    $con.find(_this.gCoupons.selCkid).parents('.form-group').addClass("has-error");

                }else{
                    _this.bool=true;
                    $con.find(_this.gCoupons.selCkid).parents('.form-group').removeClass("has-error");
                }
            },
            //获取参数列表
            searchVild: function (callback) {
                var date={},
                    activity_id=new Array($(".apply-ssid input").size);
                $(".apply-ssid input").each(function (i) {
                    if($(this).val()!=null){
                        activity_id[i]= $(this).val();
                    }
                });
                this.user.find(":text").each(function () {
                    if ($(this).val() != '') {
                        date[$(this).attr("data-name")] = $(this).val();
                    }
                });
                date["activity_id"]=activity_id;
                Poss.selectVal(this.user, date);
                return date;
            }
        });
        var s=null;
        return {
            init: function () {
                if(s!=null){
                    s.layout();
                }else{
                    s=new search();
                }
            }
        };
    }
)