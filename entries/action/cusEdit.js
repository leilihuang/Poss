require(
    ['jQuery','entries/service/custom/cusEdit','entries/service/public'],
    function ($, Edit,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                Edit.init()
            });
        })
    }
)