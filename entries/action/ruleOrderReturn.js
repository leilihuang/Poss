require(
    ['jQuery','entries/service/fullreturn/ruleOrderReturn', 'entries/service/public'],
    function ($, Detail,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Detail.init()
            });
        })
    }
)