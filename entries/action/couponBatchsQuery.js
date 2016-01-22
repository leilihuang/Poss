require(
    ['jQuery','entries/service/marke/couponBatchsQuery','entries/service/public'],
    function ($, couponBatchsQuery,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                couponBatchsQuery.init()
            });
        })
    }
)
