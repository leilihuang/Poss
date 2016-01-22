require(
    ['jQuery','entries/service/marke/ckSearch','entries/service/public'],
    function ($, CkSearch,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                CkSearch.init();
            });
        })
    }
)