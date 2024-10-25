const input = document.querySelector("#input");
const button = document.querySelector("#button");
const tasks = document.querySelector("#tasks");
const addNewTask = document.querySelector("#add-new-task");

let backgrounds = ["/assets/img/backgronds/back-1.jpg", "/assets/img/backgronds/back-2.jpg", "/assets/img/backgronds/back-3.jpg", "/assets/img/backgronds/back-4.jpg"];
let currentBackgroundIndex = 0;

setInterval(() => {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.body.style.transition = "background-image 1s ease-in-out";
    document.body.style.backgroundImage = `url(${backgrounds[currentBackgroundIndex]})`;
}, 10000);


let myTasks = [];

let swiper = new Swiper(".swiper", {
    pagination: {
      el: ".swiper-pagination",
    },
    slidesPerView: 1,
    width: 400,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },


});

function domHandler(){
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    swiperWrapper.innerHTML = "";
    myTasks.forEach((item) => {
        let className = (item.status) ? "task completed" : "task";
        
        swiperWrapper.insertAdjacentHTML("beforeend", `
            <div class="${className} swiper-slide" onclick="toggleTaskStatus(event)">
                <div>
                    <strong>${item.task}</strong>
                    <p>Type: ${item.type}</p>
                    <p>Description: ${item.description}</p>
                </div>
                <div>
                    <img onclick="deleteTaskHandler(event)" src="./assets/img/delete-icon.svg" alt="close">
                    <img onclick="editHandler(event)" src="./assets/img/edit-icon.svg" alt="edit">
                </div>
            </div>`);
        swiperWrapper.parentElement.swiper.update();
    })
}

function toggleTaskStatus(event) {
    const taskElement = event.currentTarget;
    const taskName = taskElement.querySelector("strong").innerText;
    let index = myTasks.findIndex((item) => item.task === taskName);
    if (index !== -1) {
        myTasks[index].status = !myTasks[index].status;
        taskElement.classList.toggle("completed");
        syncLocal();
    }
}

function editHandler(event) {
    event.stopPropagation();
    const taskValue = event.target.parentElement.parentElement.querySelector("strong").innerText;
    const index = myTasks.findIndex((item) => item.task === taskValue);

    if (index !== -1) {
        input.value = myTasks[index].task;
        document.querySelector("#type").value = myTasks[index].type;
        document.querySelector("#description").value = myTasks[index].description;

        myTasks.splice(index, 1);
        syncLocal();
        domHandler();

        const inputBoxContainer = document.querySelector(".input-box-container");
        const inputBox = document.querySelector(".input-box");
        inputBoxContainer.classList.add("show");
        inputBox.classList.remove("hide");
    }
}



function addTaskHandler() {
    let inputValue = input.value;
    if (!inputValue) {
        return;
    }

    let taskObj = {
        task: inputValue,
        status: false,
        type: document.querySelector("#type").value,
        description: document.querySelector("#description").value
    };

    myTasks.push(taskObj);
    syncLocal();
    input.value = "";
    document.querySelector("#type").value = "personal";
    document.querySelector("#description").value = "";

    document.querySelector(".input-box").classList.add("hide");
    document.querySelector(".input-box-container").classList.remove("show");
    domHandler();
}




function deleteTaskHandler(event) {
    event.stopPropagation();
    const taskElement = event.target.closest(".task");
    const taskName = taskElement.querySelector("strong").innerText;

    const index = myTasks.findIndex(item => item.task === taskName);
    if (index === -1) {
        return;
    }

    myTasks.splice(index, 1);
    syncLocal();
    domHandler();

    document.querySelector(".input-box").classList.add("hide");
}




function syncLocal(){
    localStorage.setItem("task",JSON.stringify(myTasks));
    domHandler();
}

window.addEventListener("load",() => {
    myTasks = JSON.parse(localStorage.getItem("task")) || [];
    domHandler()
});
button.addEventListener("click",addTaskHandler);
input.addEventListener("keydown",(event) => {
    if(event.key == "Enter"){
        addTaskHandler()
    }
});



addNewTask.addEventListener("click", () => {
    const inputBoxContainer = document.querySelector(".input-box-container");
    const inputBox = document.querySelector(".input-box");
    
    inputBoxContainer.classList.toggle("show");
    inputBox.classList.toggle("hide");
});

document.querySelector(".close-icon").addEventListener("click", () => {
    const inputBoxContainer = document.querySelector(".input-box-container");
    const inputBox = document.querySelector(".input-box");
    
    inputBoxContainer.classList.remove("show");
    inputBox.classList.add("hide");
});
