/**
 * Created by liumin on 2016/7/27.
 */
define(function(){
    /**
     * 图片轮播
     * @param [object] options 需要传递的参数
     * **/
    var scrollPic = function(options){
        this.options = {
            mainId:'', //容器id
            cellClass:'',//标签
            pageLeft:'',//左翻页id
            pageRight:'',//右翻页id
            current:0,//当前页数
            auto:true,//是否自动轮播
            obj:'',//保存的对象
            speend:3000,//轮播速度
            maxPage:0,//最大页数
            showTime:100
        }
        $.extend(this.options,options);
        this.init();
    }
    scrollPic.prototype = {
        init:function(){
            var _auto = this.options.auto,
                _obj = '',
                _this = this,
                _speend = this.options.speend,
                $main = $('#' + this.options.mainId);
            this.options.maxPage = $('#' + this.options.mainId).find('.' + this.options.cellClass).length;
            if(_this.options.pageLeft.length > 0 && _this.options.pageRight.length > 0){}
            $('#' + _this.options.pageLeft).on('click',function(){
                _this.pageLeft();
            });
            $('#' + _this.options.pageRight).on('click',function(){
                _this.pageRight();
            });

            if(_auto){
                _obj = setInterval(function(){
                    _this.scroll();
                },_speend);

                $main.hover(function(){
                    clearInterval(_obj);
                },function(){
                    _obj = setInterval(function(){
                        _this.scroll();
                    },_speend);
                });
            };
        },
        scroll:function(){
            var _current = this.options.current,
                _maxPage = this.options.maxPage,
                $cells = $('.' + this.options.cellClass);
            if(_current + 1 < _maxPage){
                this.options.current += 1;
                this.showCurrent(_current+1);
                if(_current + 1 == _maxPage - 1){
                    this.options.current = -1;
                }
            }else{
                this.options.current = 0;
                this.showCurrent(0);
            }
        },
        showCurrent:function(index){
            var $main = $('#' + this.options.mainId),
                _maxPage = this.options.maxPage,
                _showTime = this.options.showTime;
            $main.find('.' + this.options.cellClass).stop().hide();
            $main.find('.' + this.options.cellClass).eq(index).stop().fadeIn(1000);

        },
        //左翻页
        pageLeft:function(){
            var _this = this,
                _current = _this.options.current,
                _max = _this.options.maxPage;
            if(_current - 1 >= 0){
                _current = _this.options.current -= 1;
            }else{
                _current = _this.options.current = _max -1;
            }
            _this.showCurrent(_current);

        },
        //右翻页
        pageRight:function(){
            this.scroll();
        }
    }
    new scrollPic({
        mainId: 'homeScroll1',
        cellClass: 'home-scroll-cell'

    });
});

