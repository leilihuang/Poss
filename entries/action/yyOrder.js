require(
    ['jQuery','entries/service/order/yyOrder','entries/service/public'],
    function ($, Order,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Order.init()
            });
        })
    }
)