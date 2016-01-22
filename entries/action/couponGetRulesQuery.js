require(
    ['jQuery','entries/service/marke/couponGetRulesQuery','entries/service/public'],
    function ($, couponGetRulesQuery,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                couponGetRulesQuery.init()
            });
        })
    }
)
