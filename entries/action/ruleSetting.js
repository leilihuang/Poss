require(
    ['jQuery', 'entries/service/fullreturn/ruleSetting', 'entries/service/public'],
    function ($, Detail, Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Detail.init()
            });
        })
    }
)