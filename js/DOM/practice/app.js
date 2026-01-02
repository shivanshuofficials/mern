// document.all[8].innerText= "Hello World";
let obj = document.getElementById("mainImg");
obj.src = "/js/DOM/practice/assets/creation_1.png";
//classname

let smallimg = document.getElementsByClassName("oldImg");

for (let index = 0; index < smallimg.length; index++) {
    smallimg[index].src = "/js/DOM/practice/assets/creation_3.jpeg";
    console.log('vallue of .${i} is changed.');
}

// tag name
document.getElementsByTagName("p")[1].innerText= "abc";

//query selector
let query = document.querySelector("#mainImg");
query.src = "/js/DOM/practice/assets/creation_2.jpeg";
//style 
// document.querySelector("h1").style.color = "red";

//classlist properties
// document.querySelector("h1").classList.add("heading");
// document.querySelector("h1").classList.remove("heading");
// document.querySelector("h1").classList.toggle("heading");
// document.querySelector("h1").classList.replace("heading", "newHeading");
// document.querySelector("h1").classList.contains("heading");
// document.querySelector("h1").classList.item(0);
// document.querySelector("h1").classList.value;
// document.querySelector("h1").classList.length;


//event listener
let  btns = document.querySelectorAll("button")
for(btn of btns ){
    btn.addEventListener("click",sayhello);
    btn.addEventListener("click",sayName);
    
}

function sayhello(){
    alert('hello');
}

function sayName(){
    alert('hello');
}


