import AlloyFinger from '../../static/js/alloy_finger.min.js';
export default (Vue) => {
    Vue.directive('imgReactive',{
        bind:function(el,binding,vnode){
        },
        inserted: function(el,binding,vnode){
            let imgParent = el.parentNode;
            let maxWidth = imgParent.offsetWidth;
            let maxHeight = imgParent.offsetHeight;
            let imgSrc = el.getAttribute('src');
            if(!imgSrc){
                return;
            }     
            //获取图片的原始高度
            let image = new Image();
            image.src = imgSrc;
            image.onload = function(){
                const width = image.naturalWidth;
                const height = image.naturalHeight;
                //第一种需求：当图片比图片框小时不做任何改变
                // if(width < maxWidth && height < maxHeight){
                //     el.style.width = maxWidth + 'px';
                //     el.style.height = maxWidth * height /width + 'px';
                // } else {
                // //原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放 
                //     if(width/height >= maxWidth/maxHeight){
                //         el.style.width = maxWidth + 'px';
                //         el.style.height = maxWidth * height /width + 'px';
                //     } else {
                //         el.style.width = maxHeight * width / height  + 'px';
                //         el.style.height = maxHeight + 'px';
                //     }
                // }
                //第二种需求：需要图片始终填充整个盒子
                // 图片宽高比例比图框宽高比例大,图片高度=图框高度
                // 图片宽高比例比图框宽高比例小,图片宽度=图框宽度
                if(width/height >= maxWidth/maxHeight){  
                    el.style.height = maxHeight + 'px';
                    el.style.width = maxHeight * width / height  + 'px';
                } else {
                    el.style.width = maxWidth + 'px';
                    el.style.height = maxWidth * height /width + 'px';
                }
            }
        },
        updated: function(el,binding,vnode){
            
        },
    })

    //盒子的宽高比保持不变,传一个系数 ，
    //已知宽，求高 系数是高除以宽
    Vue.directive('elReactive',{
        bind:function(el,binding,vnode){
        },
        inserted: function(el,binding,vnode){
            el.style.height = el.offsetWidth * binding.expression + 'px';
            window.onresize = function(){
                el.style.height = el.offsetWidth * binding.expression + 'px';
            }
        },
        updated: function(el,binding,vnode){
            
        },
    })



    //图片缩放
    Vue.directive('elZoom',{
        bind:function(el,binding,vnode){
        },
        inserted: function(el,binding,vnode){
            let imgWidth = el.offsetWidth;
            let imgHeight = el.offsetHeight;
            let scaleVal = 1;
            let isZoom = false;
            let imgleft = el.offsetLeft;
            let imgtop = el.offsetTop;

            function computeLeftTop(x, y, scale){
                imgleft = x - imgWidth * scale * (x - imgleft) / el.offsetWidth;
                imgtop = y - imgHeight * scale * (y - imgtop) / el.offsetHeight;
            };

            /**
             * 设置样式
             */
            function setStyle(opteion = {}) {
                let css = {
                    width: imgWidth * (opteion.scale || scaleVal),
                    height: imgHeight * (opteion.scale || scaleVal),
        			left: imgleft + 'px',
                    top: imgtop + 'px',
                }

                    el.style.width = css.width + 'px';
                    el.style.height = css.height + 'px';
                    el.style.left = css.left;
                    el.style.top = css.top;
            };
            
            let currentScale = scaleVal;
            let alloyFinger = new AlloyFinger(el,{})
            alloyFinger.on('pinch',ev => {
                isZoom = true;
                currentScale = scaleVal * ev.zoom;
                let x = (ev.touches[0].pageX + ev.touches[1].pageX) / 2,
                y = (ev.touches[0].pageY + ev.touches[1].pageY) / 2;
                computeLeftTop(x, y, currentScale);
                setStyle({ scale: currentScale });
            })

            alloyFinger.on('multipointEnd', () => {
                if(isZoom) {
                    isZoom = false;
                    scaleVal = 1;
                }  
            });

            
        },
        updated: function(el,binding,vnode){
            
        },
    })
}