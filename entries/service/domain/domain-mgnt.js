define(
    ['jQuery','entries/lib/ui/class','template'],
    function ($,Class,template) {

        var moduleId = 'domain-mgnt';
        var pageHeaderName = '域管理';

        var pageCount =10;

        var domainOnProcess;
        var domainList;

        var filterParam = {
            name: '',
            code: '',
            status: ''
        };

        var pageContentListClass = '.pageContentList';
        var pageContentCreateClass = '.pageContentCreate';

        var tpltMainUrl = 'tpl/' + moduleId + '/main.html';
        var tpltMainId = 'tpl-' + moduleId + '-main';
        var tpltListUrl = 'tpl/' + moduleId + '/list.html';
        var tpltListId = 'tpl-' + moduleId + '-list';
        var tpltCreateUrl = 'tpl/' + moduleId + '/create.html';
        var tpltCreateId = 'tpl-' + moduleId + '-create';
        var tpltUpdateUrl = 'tpl/' + moduleId + '/update.html';
        var tpltUpdateId = 'tpl-' + moduleId + '-update';

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
                            this.findDomains
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

                        $(".dropdown-toggle").dropdown();

                        // bind events
                        _this.pageContent.find('.domain-create-btn').click(function() {
                            _this.forwardToCreate.apply(_this, [ _this.listResources ]);
                        });

                        _this.pageContent.find('#domain-delete-warning-modal .domain-delete-submit-btn').click(function() {
                            if (domainOnProcess) {
                                _this.deleteDomain(function() {
                                    $('#domain-delete-warning-modal').modal('hide');
                                    _this.findDomains();
                                });
                            }

                        });


                        $pageContent.find('input[name=filter-param-name]').blur(function() {
                            if ($pageContent.find('input[name=filter-param-name]').val() == filterParam.name) {

                            } else {
                                filterParam.name = $pageContent.find('input[name=filter-param-name]').val();
                                _this.findDomains()
                            }
                        });
                        $pageContent.find('input[name=filter-param-code]').blur(function() {
                            if ($pageContent.find('input[name=filter-param-code]').val() == filterParam.code) {

                            } else {
                                filterParam.code = $pageContent.find('input[name=filter-param-code]').val();
                                _this.findDomains()
                            }
                        });
                        $pageContent.find('select[name=filter-param-status]').change(function() {

                            filterParam.status = $pageContent.find('select[name=filter-param-status]').val();
                            _this.findDomains()

                        });

                        $pageContent.find('.domain-filter-param-reset-btn').click(function() {

                            filterParam.name = $pageContent.find('input[name=filter-param-name]').val('');
                            filterParam.code = $pageContent.find('input[name=filter-param-code]').val('');
                            filterParam.status = $pageContent.find('select[name=filter-param-status]').val('');
                            filterParam.name = '';
                            filterParam.code = '';
                            filterParam.status = '';
                            _this.findDomains()

                        });


                        if(callback) {
                            callback.apply(_this);
                        }

                    });

                }

            },

            /**
             *
             */
            forwardToCreate: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                $pageContent.find('>div').css('display', 'none');

                if ($pageContent.find(pageContentCreateClass).length) {
                    // remove resources list
                    $pageContent.find(pageContentCreateClass).find('.domain-create-resource-list').empty();

                    $pageContent.find(pageContentCreateClass).css('display', 'block');

                    $pageContent.find(pageContentCreateClass).find('[parsley-validate], [data-parsley-validate]')[0].reset();

                    if (callback) {
                        callback.apply(_this);
                    }

                } else {
                    // display loading awesome
                    $pageContent.find('.load-awesome').css('display', 'block');

                    // load template
                    var $div=$('<div></div>');
                    $('body').append($div);
                    $div.load(tpltCreateUrl, function () {

                        $pageContent.find('.load-awesome').css('display', 'none');

                        var h = template(tpltCreateId ,{});
                        _this.pageContent.append(h);

                        _this.pageContent.find('[parsley-validate], [data-parsley-validate]').each( function () {
                            $( this ).parsley();
                        } );

                        // bind events
                        _this.pageContent.find('.domain-create-cancel-btn').click(function(e) {
                            e.preventDefault();
                            _this.forwardToList.apply(_this);
                        });
                        _this.pageContent.find('.domain-create-submit-btn').click(function(e) {
                            e.preventDefault();
                            _this.createDomains.apply(_this);
                        });

                        if (callback) {
                            callback.apply(_this);
                        }
                    });

                }

            },

            /**
             *
             */
            forwardToUpdate: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                var $pageContentUpdate = $pageContent.find('.pageContentUpdate');
                $pageContent.find('>div').css('display', 'none');

                if ($pageContentUpdate.length) {
                    // remove resources list
                    $pageContentUpdate.find('.domain-update-resource-list').empty();

                    $pageContentUpdate.find('input[name=code]').val(domainOnProcess.code);
                    $pageContentUpdate.find('input[name=name]').val(domainOnProcess.name);
                    $pageContentUpdate.find('textarea[name=remark]').val(domainOnProcess.remark);
                    $pageContentUpdate.find('select[name=status]').val(domainOnProcess.status);

                    $pageContentUpdate.css('display', 'block');

                    if (callback) {
                        callback.apply(_this);
                    }

                } else {
                    // display loading awesome
                    $pageContent.find('.load-awesome').css('display', 'block');

                    // load template
                    var $div=$('<div></div>');
                    $('body').append($div);
                    $div.load(tpltUpdateUrl, function () {

                        $pageContent.find('.load-awesome').css('display', 'none');

                        var h = template(tpltUpdateId ,{
                            domain: domainOnProcess
                        });
                        _this.pageContent.append(h);

                        _this.pageContent.find('[parsley-validate], [data-parsley-validate]').each( function () {
                            $( this ).parsley();
                        } );

                        // bind events
                        _this.pageContent.find('.domain-update-cancel-btn').click(function(e) {
                            e.preventDefault();
                            _this.forwardToList.apply(_this);
                        });
                        _this.pageContent.find('.domain-update-submit-btn').click(function(e) {
                            e.preventDefault();
                            _this.updateDomains.apply(_this);
                        });

                        if (callback) {
                            callback.apply(_this);
                        }
                    });

                }

            },

            deleteDomain: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                if (!domainOnProcess) {
                    return;
                }

                var domainId = domainOnProcess.id;

                Poss.ajaxBack(
                    Poss.logUrl('/system/domains/' + domainId),
                    'DELETE',
                    null,
                    moduleId,
                    function(result, xhr) {

                        if(result && result.status == 0) {
                            if(callback) {
                                callback.apply(this);
                            }
                        } else {

                            $.gritter.add({
                                title: '异常',
                                text: result.data.message,
                                class_name: 'danger'
                            });

                        }

                    }
                );

            },

            /**
             * 查询列表
             *
             * @param callback
             */
            findDomains: function(lastCursor, callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                var $domainListArea = $pageContent.find('.domain-list');
                if (!$domainListArea) {
                    return;
                }


                Poss.ajaxBack(
                    Poss.logUrl('/system/domains'),
                    'GET',
                    {
                        name: $pageContent.find('input[name=filter-param-name]').val() ? $pageContent.find('input[name=filter-param-name]').val() : null,
                        code:  $pageContent.find('input[name=filter-param-code]').val() ? $pageContent.find('input[name=filter-param-code]').val() : null,
                        status:  $pageContent.find('select[name=filter-param-status]').val() ? $pageContent.find('select[name=filter-param-status]').val() : null,
                        last_cursor: lastCursor,
                        count: pageCount
                    },
                    moduleId,
                    function(result, xhr) {

                        if(result && result.status == 0) {

                            domainList = result.data;
                            var h = template('tpl-domain-mgnt-list-area' ,{
                                list: result.data
                            });

                            $domainListArea.empty();

                            $domainListArea.append(h);

                            $domainListArea.find('.domain-delete-btn').each(function() {
                                $(this).click(function() {
                                    var domainId = $(this).attr('data-domain-id');
                                    $.each(domainList, function(i, domain) {
                                        if (domain.id == domainId) {
                                            domainOnProcess = domain;
                                        }
                                    });

                                    $('#domain-delete-warning-modal').find('.domain-name').text(domainOnProcess.name);
                                    $('#domain-delete-warning-modal').find('.domain-code').text(domainOnProcess.code);

                                    $('#domain-delete-warning-modal').modal('show')
                                });
                            });

                            $domainListArea.find('.domain-edit-btn').each(function() {
                                $(this).click(function() {
                                    var domainId = $(this).attr('data-domain-id');

                                    for (var i = 0; i < domainList.length; i++) {
                                        if (domainList[i].id == domainId) {
                                            domainOnProcess = domainList[i];
                                            break;
                                        }
                                    }
                                    _this.forwardToUpdate(_this.listUpdateResources);

                                });
                            });

                            _this.updatePageBar(lastCursor,xhr.getResponseHeader("X-Total-Count"));


                        } else {

                            $.gritter.add({
                                title: '异常',
                                text: result.data.message,
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
                    _this.findDomains(firstPageCursor);
                });

                $lastPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findDomains(lastPageCursor);
                });

                $prevPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findDomains(prevPageCursor);
                });

                $nextPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findDomains(nextPageCursor);
                });

                $refreshPageBtn.text((page + 1) + ' / ' + (lastPage + 1));
                $refreshPageBtn.unbind('click').click(function() {
                    $.each(btnArry, function(i, $btn) {
                        $btn.attr('disabled', 'true');
                    });
                    _this.findDomains(cursor);
                });

                $.each(btnArry, function(i, $btn) {
                    $btn.removeAttr("disabled");
                });

            },

            /**
             *
             *
             * @param callback
             */
            createDomains: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                var $pageContentCreate = $pageContent.find('.pageContentCreate');
                var $form = $pageContentCreate.find('[parsley-validate]');
                if (!$form.parsley().validate()) {
                    return;
                }

                // collect form datas
                var domainData = {
                    code: $pageContentCreate.find('input[name=code]').val(),
                    name: $pageContentCreate.find('input[name=name]').val(),
                    remark: $pageContentCreate.find('textarea[name=remark]').val(),
                    resources: function() {
                        var resources = [];
                        $pageContentCreate.find('input[name=resourceIds]').each(function(i, d) {
                            if (d.checked) {
                                resources[resources.length] = {
                                    id: d.value
                                }
                            }

                        });
                        return resources;
                    }()
                };


                // create domain
                Poss.ajaxBack(
                    Poss.logUrl('/system/domains'),
                    'POST',
                    Poss.isJson(domainData),
                    moduleId,
                    function(result) {

                        if(result && result.status == 0) {

                            $.gritter.add({
                                title: 'Success',
                                text: '创建成功.',
                                class_name: 'success'
                            });

                            _this.forwardToList(
                                _this.findDomains
                            )

                        } else {
                            $.gritter.add({
                                title: '异常',
                                text: result.data.message,
                                class_name: 'danger'
                            });

                        }

                    }
                );

            },

            /**
             *
             *
             * @param callback
             */
            updateDomains: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;
                var $pageContentUpdate = $pageContent.find('.pageContentUpdate');
                var $form = $pageContentUpdate.find('[parsley-validate]');
                if (!$form.parsley().validate()) {
                    return;
                }

                // collect form datas
                var domainData = {
                    code: $pageContentUpdate.find('input[name=code]').val(),
                    name: $pageContentUpdate.find('input[name=name]').val(),
                    remark: $pageContentUpdate.find('textarea[name=remark]').val(),
                    status: $pageContentUpdate.find('select[name=status]').val(),
                    resources: function() {
                        var resources = [];
                        $pageContentUpdate.find('input[name=resourceIds]').each(function(i, d) {
                            if (d.checked) {
                                resources[resources.length] = {
                                    id: d.value
                                }
                            }

                        });
                        return resources;
                    }()
                };


                // create domain
                Poss.ajaxBack(
                    Poss.logUrl('/system/domains/' + domainOnProcess.id),
                    'PUT',
                    Poss.isJson(domainData),
                    moduleId,
                    function(result) {

                        if(result && result.status == 0) {

                            domainOnProcess = result.data;
                            for (var i = 0; i < domainList.length; i++) {
                                if (domainList[i].id == domainOnProcess.id) {
                                    domainList[i] = domainOnProcess;
                                    break;
                                }
                            }

                            $.gritter.add({
                                title: 'Success',
                                text: '更新成功.',
                                class_name: 'success'
                            });

                            _this.forwardToList(
                                _this.findDomains
                            )

                        } else {

                            $.gritter.add({
                                title: '异常',
                                text: result.data.message,
                                class_name: 'danger'
                            });

                        }

                    }
                );

            },

            /**
             *
             */
            listResources: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;

                Poss.ajaxBack(
                    Poss.logUrl('/system/resources'),
                    'GET',
                    null,
                    moduleId,
                    function(result) {

                        if(result && result.status == 0) {

                            var normalResources = [];
                            $.each(result.data, function(i, entry) {
                                if (entry.type == '1') {
                                    normalResources.push(entry);
                                }
                            });
                            var h = template('tpl-domain-mgnt-create-resource' ,{
                                list: normalResources
                            });

                            $pageContent.find(pageContentCreateClass).find('.domain-create-resource-list').append(h);
                            $('.switch').bootstrapSwitch();

                        } else {

                            $.gritter.add({
                                title: '异常',
                                text: result.data.message,
                                class_name: 'danger'
                            });

                        }

                    }
                );

            },

            /**
             *
             */
            listUpdateResources: function(callback) {

                var _this = this;
                var $pageContent = _this.pageContent;

                Poss.ajaxBack(
                    Poss.logUrl('/system/resources'),
                    'GET',
                    null,
                    moduleId,
                    function(result) {

                        if(result && result.status == 0) {

                            var normalResources = [];
                            $.each(result.data, function(i, entry) {
                                if (entry.type == '1') {
                                    normalResources.push(entry);
                                }
                            });

                            $.each(normalResources, function(i, resource) {
                                var isAssigned = false;
                                for (var i2 = 0; i2 < domainOnProcess.resources.length; i2++) {
                                    if (domainOnProcess.resources[i2].id == resource.id) {
                                        isAssigned = true;
                                        break;
                                    }
                                }
                                if (isAssigned) {
                                    resource.isAssigned = '1';
                                }
                            });

                            var h = template('tpl-domain-mgnt-update-resource' ,{
                                list: normalResources
                            });


                            $pageContent.find('.pageContentUpdate').find('.domain-update-resource-list').append(h);
                            $('.switch').bootstrapSwitch();

                        } else {

                            $.gritter.add({
                                title: '异常',
                                text: result.data.message,
                                class_name: 'danger'
                            });

                        }

                    }
                );

            },

            /**
             * a loading animation
             *
             * @returns {*|jQuery|HTMLElement}
             */
            loadAwesome: function() {
                return $('');
            }

        });
        var s=null;
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