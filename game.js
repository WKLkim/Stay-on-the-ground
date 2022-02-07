$(function () {
    let Game = false;               //游戏中
    let Wel = true;                 //主界面
    let Over = false;               //结束界面
    let Set = false;                //游戏设置
    let Begin = true;               //开始游戏
    let Replay = false;             //重新开始
    let Return = false;             //返回主界面
    let diff = 3;                            //难度
    let speed = 0.1;                           //速度
    let point = 0;                       //分数
    let block_index = 0;                 //地面索引
    let INF = 7;                         //地面数
    let block_top_array = [3,4,1,3,2,3,4];      //最初地面高度数组
    let block_left_array = [2.5,4,5,6.5,7,8.5,10];      //最初地面左偏移数组
    let block_top;                       //某地面高度
    let block_left;                      //某地面左偏移
    let block_width = 1;                  //地面宽度
    let block_new_left = block_width;            //新地面移动距离
    let level = -1;                      //速度等级
    let car_top = $('.car').position().top;           //小车高度
    let car_left = $('.car').position().left;         //小车左偏移
    let timeMove;                        //前进定时器
    let pause = 0;                       //是否暂停
    let ground = false;                  //false—不在地面
    $('.level').text(diff);
    function Block() {                                            //生成最初地面
        block_left_array = [2.5,4,5,6.5,7,8.5,10];
        for(block_index = 0;block_index < INF;block_index++){
            let block = document.createElement('div');
            block.className = 'block';
            $('.begin').append(block);
            block_top = block_top_array[block_index];
            block_left = block_left_array[block_index];
            $('.block').eq(block_index).css("top", block_top+'rem');
            $('.block').eq(block_index).css("left", block_left+'rem');
        }
    }
    function createBlock() {                                          //生成地面
        let block = document.createElement('div');
        block.className = 'block';
        $('.begin').append(block);
        let num = Math.random();
        if (num<0.33){block_top_array[INF] = 3;block_left_array[INF] = 10;}
        else if (num<0.66){block_top_array[INF] = 4;block_left_array[INF] = 11;}
        else {block_top_array[INF] = 2;block_left_array[INF] = 11.5;}
        $('.block').eq(INF).css("top", block_top_array[INF]+'rem');
        $('.block').eq(INF).css("left", block_left_array[INF]+'rem');
    }
    function over() {                                           //是否在地面上
        for(let i=(INF-10); i < INF;i ++){
            console.log(car_top);
            if (car_left>=block_left_array[i]-0.5&&car_left<=block_left_array[i]+1&&car_top<=block_top_array[i]-0.360&&car_top>=block_top_array[i]-0.370){
                ground = true;
                i = INF;
                point++;
            }
            else ground = false;
        }
        if (!ground){                                               //不在地面——下降
            car_top+=0.01;
            $('.car').css('top', car_top+'rem');
        }
    }
    function move() {                                              //画面向左移动
            if (car_left<3){                                     //先小车移动
                car_left = car_left+0.015;
                $('.car').css('left', car_left+'rem');
            }else{                                                 //后板块移动
                for(block_index = 0;block_index < INF;block_index++){
                    if (block_left_array[block_index]>-1){
                        block_left_array[block_index]=block_left_array[block_index]-(speed*0.01);
                        $('.block').eq(block_index).css("left", block_left_array[block_index]+'rem');
                    }
                }
                block_new_left-=0.01;
                if (block_new_left<0){createBlock();block_new_left=block_width;INF++}
            }
            over();
            $('.diff').text('难度：'+ diff);
            $('.point').text('分数：'+point);
            $('.process').text('进度：'+ (INF-7) +'%');
            if (INF>=107||car_top<0||car_top>5.3){                                   //结束条件
                clearInterval(timeMove);
                $('.over_point').text('你的得分：'+point);
                $('.over').css('display','block');
                Game = false;
                Over = true;
                $('.begin').css('display','none');
                $('.block').remove();
                INF = 7;
                point = 0;
                car_top = 0.1;
                car_left = 0;
                $('.car').css('top',car_top+'rem');
            }
    }
    function up(){                                              //小车跳跃
        car_top -= 1;
        $('.car').css('top',car_top+'rem');
    }
    $(document).keydown(function(event){
        if (Game){
            if(event.keyCode === 38){                                   //按上键跳跃
                up()
            }else if(event.keyCode === 13){                             //回车暂停
                pause++;
                if (pause%2 === 1) {clearInterval(timeMove)}
                else {timeMove = setInterval(move,3);}
            }
        }
        else if (Wel){
            if(event.keyCode === 38){                                   //按上键
                $('.logo').css('top','1%');
                Set = false;
                Begin = true;
            }else if (event.keyCode === 40){                            //按下键
                $('.logo').css('top','100%')
                Set = true;
                Begin = false;
            }else if (event.keyCode === 13){
                if (Begin){
                    Game = true;
                    Wel = false;
                    Over = false;
                    $('.welcome').css('display','none');
                    $('.begin').css('display','block');
                    speed = 1+(0.1*diff);                               //难度转速度
                    Block();
                    timeMove = setInterval(move,3);
                }
            }else if (Set&&event.keyCode === 37&&diff>1) diff--;
             else if (Set&&event.keyCode === 39&&diff<5) diff++;
            $('.level').text(diff);
        }
        else if (Over){
            if(event.keyCode === 38){
                $('.over_select').eq(0).css('color','pink');
                $('.over_select').eq(1).css('color','#b3c6c6');
                Return = true;
                Replay = false;
            } else if (event.keyCode === 40){
                $('.over_select').eq(1).css('color','pink');
                $('.over_select').eq(0).css('color','#b3c6c6');
                Replay = true;
                Return = false;
            }else if (event.keyCode === 13){
                if (Return){
                    Wel = true;
                    Over = false;
                    $('.over').css('display','none');
                    $('.welcome').css('display','block');
                }else if (Replay){
                    $('.over').css('display','none');
                    Game = true;
                    Over = false;
                    $('.begin').css('display','block');
                    Block();
                    timeMove = setInterval(move,3);
                }
            }
            }
    });
});
;(function(win) {                                                           //窗口自适应化
    let adaption;
    function refreshRem() {
        let size = 1263.33;                                                 // 屏幕宽度像素
        let html = document.documentElement;
        let win_width = html.clientWidth;                                   // 目前窗口宽度
        let rem = win_width * 100 / size;
        document.documentElement.style.fontSize = rem + 'px';
    }
    win.addEventListener('resize', function() {
        clearTimeout(adaption);
        adaption = setTimeout(refreshRem, 0);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(adaption);
            adaption = setTimeout(refreshRem, 0);
        }
    }, false);
    refreshRem();
})(window);
