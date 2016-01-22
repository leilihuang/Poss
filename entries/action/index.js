require(
    ['jQuery','entries/service/index/index','entries/util/Tip','entries/service/public'],
    function ($,Index,Tip,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                new Index();
                Tip.init();
            });
        })
    }
)