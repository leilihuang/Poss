require(
    ['jQuery','entries/service/rabbit/proportion','entries/service/public'],
    function ($, Proportion,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Proportion.init();
            });
        })
    }
)