define(
    ['jQuery','gritter'],
    function ($) {
        var tip={
            init: function () {
                this.tipS();
                this.test();
            },
            tipS: function () {
                $('#not-primary').click(function(){
                    $.gritter.add({
                        title: 'Primary',
                        text: 'This is a simple Gritter Notification.',
                        class_name: 'primary'
                    });
                });

                $('#not-success').click(function(){
                    $.gritter.add({
                        title: '成功',
                        text: '加载成功',
                        class_name: 'success'
                    });
                });

                $('#not-info').click(function(){
                    $.gritter.add({
                        title: 'Info',
                        text: 'This is a simple Gritter Notification.',
                        class_name: 'info'
                    });
                });

                $('#not-warning').click(function(){
                    $.gritter.add({
                        title: 'Warning',
                        text: 'This is a simple Gritter Notification.',
                        class_name: 'warning'
                    });
                });

                $('#not-danger').click(function(){
                    $.gritter.add({
                        title: 'Danger',
                        text: 'This is a simple Gritter Notification.',
                        class_name: 'danger'
                    });
                });


                $('#not-dark').click(function(){
                    $.gritter.add({
                        title: 'Dark',
                        text: 'This is a simple Gritter Notification.',
                        class_name: 'dark'
                    });
                });
            },
            test: function () {
               var div="<div></div>";
                $(div).load("test.html", function () {
                    $("body").append(div);
                });
            }
        }
        return tip;
    }
)