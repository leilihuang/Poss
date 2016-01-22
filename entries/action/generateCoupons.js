require(
    ['jQuery','entries/service/marke/generateCoupons','entries/service/public'],
    function ($, Edit,Pulic) {
        $(function () {

            Pulic.tokenUser(function () {
                Edit.init();
            });
        })
    }
)