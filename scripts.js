"use strict";

$(document).ready(function() {
    fillList();
    fillTags();
    // filterListItems();

    /**
     * Кнопка "Добавить скрипт (+)"
     */
    $("#addScript").click(function(e) {
        actionAddNewScript();
    });

    /**
     * Кнопка: "Закрытие окно редактирования" (x)
     */
    $("#addingScriptClose").click(function(e) {
        actionCloseScreenAdding();
    });

    /**
     * Кнопка: "Сохранить"
     */
    $("#addingScriptSave").click(function(e) {
        actionSaveScript();
    });


    /**
     * Action: добавление нового скрипта
     */
    function actionAddNewScript()
    {
        var addingScreen = $("#addingScript");

        addingScreen.addClass("active");
        addingScreen.find('#scriptName').val('');
        addingScreen.find('#scriptCode').val('');
        addingScreen.find('#scriptTag').val('');
    }

    /**
     * Action: закрытие окна со скриптом
     */
    function actionCloseScreenAdding()
    {
        var addingScreen = $("#addingScript");
        addingScreen.removeClass("active");
    }

    /**
     * Asction: сохранение скрипта
     */
    function actionSaveScript()
    {
        var addingScreen = $("#addingScript");

        var code = addingScreen.find("#scriptCode").val();
        var title = addingScreen.find("#scriptName").val();
        var tag = addingScreen.find("#scriptTag").val();
        var id = addingScreen.find("#scriptId").val();

        if (title.length === 0) {
            alert('Не указано название скрипта');
            return;
        }

        chrome.storage.sync.get('scripts', function (obj) {
            var scripts;

            if (obj.scripts != null) {
                scripts = obj.scripts;
            } else {
                scripts = {};
            }

            if (id.length === 0) {
                id = guid();
            }

            scripts[id] = {
                'name': title,
                'tag': prepareTag(tag),
                'code': code
            };

            chrome.storage.sync.set({'scripts': scripts});

            addingScreen.removeClass("active");
            var scriptsList = $("#scriptsList .list-container");
            scriptsList.empty();

            fillList();
        });
    }


    /**
     * Action: удаление скрипта
     * @param e
     */
    function actionDeleteScript(e)
    {
        var confirmDelete = confirm('Удалить скрипт?');
        if (!confirmDelete) {
           return;
        }

        chrome.storage.sync.get('scripts', function (obj) {
            var scripts;

            if (obj.scripts != null) {
                scripts = obj.scripts;
            } else {
                alert('Ошибка! Скрипт не найден..');
                return;
            }

            var id = e.target.parentNode.getAttribute('data-id');

            if (scripts[id] === null) {
                alert('Ошибка! Скрипт не найден..');
            }

            delete scripts[id];

            chrome.storage.sync.set({'scripts': scripts});

            var scriptsList = $("#scriptsList .list-container");
            scriptsList.empty();

            fillList();
        });
    }

    /**
     * Переход к редактированию скрипта
     */
    function actionToEditScript(e)
    {
        var addingScreen = $("#addingScript");

        chrome.storage.sync.get('scripts', function (obj) {
            var scripts;

            if (obj.scripts != null) {
                scripts = obj.scripts;
            } else {
                alert('Ошибка! Скрипт не найден..');
                return;
            }

            var id = e.target.parentNode.getAttribute('data-id');

            if (scripts[id] === null) {
                alert('Ошибка! Скрипт не найден..');
            }

            var script = scripts[id];

            addingScreen.find('#scriptName').val(script.name);
            addingScreen.find('#scriptCode').val(script.code);
            addingScreen.find('#scriptTag').val(script.tag);
            addingScreen.find('#scriptId').val(id);

            addingScreen.addClass("active");
        });

    }


    /**
     * Наполнение списка
     */
    function fillList()
    {
        chrome.storage.sync.get('scripts', function (obj) {
            var scripts;

            if (obj.scripts != null) {
                scripts = obj.scripts;
            } else {
                scripts = {};
            }

            var scriptsList = $("#scriptsList #listContainer");
            scriptsList.empty();

            for (var key in scripts) {
                var element = $('<div class="scripts-list_item">' +
                    '<span class="title">' + scripts[key].name + '</span>' +
                    '<span class="delete"></span>' +
                    '</div>');

                element.attr('data-tag', scripts[key]['tag']);
                element.attr('data-id', key);

                scriptsList.append(element);
            }

            registerItemListActions();
        });
    }

    /**
     * Наполнение блока с тегами
     */
    function fillTags()
    {
        chrome.storage.sync.get('scripts', function (obj) {
            var scripts;

            if (obj.scripts != null) {
                scripts = obj.scripts;
            } else {
                scripts = {};
            }

            var tags = [];
            for (var key in scripts) {
                if (scripts[key].tag !== null && scripts[key].tag !== '' && tags.indexOf(scripts[key].tag) === -1) {
                    tags[scripts[key].tag] = scripts[key].tag;
                }
            }

            var divTagsList = $('#mainContainer #tagsList');
            divTagsList.empty();
            for (var tag in tags) {
                divTagsList.append('<span class="tag" data-tag="' + tag + '">' + tag + '</span>');
            }

            registerItemListTags();
        });
    }


    /**
     * Регистрация функций связанных с элементами списка
     */
    function registerItemListActions()
    {
        /**
         * Кнопка: правка элемента
         */
        $("#listContainer .scripts-list_item .title").on('dblclick', function(e) {
            actionToEditScript(e);
        });

        /**
         * Action: удаление элемента
         */
        $("#listContainer .scripts-list_item .delete").click(function(e) {
            actionDeleteScript(e);
        }) ;
    }

    function registerItemListTags()
    {
        /**
         * Клик по тегу
         */
        $("#scriptsList #tagsList .tag").on('click', function(e) {
            activationTag(e);
            filterListItems();
        });
    }

    /**
     * Фильтрация элементов по активным тегам
     */
    function filterListItems() {
        var activeTag = $('#tagsList .active');

        var listItems = $('#listContainer .scripts-list_item');
        if (listItems.length === 0) {
            return;
        }

        if (activeTag.length === 0) {
            listItems.each(function(ind, element) {
                element.classList.remove('hide');
            });
        } else {
            listItems.each(function(ind, element) {
                if (element.getAttribute('data-tag') !== activeTag.attr('data-tag')) {
                    element.classList.add('hide');
                } else {
                    element.classList.remove('hide');
                }

            });
        }
    }

    /**
     * Активация / деактивация тегов
     */
    function activationTag(e)
    {
        var tags = $('#tagsList .tag');

        var nowTagEl = $(e.target);
        var nowTagKey = nowTagEl.attr('data-tag');

        tags.each(function(ind, element) {
            if (nowTagKey === element.getAttribute('data-tag')) {
                if (nowTagEl.hasClass('active')) {
                    nowTagEl.removeClass('active');
                } else {
                    nowTagEl.addClass('active');
                }
            } else {
                if (element.classList.contains('active')) {
                    element.classList.remove('active');
                }
            }
        });
    }

    /**
     * Генерит guid
     * @returns {string}
     */
    function guid()
    {
        var s = [];
        var hexDigits = "0123456789ABCDEF";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01

        var guid = s.join("");
        return guid;
    }

    /**
     * Подготавливает тег
     *
     * @param tag
     * @returns {string}
     */
    function prepareTag(tag)
    {
        if (tag.length === 0) {
            return '';
        }

        tag = tag.toLowerCase().replace(' ', '');
        if (tag[0] !== '#') {
            tag = '#' + tag;
        }

        return tag;
    }

});