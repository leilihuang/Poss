require(
    ['jQuery','entries/service/user/userMg','entries/service/public'],
    function ($, userMg,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                userMg.init()
            });
        })
    }
)