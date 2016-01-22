require(
    ['jQuery','entries/service/domain/domain-mgnt', 'fueluxLoader', 'bootstrapSwitch', 'parsley', 'gritter', 'entries/service/public'],
    function ($, domainMg, fueluxLoader, bootstrapSwitch, parsley, gritter,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                domainMg.init()
            });
        })
    }
)