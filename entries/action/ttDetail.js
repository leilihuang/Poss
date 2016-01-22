require(
    ['jQuery','entries/service/rabbit/ttDetail','entries/service/public'],
    function ($, Detail,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Detail.init();
            });
        })
    }
)