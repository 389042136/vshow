var Vshow = {

    init: function () {
        if (!Diaspora.P()) {
            $.getScript('/js/canvas-nest.min.js');
            this.linkBlank();
        }
    },

    /**
     * a新窗口跳转
     */
    linkBlank: function () {
        $('.main .content a').each(function() {
			$(this).attr('target', '_blank');
		});
    }
}

Vshow.init();



