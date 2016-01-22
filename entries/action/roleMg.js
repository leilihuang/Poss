require(
    ['jQuery','entries/service/user/roleMg','entries/service/public'],
    function ($, roleMg,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                roleMg.init()
            });
        })
    }
)