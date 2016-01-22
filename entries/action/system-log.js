require(
    ['jQuery','entries/service/syslog/system-log', 'gritter', 'model', 'entries/service/public'],
    function ($, syslog, gritter, model,Pulic) {
        $(function () {
            Pulic.tokenUser(function () {
                syslog.init()
            });
        })
    }
)