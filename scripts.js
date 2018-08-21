"use strict";

$(document).ready(function() {

    /**
     * Action: добавление нового скрипта
     */
    $("#addScript").click(function(e) {
        var addingScreen = $("#addingScript");
        addingScreen.addClass("active");
    });

    /**
     * Action: правка скрипта
     */
    $(".scripts-list_item .title").click(function(e) {
        var addingScreen = $("#addingScript");
        addingScreen.addClass("active");
    });

    /**
     * Action: закрытие окна редактирования
     */
    $("#addingScriptClose").click(function(e) {
        var addingScreen = $("#addingScript");
        addingScreen.removeClass("active");
    });

    /**
     * Action: сохранение
     */
    $("#addingScriptSave").click(function(e) {
        var addingScreen = $("#addingScript");
        addingScreen.removeClass("active");

        var code = addingScreen.find("textarea");

        // chrome.storage.synk.set({'', code});

    });








    // // подключение js-файла
    // function includeJs(code) {
    //     var scriptEl = document.createElement('script');
    //     scriptEl.innerHTML = code;
    //     document.getElementsByTagName('head')[0].appendChild(scriptEl);
    // }




    //  // кнопка добавления скрипта
   //  $('#add_script').click(function(e) {
   //      chrome.storage.sync.set({'value': 'text'}, function() {
   //        alert('Settings saved');
   //      });
   //
   // });



});