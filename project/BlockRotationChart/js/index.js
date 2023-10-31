function Structure(n,record){
    this.n = n
    this.record =record
}


function time(structure) {


    function Delete_Last(){
        structure.record = false
        li_bottom[structure.n].classList.remove("Move-in-elements")
    }

    function Add_Next(){
        if (structure.n <3){
            ul_block.style.transform = "rotateY(" + structure.n*(-90) + "deg)"
        }else {
            ul_block.style.transform = "rotateY(-180deg) rotateX(-90deg) rotateZ(" + (structure.n-3)*(-90) + "deg)"
        }
        li_bottom[structure.n].classList.add("Move-in-elements")
    }

    function arrow_fun(){
        li_bottom[structure.n].classList.remove("Move-in-elements")
        structure.n = (structure.n + 1) % 6
        Add_Next()
    }
    function arrow_fun2(){
        Delete_Last()
        structure.n = ((structure.n - 1) + 6)% 6
        Add_Next()
    }

    var ul_block = document.querySelector(".cube")
    var li_bottom = document.querySelectorAll(".selection-box li")
    var arrow = document.querySelectorAll(".arrow div")
    arrow[0].onclick = arrow_fun2
    arrow[1].addEventListener("click", arrow_fun)
    arrow[1].addEventListener("click", function(){
        structure.record = false
    })

    for(var i=0; i<=5 ; i++){
        (function (i){
            li_bottom[i].addEventListener("click",function (){
                Delete_Last()
                structure.n = i
                Add_Next()
            })
        })(i)
    }
    li_bottom[structure.n].classList.add("Move-in-elements")

    setInterval(function() {
        if(structure.record) {
            arrow_fun()
        }
        structure.record = true
    }, 3000);
}

window.onload = function() {
    var structure = new Structure(0,true)
    time(structure)
}