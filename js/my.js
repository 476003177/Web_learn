/**
 * Created by hao on 2018/2/27.
 */
//外链式js，注意文字与html相同，此处为UTF-8
//在html加上：<script src="my.js"></script>
//自定义常用函数
function getid(id){return document.getElementById(id);}//函数功能：获取指定id的元素
function gettag(id,tag){return getid(id).getElementsByTagName(tag);}//函数功能：获取指定id的全部tag元素
//封装自己class类名
function getclass(classname){
    //如果浏览器支持，直接返回
    if(document.getElementsByClassName){
        //ie5678不支持
        return document.getElementsByClassName(classname);
    }else{
        var arr=[];
        //获取所有标签元素，包括style和script，再遍历判断获取
        var dom=document.getElementsByTagName("*");
        for(var i= 0,len=dom.length;i<len;i++){
            //当一个标签带有多个类名的时候，一定是用空格隔开的
            var txtarr=dom[i].className.split(" ");
            for(var j= 0,len1=txtarr.length;j<len1;j++){
                if(txtarr[j]==classname){
                    arr.push(dom[i]);
                }
            }
        }
        return arr;
    }
}
//封装$选择器，如$("#demo")、$(".demo")、$("div")
function $(str){
    var s=str.charAt(0);//charAt(0)：获取str的第0个字符
    var ss=str.substr(1);//substr(x,y)：获取str索引号从x到y的字符串，y省略则为最尾部
    switch(s){
        case "#":
            return getid(ss);
            break;
        case ".":
            return getclass(ss);
            break;
        default:
            return document.getElementsByTagName(str);
    }
}
//parentNode：父亲节点；offsetParent：返回带定位的父辈
//封装自己的兄弟结点函数，后一个兄弟结点、前一个兄弟结点
function getnextSibling(me){
    //nextSibling只可以在ie678用，nextElementSibling可以在其他浏览器用
    //兼容写法必须先写正常浏览器再写ie的
    var nextSibling=me.nextElementSibling||me.nextSibling;
    return nextSibling;
}
function getpreviousSibling(me){
    //previousSibling只可以在ie678用，previousElementSibling可以在其他浏览器用
    var previousSibling=me.previousElementSibling||me.previousSibling;
    return previousSibling;
}
//封装自己的孩子结点函数，第一个孩子结点、最后一个孩子结点、所有孩子结点
//第一个孩子结点尽量少用，因为火狐、谷歌等高版本浏览器会把换行也当做子节点，因此第一个孩子很可能是换行。
//可利用nodeType==1作为判断元素结点的依据
function getfirstChild(me){
    var firstChild=me.firstElementChild||me.firstChild;
    return firstChild;
}
function getlastChild(me){
    var lastChild=me.lastElementChild||me.lastChild;
    return lastChild;
}
function getchildNodes(me){
    //chileNodes：获取所有孩子结点，但高版本浏览器可能会把换行也当做孩子结点
    //children：也是获取所有孩子结点，无上述问题，但ie678包含注释结点
    var childNodes_all=me.childNodes;
    var childNodes=[];
    for(var i= 0,len=childNodes_all.length;i<len;i++){
        //当nodeType==1，则该元素是元素结点，而非换行；nodeType==2，属性结点；nodeType==3，文本结点
        if(childNodes_all[i].nodeType==1){
            childNodes.push(childNodes_all[i])
        }
    }
    return childNodes;
}
//封装自己的scroll_()，获取页面卷掉的头部和侧面。加_原因：不加无法识别，原因不明
function scroll_(){
    //谷歌浏览器和没有声明 DTD  <DOCTYPE	> ：document.body.scrollTop;
    //火狐和其他浏览器：document.documentElement.scrollTop;
    //ie9+和最新浏览器都认识：window.pageXOffset；pageYOffset（scrollTop）
    //兼容写法：
    if(window.pageXOffset!=null) {//ie9+以及其他高级浏览器
        //window.pageX(Y)Offset返回滚动的数值，可能为0，因此必须得!=null判断
        //返回json：js对象表示法，用于数据传输
        return{
            left:window.pageXOffset,
            top:window.pageYOffset
        }
    }else if(document.compatMode=="CSS1Compat"){//标准浏览器
        return{
            left:document.documentElement.scrollLeft,
            top:document.documentElement.scrollTop
        }
    }else{//怪异浏览器，即没有声明<!DOCTYPE html>
        return{
            left:document.body.scrollLeft,
            top:document.body.scrollTop
        }
    }
}
//封装自己的client()，返回可视区域的宽和高
function client(){
    //clientWidth返回的是可视区大小，是浏览器内部的大小
    //window.screen.width返回的是电脑分辨率，与浏览器没有关系
    if(window.innerWidth!=null){
        return{
            width:window.innerWidth,
            height:window.innerHeight
        }
    }else if(document.compatMode=="CSS1Compat"){
        return{
            width:document.documentElement.clientWidth,
            height:document.documentElement.clientHeight
        }
    }else{
        return{
            width:document.body.clientWidth,
            height:document.body.clientHeight
        }
    }
}
//封装禁止冒泡函数
function bubble_cancel(event_in){
    if(event_in&&event_in.stopPropagation()){
        event_in.stopPropagation();//w3c标准
    }else{
        event_in.cancelBubble=true;//ie678
    }
}
//封装事件兼容函数
function event_conpatible(event_in){
    var event_out=event_in || window.event;//兼容性写法，window.event是ie678的用法
    return event_out;
}
//封装事件对象id函数
function event_id(event_in){
    //srcElement.id为ie678写法，target.id为高级浏览器写法
    var targetId=event_in.target?event_in.target.id:event_in.srcElement.id;
    return targetId;
}
//封装获取选定文字函数
function gettext(){
    var txt;//用于存储文字的变量
    if(window.getSelection) {
        txt = window.getSelection().toString();   // 转换为字符串
    } else {
        txt = document.selection.createRange().text;   // ie的写法
    }
    return txt;
}
//封装返回当前CSS样式（可行内可内嵌可外链）的函数
function getStyle(obj,attr) {  //obj对象，attr为返回的属性
    if(obj.currentStyle){
        return obj.currentStyle[attr];//ie浏览器写法
    }else{
        //window.getComputedStyle(对象,伪类)
        return window.getComputedStyle(obj,null)[attr];  // w3c浏览器写法
    }
}
//封装修改透明值函数
function update_opacity(obj,opacity_now){
    //in运算符：判断某属性是否在某数组或对象中
    if("opacity" in obj.style)  // 判断我们浏览器是否支持opacity
    {obj.style.opacity = (opacity_now) /100;}
    else
    {  // obj.style.filter = alpha(opacity = 30)
        obj.style.filter = "alpha(opacity = "+opacity_now+")";//ie浏览器
    }
}
//封装一般匀动(缓动)效果
function move_slow_or_constant(move_obj,parameter_target,move_mode,step,fn_current,fn_go){
    //parameter_target为json格式
    var move_mode = arguments[2] ? arguments[2] : "slow";//设置第3个参数的默认值为slow，即缓动
    var step = arguments[3] ? arguments[3] : 10;//设置第4个参数的默认值为10
    clearInterval(move_obj.move);
    var current={};
    //检测传递进入的函数是否存在，存在即默认该函数返回值为current的输入值
    if(fn_current){current=fn_current();//执行fn
    }else{
        for(var k in parameter_target){
            current[k]=parseInt(getStyle(move_obj,k));
            //if((k in step)==false)console.log("1");step[k]=10;
        }
    }
    var reach=[];
    move_obj.move=setInterval(function(){
        for(var k in parameter_target){//k为json的key，遍历json
            current[k]=move_slow_or_constant_parameter(current[k],parameter_target[k],move_mode,step);
            if(fn_go){fn_go(current[k]);}
            else{
                if(k=="opacity"){update_opacity(move_obj,current[k]);}
                else if(k=="zIndex"){
                    move_obj.style[k]=current[k];
                }else{
                    move_obj.style[k]=current[k]+"px";
                }
            }
            if(current[k]==parameter_target[k]){
                reach[k]=1;
            }else {
                reach[k]=0;
            }
        }
        var stop=0;
        for(var i=0;i<reach.length;i++){
            if(reach[k]==1)stop++;
        }
        if(stop==Object.keys(parameter_target).length){
            clearInterval(move_obj.move);
        }
    },20)
}
//函数：返回匀动(缓动)效果的参数
function move_slow_or_constant_parameter(current,target,move_mode,step){
    var move_mode = arguments[2] ? arguments[2] : "slow";//设置第3个参数的默认值为slow，即缓动
    var step = arguments[3] ? arguments[3] : 10;//设置第4个参数的默认值为10
    var go_now=0;
    var borderline=1;
    if(move_mode!="slow"&&move_mode!="constant"){
        console.warn("未识别移动模式，自动切换为slow模式'");//输出控制台警告信息
        console.error("未识别移动模式，自动切换为slow模式'");//输出控制台错误信息
        move_mode="slow";
    }
    switch(move_mode){
        case "slow":
            go_now=(target-current)/step;
            borderline=1;
            break;
        case "constant":
            go_now=target>current?step:(-1*step);
            borderline=step;
            break;
    }
    //Math.ceil()：向上取整
    //Math.floor()：向下取整
    //Math.round()：小数后一位四舍五入，取整
    go_now=(go_now<=0?Math.floor(go_now):Math.ceil(go_now));//取整
    go_now=go_now+current;
    if(Math.abs(current-target)<=borderline){
        go_now=target;
    }
    return go_now;
}
//函数：拖动效果
function drag(dragObject,moveObject,x_ifmove,y_ifmove){
    var x_ifmove = arguments[2] ? arguments[2] : true;//设置第3个参数的默认值为true，即水平方向可移动
    var y_ifmove = arguments[3] ? arguments[3] : false;//设置第4个参数的默认值为false，即竖直方向不可移动
    var movemarginleft = parseInt(getStyle(moveObject,"margin-left"));
    var movemargintop = parseInt(getStyle(moveObject,"margin-top"));
    dragObject.onmousedown=function(event){//鼠标按下后获取事件
        var event=event || window.event;//兼容性写法，wind
        // ow.event是ie678的用法
        //offsetLeft和offsetLeTop获取的是子盒子到父盒子的边框距离，包括margin，因此要减回去
        var left_movecurrent=moveObject.offsetLeft-movemarginleft;
        var top_movecurrent=moveObject.offsetTop-movemargintop;
        var left_mousecurrent=event.clientX;//鼠标按下位置相对于可视区域的坐标
        var top_mousecurrent=event.clientY;//鼠标按下位置相对于可视区域的坐标
        document.onmousemove=function (event){//鼠标移动，获取事件
            var event=event || window.event;
            //水平方向移动
            if(x_ifmove==true){
                var left_go=event.clientX-left_mousecurrent+left_movecurrent;
                var left_max=moveObject.offsetParent.offsetWidth-moveObject.offsetWidth-movemarginleft;
                if(left_go<=0){
                    left_go=0;
                }else if(left_go>=left_max){
                    left_go=left_max;
                }
                moveObject.style.left=left_go+"px";
                //slider.mask填充，暂未解决模块化问题
                if(dragObject.className=="bar"){
                    getchildNodes($("#sliderbar"))[1].style.width=left_go+movemarginleft+"px";
                }
            }
            //竖直方向移动
            if(y_ifmove==true){
                var top_go=event.clientY-top_mousecurrent+top_movecurrent;
                var top_max=moveObject.offsetParent.offsetHeight-moveObject.offsetHeight-movemargintop;
                if(top_go<=0){
                    top_go=0;
                }else if(top_go>=top_max){
                    top_go=top_max;
                }
                moveObject.style.top=top_go+"px";
            }
            //消除选择造成的bug
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
        document.onmouseup=function(){//鼠标按键松开
            document.onmousemove=null;//不做任何操作，抵消上一步操作
        }
    }
}
//函数：当鼠标移动到li，切换图片
var slow_switch=null;
//旧版本current
function current1(index,lis){
//           console.log(current.length);//current.length为形参的个数
//           console.log(arguments.length);//arguments为接收的实参，arguments.length为实参的个数
//           arguments.callee;//arguments.callee：返回的是正在使用的函数的本身，推荐用在递归
//            var num=parseInt(id.slice(3),10);//10代表id.slice(3)值为十进制，若缺省也默认为十进制
//            console.log(num);
//            console.log(typeof num);//输出类型
    var left_current=parseInt($("#pic_bigbox").style.left);//获取当前的left并转换为十进制数字
    var target=$("#scroll").offsetWidth*index*(-1);
    clearInterval(slow_switch);//清除之前的缓动效果，避免冲突
    //制造缓动效果
    slow_switch = setInterval(function(){
        left_current=move_slow_or_constant_parameter(left_current,target);
        $("#pic_bigbox").style.left=left_current+"px";
    }, 20);
    lis[index].className= "current";//设置类名，使得样式改变
    //消除本来的红点
    lis[lis.current].className="";
    lis.current=index;
}
//新版本current，创新之处：每次切换只有左右两张图存在
function current(index,lis){
    if(index!=lis.current){
        var allchild=getchildNodes($("#pic_bigbox"));
        var left_current= 0,target=0;
        for(var i= 0,len=allchild.length;i<len;i++){
            allchild[i].style.display="none";
        }
        allchild[index].style.display="block";
        allchild[lis.current].style.display="block";
        if(lis.current>index){
            left_current=$("#scroll").offsetWidth*(-1);
            target=0;
        }else if(lis.current<index){
            left_current=0;
            target=$("#scroll").offsetWidth*(-1);
        }
        clearInterval(slow_switch);//清除之前的缓动效果，避免冲突
        //制造缓动效果
        slow_switch = setInterval(function(){
            left_current=move_slow_or_constant_parameter(left_current,target);
            $("#pic_bigbox").style.left=left_current+"px";
            if(left_current==target){
                clearInterval(slow_switch);
            }
        }, 20);
        lis[index].className= "current";//设置类名，使得样式改变
        //消除本来的红点
        lis[lis.current].className="";
        lis.current=index;
    }
}