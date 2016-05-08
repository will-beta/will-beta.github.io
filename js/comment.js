require.config({
    paths: {
        'jquery': ['http://apps.bdimg.com/libs/jquery/2.0.0/jquery.min']
    }
});
require(['jquery'], function ($) {
    //创建总容器
    var container = $('<div>').appendTo(document.body);

    //创建评论开关和评论区
    var ctl = $('<div>').appendTo(container);
    var board = $('<div>').appendTo(container).hide();
    ctl.append($('<a>').append($('<img>').attr('alt', '评论').attr('src', '/img/comment.png').attr('class', 'icon')));

    //创建评论组件容器
    var component = $('<div>')
        .appendTo(board)
        .attr('id', 'ds-thread')
        .attr('class', 'ds-thread')
        .attr('data-url', location.href)
        .attr('data-title', document.title)
        .attr('data-thread-key', document.title);

    //展开显示和自动滚动
    var scroll = function () {
        var node = container.parent();
        node.clearQueue().animate({
            scrollTop: node.prop("scrollHeight")
        }, 500);
    };
    ctl.on('click', function () {
        board.toggle('middle', function () {
            scroll();
            component
                .find('textarea')
                .on('click', scroll);
        });
    });

    //加载评论组件
    window.duoshuoQuery = {short_name: "will-beta"};
    $('<script>')
        .appendTo(board)
        .attr('async', 'async')
        .attr('defer', 'defer')
        .attr('src', 'http://static.duoshuo.com/embed.js');
});