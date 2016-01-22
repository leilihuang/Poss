define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {

        var moduleId = 'system-log';
        var pageHeaderName = '系统日志';

        var pageCount =10;

        var logOnProcess;
        var logList;

        var filterParam = {
            domain_code: '',
            resource_id: '',
            request_uri: '',
            request_entity: '',
            start_time: '',
            end_time: ''
        };

        var pageContentListClass = '.pageContentList';

        var tpltMainUrl = 'tpl/' + moduleId + '/main.html';
        var tpltMainId = 'tpl-' + moduleId + '-main';
        var tpltListUrl = 'tpl/' + moduleId + '/list.html';
        var tpltListId = 'tpl-' + moduleId + '-list';

        var search=Class.create({
            setOptions: function (opts) {
                var options={
                    tabs:$("#nav_tabs"),
                    tabCom:$("#tab-content"),
                    pageContent: null
                };
                $.extend(true,this,options,opts);
            }
        },{
            init: function (opts) {
                this.setOptions(opts);

                // TODO: this should be add in the function when clicking menu
                this.tabCom.find(".active").removeClass('active');

                this.layout(function() {
                        this.forwardToList(
                            this.findLogs
                        )
                    }
                )
            },

            /**
             * load the main framework
             *
             * @param callBack
             */
            layout: function(callback) {

                var _this = this;

                var $div=$('<div></div>');
                $('body').append($div);
                $div.load(tpltMainUrl, function () {
                    var h=template(tpltMainId ,{
                        moduleId: moduleId,
                        pageHeaderName: pageHeaderName
                    });

                    _this.tabCom.append(h);
                    _this.pageContent = $('#' + moduleId + ' .page-content');

                    callback.apply(_this);
                });

            },

            /**
             * forward to list page
             *
             * @param callBack
             */
            forwardToList: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;

                $pageContent.find('>div').css('display', 'none');

                if ($pageContent.find(pageContentListClass).length) {
                    $pageContent.find(pageContentListClass).css('display', 'block');
                    if(callback) {
                        callback.apply(_this);
                    }
                } else {
                    // diaplay loading awesome
                    $pageContent.find('.load-awesome').css('display', 'block');

                    // load template
                    var $div=$('<div></div>');
                    $('body').append($div);
                    $div.load(tpltListUrl, function () {

                        $pageContent.find('.load-awesome').css('display', 'none');
                        var h=template(tpltListId ,{

                        });
                        _this.pageContent.append(h);
                        Poss.dateTime();

                        $(".dropdown-toggle").dropdown();

                        // bind events
                        $pageContent.find('input[name=filter-param-domain-code]').blur(function() {
                            if ($pageContent.find('input[name=filter-param-domain-code]').val() == filterParam.domain_code) {

                            } else {
                                filterParam.domain_code = $pageContent.find('input[name=filter-param-domain-code]').val();
                                _this.findLogs()
                            }
                        });

                        $pageContent.find('input[name=filter-param-resource-id]').blur(function() {
                            if ($pageContent.find('input[name=filter-param-resource-id]').val() == filterParam.resource_id) {

                            } else {
                                filterParam.resource_id = $pageContent.find('input[name=filter-param-resource-id]').val();
                                _this.findLogs()
                            }
                        });

                        $pageContent.find('input[name=filter-param-request-uri]').blur(function() {
                            if ($pageContent.find('input[name=filter-param-request-uri]').val() == filterParam.request_uri) {

                            } else {
                                filterParam.request_uri = $pageContent.find('input[name=filter-param-request-uri]').val();
                                _this.findLogs()
                            }
                        });

                        $pageContent.find('input[name=filter-param-request-entity]').blur(function() {
                            if ($pageContent.find('input[name=filter-param-request-entity]').val() == filterParam.request_entity) {

                            } else {
                                filterParam.request_entity = $pageContent.find('input[name=filter-param-request-entity]').val();
                                _this.findLogs()
                            }
                        });

                        $pageContent.find('input[name=filter-param-start-time]').change(function() {
                            if ($pageContent.find('input[name=filter-param-start-time]').val() == filterParam.start_time) {

                            } else {
                                filterParam.start_time = $pageContent.find('input[name=filter-param-start-time]').val();
                                _this.findLogs()
                            }
                        });

                        $pageContent.find('input[name=filter-param-end-time]').change(function() {
                            if ($pageContent.find('input[name=filter-param-end-time]').val() == filterParam.end_time) {

                            } else {
                                filterParam.end_time = $pageContent.find('input[name=filter-param-end-time]').val();
                                _this.findLogs()
                            }
                        });


                        $pageContent.find('.log-filter-param-reset-btn').click(function() {

                            $pageContent.find('input[name=filter-param-domain-code]').val('');
                            $pageContent.find('input[name=filter-param-resource-id]').val('');
                            $pageContent.find('input[name=filter-param-request-uri]').val('');
                            $pageContent.find('input[name=filter-param-request-entity]').val('');
                            $pageContent.find('input[name=filter-param-start-time]').val('');
                            $pageContent.find('input[name=filter-param-end-time]').val('');
                            filterParam.domain_code = '';
                            filterParam.resource_id = '';
                            filterParam.request_uri = '';
                            filterParam.request_entity = '';
                            filterParam.start_time = '';
                            filterParam.end_time = '';
                            _this.findLogs()

                        });


                        if(callback) {
                            callback.apply(_this);
                        }

                    });

                }

            },

            /**
             * 查询列表
             *
             * @param callback
             */
            findLogs: function(lastCursor, callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                var $logListArea = $pageContent.find('.log-list');
                if (!$logListArea) {
                    return;
                }

                Poss.ajaxBack(
                    Poss.logUrl('/system/logs'),
                    'GET',
                    {
                        domain_code: $pageContent.find('input[name=filter-param-domain-code]').val() ? $pageContent.find('input[name=filter-param-domain-code]').val() : null,
                        resource_id: $pageContent.find('input[name=filter-param-resource-id]').val() ? $pageContent.find('input[name=filter-param-resource-id]').val() : null,
                        request_uri: $pageContent.find('input[name=filter-param-request-uri]').val() ? $pageContent.find('input[name=filter-param-request-uri]').val() : null,
                        request_entity: $pageContent.find('input[name=filter-param-request-entity]').val() ? $pageContent.find('input[name=filter-param-request-entity]').val() : null,
                        start_time: $pageContent.find('input[name=filter-param-start-time]').val() ? $pageContent.find('input[name=filter-param-start-time]').val() : null,
                        end_time: $pageContent.find('input[name=filter-param-end-time]').val() ? $pageContent.find('input[name=filter-param-end-time]').val() : null,
                        last_cursor: lastCursor,
                        count: pageCount
                    },
                    moduleId,
                    function(result, xhr) {

                        if(result && result.status == 0) {

                            logList = result.data;
                            console.log(result.data);
                            var h = template('tpl-system-log-list-area' ,{
                                list: result.data
                            });

                            $logListArea.empty();
                            $logListArea.append(h);

                            $logListArea.find('.item').each(function() {

                                $(this).click(function() {

                                    var logId = $(this).attr('data-log-id');
                                    $.each(logList, function(i, log) {
                                        if (log.id == logId) {
                                            logOnProcess = log;
                                        }
                                    });

                                    console.log(logOnProcess);

                                    $('#log-detail-modal').find('.id').text(logOnProcess.id);
                                    $('#log-detail-modal').find('.operator_id').text(logOnProcess.operator.id);
                                    $('#log-detail-modal').find('.operator_login_name').text(logOnProcess.operator.login_name);
                                    $('#log-detail-modal').find('.operator_name').text(logOnProcess.operator.name);
                                    $('#log-detail-modal').find('.domain_id').text(logOnProcess.domain.id);
                                    $('#log-detail-modal').find('.domain_code').text(logOnProcess.domain.code);
                                    $('#log-detail-modal').find('.domain_name').text(logOnProcess.domain.name);
                                    $('#log-detail-modal').find('.resource_id').text(logOnProcess.resource.id);
                                    $('#log-detail-modal').find('.resource_verb').text(logOnProcess.resource.verb);
                                    $('#log-detail-modal').find('.resource_uri_pattern').text(logOnProcess.resource.uri_pattern);
                                    $('#log-detail-modal').find('.resource_name').text(logOnProcess.resource.name);
                                    $('#log-detail-modal').find('.request_uri').text(logOnProcess.request_uri);
                                    $('#log-detail-modal').find('.request_entity').text(logOnProcess.request_entity);
                                    $('#log-detail-modal').find('.ip').text(logOnProcess.ip);
                                    $('#log-detail-modal').find('.cost').text(logOnProcess.cost);
                                    $('#log-detail-modal').find('.create_time').text(logOnProcess.create_time);


                                    $('#log-detail-modal').modal('show');

                                    //alert('#' + $(this).attr('data-log-id'));
                                });


                            });


                            _this.updatePageBar(lastCursor,xhr.getResponseHeader("X-Total-Count"));


                        } else {

                            var responseData;
                            if (result.data.responseText) {
                                responseData = JSON.parse(result.data.responseText);
                            }
                            $.gritter.add({
                                title: '异常',
                                text: responseData.message,
                                class_name: 'danger'
                            });

                        }

                    }
                );

                // retrieve filter parameters (also with page & sort parameters)



            },

            updatePageBar: function(cursor, totalCount) {

                var _this = this;
                var $pageContent = _this.pageContent;
                var $pageBar = $pageContent.find('.page-bar');

                var $firstPageBtn = $pageBar.find('.page-first-btn');
                var $lastPageBtn = $pageBar.find('.page-last-btn');
                var $prevPageBtn = $pageBar.find('.page-prev-btn');
                var $nextPageBtn = $pageBar.find('.page-next-btn');
                var $refreshPageBtn = $pageBar.find('.page-refresh-btn');

                var btnArry = [
                    $firstPageBtn,
                    $lastPageBtn,
                    $prevPageBtn,
                    $nextPageBtn,
                    $refreshPageBtn
                ];




                if (!cursor || cursor < 0) {
                    cursor = 0;
                }

                var page = cursor / pageCount;
                var lastPage = (totalCount - totalCount % pageCount) / pageCount + (totalCount % pageCount > 0 ? 1 : 0) - 1;

                var firstPageCursor = 0;
                var lastPageCursor = lastPage * pageCount;
                var prevPageCursor = page - 1 > 0 ? (page - 1) * pageCount : 0;
                var nextPageCursor = (page + 1) > lastPage ? cursor : (page + 1) * pageCount;



                $firstPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findLogs(firstPageCursor);
                });

                $lastPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findLogs(lastPageCursor);
                });

                $prevPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findLogs(prevPageCursor);
                });

                $nextPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findLogs(nextPageCursor);
                });

                $refreshPageBtn.text((page + 1) + ' / ' + (lastPage + 1));
                $refreshPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findLogs(cursor);
                });

                $.each(btnArry, function(i, $btn) {
                    $btn.removeAttr("disabled");
                });

            }


        });
        var s=null;

        template.helper('syslogDateFormat', function (originalDate) {

            var result = '无法识别的日期格式';

            if (typeof originalDate === "string" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+0800/.test(originalDate)) {

                var yyyy = originalDate.substring(0, 4);
                var MM = originalDate.substring(5, 7);
                var dd = originalDate.substring(8, 10);

                var hh = originalDate.substring(11, 13);
                var mm = originalDate.substring(14, 16);
                var ss = originalDate.substring(17, 19);

                result = yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + dd;

            }

            return result;

        });


        return {
            init: function () {
                if(s!=null){
                    s.init();
                }else{
                    s=new search();
                }
            }
        };
    }
)