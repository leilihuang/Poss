var Util={
    tabBind: function ($tabs,cur) {
        if(cur){

        }else{
            cur="cur";
        }
        var _this=this;
        $tabs.each(function () {
            $(this).on("click", function () {
                var id=$(this).attr("name");
                if(!$(this).hasClass(cur)){

                    var _id=$(this).siblings("."+cur).removeClass(cur).attr("name");
                    _this.hide(_id);
                    $(this).addClass(cur);
                    _this.show(id);
                }
            })
        })
    },
    show:function(id){
        $("#"+id).show();
    },
    hide: function (id) {
        $("#"+id).hide();
    },
    swipeTab: function ($container,slider_trig,pageCur) {
        var swiper = new Swipe($container, {
            startSlide: 0,
            speed: 500,
            auto: 3000,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            transitionEnd: function(index, elem) {
                slider_trig.removeClass(pageCur).eq(index).addClass(pageCur);
            }
        });
    }
}