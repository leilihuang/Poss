require(
    ['jQuery','entries/service/rabbit/Exchange','entries/service/public'],
    function ($, Exchange,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Exchange.init();
            });
        })
    }
)