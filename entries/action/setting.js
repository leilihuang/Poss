require(
    ['jQuery','entries/service/rabbit/setting','entries/service/public'],
    function ($, Setting,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Setting.init();
            });
        })
    }
)