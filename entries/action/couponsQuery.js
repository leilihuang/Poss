require(
    ['jQuery','entries/service/marke/couponsQuery'],
    function ($, couponsQuery) {
        $(function () {
            couponsQuery.init()
        })
    }
)
