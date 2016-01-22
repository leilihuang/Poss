require(
    ['jQuery','entries/service/marke/couponsQuery','entries/service/public'],
    function ($, couponsQuery,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                couponsQuery.init()
            });
        })
    }
)
