require.config({
    paths: {
        'jquery': ['http://apps.bdimg.com/libs/jquery/2.0.0/jquery.min']
    }
});
require(['jquery'], function ($) {
    var bak=document.title;
    $.each($('#container').children(), function (k, v) {
        var ac = $(v);
        var name = ac.attr("name");
        if ("#" + name == location.hash) {
            ac.show();
            var title=bak+"："+name;
            $('.title').html(title);
            document.title = title;
        } else {
            ac.hide();
        }
    });
});