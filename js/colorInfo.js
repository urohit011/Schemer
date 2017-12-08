$(function(window, document, $) {
    
    const {ipcRenderer} = require('electron');

    var $close = $('.close');

    $close.click(function(e) {
        ipcRenderer.send('close-color-window');
    }) 

    ipcRenderer.send('color-window-loaded');

    ipcRenderer.on('color-data', (event, color_data) => {

        var i = 0;
        $('body').css('background', color_data['background']);
        $('.theme-name').css('color', color_data['foreground']);
        $('.theme-name').text(color_data['name']);
        $('.palette').each(function() {
            $(this).css('background', color_data['color'][i++]);
        });

    });

}(window, document, jQuery));
