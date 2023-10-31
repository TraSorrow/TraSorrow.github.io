function Structure(num,record,wait1,wait2){
    this.num = num      //当前图片的序号
    this.record = record    //控制轮播图轮播
    this.wait1 = wait1      //控制防抖
    this.wait2 = wait2      //控制节流
}
//获取的图片
var imgArr = ["./img/1.jpg","./img/2.jpg","./img/3.jpg","./img/4.jpg","./img/5.jpg","./img/6.jpg"]

$(function (){

    function adsorption(n ,s){      //小原点,图像移动操作    n:左移(-1)右移(1)  s:前面多的一张(-1)后面多的一张(imgArr.length)
        lis[structure.num].classList.remove("Move-in-elements") //删除当前小圆点绑定的类
        structure.num += n;
        img.attr({"style":"transition: left .3s;left: " + -350*(structure.num+1) +"rem"})
        if(structure.num === s){        //移到开头或末尾时
            structure.record =false     //自动播放停止,防止进入错误的地方
            structure.wait2 = true      //不让触屏事件触发,放止进入错误的地方
            //设置属性wait2为只读,防止因为触发节流而修改
            Object.defineProperty(structure,"wait2",{writable: false})
            Unlock(s)
            lis[( s + arrNum ) % (arrNum*2)].classList.add("Move-in-elements")
            return;
        }
        lis[structure.num].classList.add("Move-in-elements")    //为当前小圆点绑定类
    }

    function Unlock(s){     //设置属性和解锁
        new Promise(function (resolve, reject){
            setTimeout(function (){
                structure.num = ( s + arrNum ) % (arrNum*2)
                img.attr({"style":"left: "+ (-350*(structure.num+1)) +"rem"})   //页面渲染后再轮播
                resolve()
            },300)
        }).then(function (){
            return new Promise(function (resolve, reject){
                structure.record =true      //轮播继续
                Object.defineProperty(structure,"wait2",{writable: true})
                structure.wait2 = false      //触屏继续
                resolve()
            })
        })
    }
    function throttle(){        //节流
        structure.wait2 = true;
        setTimeout(function (){
            structure.wait2 = false
        },300)
    }
    function moveFun(event){       //触屏移动
        if (structure.wait2){return;}
        clientRelative = event.changedTouches[0].clientX * 0.2415 - clientInitial
        img.attr({"style":"left: "+ (clientRelative + -350*(structure.num+1)) + "rem"})
    }

    function removeFun(){     //触屏手指拿开
        if (structure.wait2){return;}
        img[0].removeEventListener("touchmove",moveFun)
        img[0].removeEventListener("touchend",removeFun)
        throttle()      //开启节流
        if(clientRelative <= -80){  //弹开后判定相对位置
            adsorption(1 ,arrNum)
        }else if(clientRelative >= 80){
            adsorption(-1 ,-1)
        }else{
            img.attr({"style":"transition: left .3s;left: " + -350*(structure.num+1) +"rem"})
        }
        lockCarousel()
        clientRelative = 0
    }
    function lockCarousel(){        //锁住轮播图
        if(structure.wait1){        //计时器还没结束,再次触发时,删除计时器,重新计时(防抖)
            structure.wait1 = false;
            timer = setTimeout(function (){
                structure.record = true; //打开轮播
                structure.wait1 = true;
            },2000)
        }else{
            clearTimeout(timer)     //删除计时器
            timer = setTimeout(function (){
                structure.record = true; //打开轮播
                structure.wait1 = true;
            },2000)
        }
    }


    var arrNum = imgArr.length      //获取数组长度
    //数据初始化
    var structure = new Structure(0,true,true,false)
    var clientInitial = undefined;  //初始位置
    var clientRelative = undefined; //相对位置
    var timer = null;   //定时器(防抖)

    var img = $(".img-list").bind("touchstart",function (event){    //触屏按下
        if (structure.wait2){return;}
        clientInitial =  event.changedTouches[0].clientX * 0.2415;
        structure.record = false        //关闭轮播
        clearTimeout(timer)     //再次点击时删除计时器,防止在触屏移动时轮播
        img[0].addEventListener("touchmove",moveFun)
        img[0].addEventListener("touchend",removeFun)
    })

    var list = $(".selection-box")      //获取小原点父节点
    imgArr.forEach(function (element){
        img.append("<img src=\""+ element + "\">")  //添加图片
        list.append("<li></li>")        //添加小圆点
    })
    var lis = $(".selection-box li")    //获取全部小圆点
    lis[0].classList.add("Move-in-elements")        //初始化小圆点
    img.append("<img src=\""+ imgArr[0] + "\">").prepend("<img src=\""+ imgArr[arrNum-1] + "\">")


    setInterval(function() {    //轮播
        if(structure.record) {
            adsorption(1 ,arrNum)
        }
    }, 3000);
})