/**
 * jquery.easydialog.js
 * 这是一个jQuery的插件，它可以让您轻松的创建对话框。
 * 
 * -- REQUIRE: jQuery --
 * 
 * @author	Hpyer
 * @home	http://hpyer.cn
 * @version	1.0
 * @release	2015-08-15
 */

/*
USAGE:

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
*/

(function($) {
	$.easydialog = function(options) {
		var default_options = {
			'title' : '',
			'content' : '',
			'ok' : 'OK',
			'cancel' : '',
			'close' : 'Close',
			'custom' : '',
			'width' : '200px',
			'height' : '',
			'showMask' : true,
			'showHeader' : true,
			'showFooter' : true,
			'dragable' : true,
			'escToClose' : false,
			'onInit' : function(){},
			'onConfirm' : function(){},
			'onCancel' : function(){}
		};

		var EasyDialog = function() {
			this.obj = null;
			this.obj_mask = null;

			/**
			 * IE6兼容fixed
			 */
			this.setFixed = function() {
				self.obj.css({
					'position' : 'absolute',
					'left' : document.documentElement.scrollLeft + last_pos.left,
					'top' : document.documentElement.scrollTop + last_pos.top
				});
				if (self.obj_mask) self.obj_mask.css({
					'position' : 'absolute',
					'left' : document.documentElement.scrollLeft,
					'top' : document.documentElement.scrollTop
				});
			};

			/**
			 * 将对话框居中
			 */
			this.setCenter = function() {
				last_pos.left = ($(window).width() - self.obj.width()) / 2,
				last_pos.top = ($(window).height() - self.obj.height()) / 2;
				self.obj.css(last_pos);
			};

			/**
			 * 设置对话框可拖动
			 */
			this.setDragable = function() {
				var dragging = false;
				var iX, iY, dragger;
				dragger = self.obj;
				if (self.obj.find('.easydialog-header').size() != 0) dragger = self.obj.find('.easydialog-header');
				dragger.css('cursor', 'move').mousedown(function(e) {
					dragging = true;
					var win =  self.obj.get(0);
					iX = e.clientX - win.offsetLeft;
					iY = e.clientY - win.offsetTop;
					win.setCapture && win.setCapture();
					return false;
				});
				$(document).mousemove(function(e) {
					if (dragging) {
						var e = e || window.event;
						var oX = e.clientX - iX;
						var oY = e.clientY - iY;
						self.obj.css({left: oX, top: oY});
						last_pos = self.obj.position();
						last_pos.left -= document.documentElement.scrollLeft;
						last_pos.top -= document.documentElement.scrollTop;
						return false;
					}
				}).mouseup(function(e) {
					dragging = false;
					self.obj.get(0).releaseCapture();
					e.cancelBubble = true;
				});
			};

			/**
			 * 设置对话框可拖动
			 */
			this.setEscToClose = function() {
				$(document).bind('keydown', function(e) {
					var e = e || window.event;
					if (e.keyCode == 27) {
						self.close();
					}
				});
			};

			/**
			 * 确认按钮，并关闭对话框
			 */
			this.confirm = function() {
				if (typeof options.onConfirm == 'function') {
					if (options.onConfirm() === false) return;
				}
				self.close();
			};

			/**
			 * 取消按钮，并关闭对话框
			 */
			this.cancel = function() {
				if (typeof options.onCancel == 'function') {
					if (options.onCancel() === false) return;
				}
				self.close();
			};


			/**
			 * 关闭对话框
			 */
			this.close = function() {
				self.obj.hide().remove();
				if (self.obj_mask) {
					self.obj_mask.hide().remove();
				}
			};


			options = $.extend({}, default_options, options);
			var self = this, last_pos = {left: 0, top: 0};

			if (options.showMask) {
				this.obj_mask = $('<div class="easydialog-mask"></div>').css({
					margin: 0,
					padding: 0,
					border: 0,
					width: '100%',
					height: '100%',
					zIndex: 99999,
					position: 'fixed',
					top: 0,
					left: 0,
					display: 'block'
				});
				$(document.body).append(this.obj_mask);
			}

			var html = '';
			if (options.custom) {
				html = options.custom;
			} else {
				if (options.showHeader) html += '<div class="easydialog-header">\
					<a class="easydialog-close" title="'+options.close+'" href="javascript:;">x</a>\
				'+(options.title ? '<h3 class="easydialog-caption">'+options.title+'</h3>' : '')+'\
				</div>';
				html += '<div class="easydialog-content">'+options.content+'</div>';
				if (options.showFooter) html += '<div class="easydialog-footer">\
					'+(options.ok ? '<input type="button" class="easydialog-ok" value="'+options.ok+'" />' : '')+'\
					'+(options.cancel ? '<input type="button" class="easydialog-cancel" value="'+options.cancel+'" />' : '')+'\
				</div>';
			}

			this.obj = $('<div class="easydialog">' + html + '</div>');
			$(document.body).append(this.obj);
			var style = {
				'position': 'fixed',
				'zIndex': 100000,
				'display': 'block'
			};
			if (options.width) style.width = options.width;
			if (options.height) style.height = options.height;
			this.obj.css(style);

			this.setCenter();
			if ($.browser.msie && $.browser.version == '6.0') {
				this.setFixed();
				$(window).scroll(this.setFixed);
			}

			if (options.dragable) this.setDragable();
			if (options.escToClose) this.setEscToClose();
			this.obj.find('.easydialog-ok').bind('click', this.confirm);
			this.obj.find('.easydialog-cancel').bind('click', this.cancel);
			this.obj.find('.easydialog-close').bind('click', this.close);

			if (typeof options.onInit == 'function') options.onInit();

			return this;
		};

		return new EasyDialog();
	}

	/**
	 * 关闭所有窗口
	 */
	$.easydialog.closeAll = function() {
		$('.easydialog, .easydialog-mask').remove();
	};

})(jQuery);