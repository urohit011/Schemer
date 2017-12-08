$(function(window, document, $){

    // required to execute shell commands
    var exec = require('child_process').execSync;
    const {ipcRenderer} = require('electron');
    // button to apply the colorscheme to gnome terminal
    var $btn = $('.apply');
    // Section that contains preview of the colorscheme
    var $content = $('.content');
    // hide the content before data for colorscheme is loaded
    $content.hide();
    
    $.ajax({

        type: 'GET',

        url: 'https://terminal.sexy/schemes/index.json',

        success: function(data){
            
            var $category;
            var $schemes;
            var classHighlight = 'active';
            var base_url = 'https://terminal.sexy/schemes/';
            var map = []; // holds schemes belonging to a category

            for(var item of data){
                var arr = item.split('/');
                if(map[arr[0]]){
                    map[arr[0]].push(arr[1]);
                }

                else{
                    map[arr[0]] = new Array();
                    map[arr[0]].push(arr[1]);
                }

            }

            for(var item in map){
                $('.categories').append('<li><a href=#>'+item+'</a></li>');
            }

            $category = $('.categories a');

            $category.click(function(e){

                e.preventDefault();
                $content.hide();
                $category.removeClass(classHighlight);
                $(this).addClass(classHighlight);
                var cat = $(this).text();
                $('.schemes').empty();
                for(var item of map[cat]){
                    $('.schemes').append('<li><a href=#>'+item+'</a></li>');
                }
                $schemes = $('.schemes a');

                $schemes.click(function(e) {

                    e.preventDefault();
                    $content.hide();
                    $schemes.removeClass(classHighlight);
                    $(this).addClass(classHighlight);
                    var col_scheme = $(this).text();
                    
                    $.ajax({
                        type: 'GET',
                        
                        url: base_url+cat+'/'+col_scheme+'.json',
                        
                        success: function(data){
                            $content.show();

                            var $preview = $('.preview');
                            
                            $preview.unbind("click").click(function(e) {
                                ipcRenderer.send('color-info', data);
                            });

                            // holds background color of the colorscheme
                            var bgcolor = data.background;
                            // holds foreground color of the colorscheme
                            var fgcolor = data.foreground;
                            // holds palettes of the colorscheme 
                            var palette_colors = data.color;

                            $('.preview').css('background', bgcolor);
                            $('.text').css('color', fgcolor);
                            $('.prompt').css('color', palette_colors[10]);
                            $('.folder').css('color', palette_colors[12]);
                            $('.multimedia').css('color', palette_colors[13]);
                            $('.tar').css('color', palette_colors[9]);

                            $btn.unbind("click").click(function(e){
                
                                e.preventDefault();
                                // get profile ID to which the colorscheme is applied
                                var terminal_id = $('.terminal_ID').val();
                                if(terminal_id === undefined){
                                    terminal_id = '';
                                }
                                if(!terminal_id.startsWith(':')){
                                    terminal_id = ':'+terminal_id;
                                }
                                if(!terminal_id.endsWith('/')){
                                    terminal_id += '/';
                                }
                                var write_cmd = "dconf write /org/gnome/terminal/legacy/profiles:/"+terminal_id;
                                var read_cmd = "dconf read /org/gnome/terminal/legacy/profiles:/"+terminal_id;
                                var is_system_theme_on = exec(read_cmd+"use-theme-colors").toString();

                                if(is_system_theme_on === "true\n"){
                                    exec(write_cmd+"use-theme-colors false");
                                }
                                
                                // change terminal's background color
                                exec(write_cmd+"background-color "+"\"\'"+bgcolor+"\'\"");
                                // change terminal's foreground/text color
                                exec(write_cmd+"foreground-color "+"\"\'"+fgcolor+"\'\"");
                                // change terminal's palette colors 
                                exec(write_cmd+"palette " + " \"["+
                                    "\'"+palette_colors[0]+"\',"+
                                    "\'"+palette_colors[1]+"\',"+
                                    "\'"+palette_colors[2]+"\',"+
                                    "\'"+palette_colors[3]+"\',"+
                                    "\'"+palette_colors[4]+"\',"+
                                    "\'"+palette_colors[5]+"\',"+
                                    "\'"+palette_colors[6]+"\',"+
                                    "\'"+palette_colors[7]+"\',"+
                                    "\'"+palette_colors[8]+"\',"+
                                    "\'"+palette_colors[9]+"\',"+
                                    "\'"+palette_colors[10]+"\',"+
                                    "\'"+palette_colors[11]+"\',"+
                                    "\'"+palette_colors[12]+"\',"+
                                    "\'"+palette_colors[13]+"\',"+
                                    "\'"+palette_colors[14]+"\',"+
                                    "\'"+palette_colors[15]+"\'"+
                                "]\"");
                            });

                        },
                        
                        error: function(){
                            alert("Sorry! Could not get the colorscheme.")    
                        }
                    })
                })

            })
            
        },

        error: function(err){

            alert("Sorry! Could not get the data");
            $('.container-fluid').hide();

        }
    });

}(window, document, jQuery));
