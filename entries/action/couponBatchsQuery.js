require(
    ['jQuery','entries/service/marke/couponBatchsQuery'],
    function ($, couponBatchsQuery) {
        $(function () {
            couponBatchsQuery.init()
        })
    }
)
