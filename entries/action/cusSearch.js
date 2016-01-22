require(
    ['jQuery','entries/service/custom/cusSearch','entries/service/public'],
    function ($, Search,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Search.init();
            });
        })
    }
)