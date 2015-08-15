#jquery.easydialog

##概要

这是一个jQuery的插件，它可以让您轻松的创建对话框。

1. 支持多对话框同时存在
2. 支持拖动对话框
3. 支持自定义样式
4. 支持回调函数
5. 支持半透明遮罩层
6. 支持Esc键关闭窗口(所有窗口)
7. 夸浏览器，IE6+，FireFox，Google Chrome

##示例

http://demo.hpyer.cn/js/easydialog/

##使用

    <html>
    <head>
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
    <link rel="stylesheet" type="text/css" href="jquery.easydialog.css" />
    <script type="text/javascript" src="jquery.easydialog.js"></script>
    </head>
    <body>
    <script>
    $(document).ready(function() {
        $.easydialog({
            'title' : 'Title',
            'content' : 'Content'
        });
    });
    </script>
    </body>
    </html>
