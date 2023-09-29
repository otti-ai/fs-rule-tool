var mainPlane;
var middlePlane;
var menuList;
var overallRules = new Array();
var createHTML = "";
var figuresArray = new Array();
var toggleSidebar = false;
var saveData;


window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

function setup() {
    mainPlane = document.getElementById("mainPlane");
    middlePlane = document.getElementById("middlePlane");
    menuList = document.getElementById("menuList");

    overallRules[0] = new RuleBookReader('rules/fs-rule-2023.json');
    saveData = new SaveDataHandler();

    loadBookmakers();
    registerHandlebarsHelpers();

    document.getElementById('settings').addEventListener('click', async () => {
        const isDarkMode = await window.darkMode.toggle();
    });
}


function setActivMenu(e){
    Array.prototype.forEach.call(document.getElementsByClassName("menuItem"), (element) => element.children[0].classList.remove("active"));
    e.classList.add("active");
}

function openNew(e) {
    setActivMenu(e);
    middlePlane.innerHTML = "";
    mainPlane.innerHTML = "";
    var createHTML = "";

    middlePlane.innerHTML = createHTML;
    showSidebar(false);
}

function openRule(path){
    fetch(path)
        .then((res) => res.text())
        .then((text) => {
            processJSONFile(text);
        })
        .catch((e) => console.error(e));
}

function openOverall(e) {
    setActivMenu(e);
    middlePlane.innerHTML = "";
    middlePlane.innerHTML += '<ul id="ruleMenu" class="nav nav-pills flex-column mb-auto"></ul>';
    
    overallRules.forEach(function (rule) {
        document.getElementById("ruleMenu").appendChild(rule.getMenuItem());
    });

    showSidebar(true);
}

function scrollToRule(name){
    var scrollDiv = document.getElementById(name).offsetTop;
    mainPlane.scrollTo({ top: scrollDiv-30, behavior: 'smooth'});
}

function loadBookmakers(){
    var list = document.getElementsByClassName('bookmakerFolder').length;
    for(var i=0;i<list;i++){
        document.getElementsByClassName('bookmakerFolder')[0].remove();
    }
    fetch("rules/save.json")
        .then((res) => res.text())
        .then((text) => {
            var data = JSON.parse(text);
            data.bookmakers.forEach(function (folder) {
                var entry = '<li class="nav-item menuItem bookmakerFolder"><a href="#" onclick="openBookmakerFolder(this,\''+folder.folder_name+'\');event.preventDefault();" class="nav-link text-white" aria-current="page"><img src="img/icons/bookmakers.png" class="bi me-2" width="16" height="16"></img>'+folder.folder_name+'</a></li>' ;
                menuList.innerHTML += entry;
            });
        })
        .catch((e) => console.error(e));
}

function openBookmakerFolder(e, name){
    setActivMenu(e);
    middlePlane.innerHTML = "";
    middlePlane.innerHTML += '<ul id="ruleMenu" class="nav nav-pills flex-column mb-auto"></ul>';

    fetch("rules/save.json")
        .then((res) => res.text())
        .then((text) => {
            var data = JSON.parse(text);
            data.bookmakers.forEach(function (folder) {
                if(folder.folder_name == name){
                    folder.rule_list.forEach(function (rule) {
                        var createHTML = '<li class="nav-item mt-1"><a href="#" onclick="openBookmakerRule(\''+rule.book_filename+'\');event.preventDefault();" class="nav-link text-white d-flex align-items-center" aria-current="page"><img src="img/icons/bookmarker-yes.png" class="bi me-2" width="30" height="30"></img><div><p class="mb-0">';
                        createHTML += rule.book_name;
                        createHTML += '</p><p class="mb-0">';
                        createHTML += rule.rule_shortname;
                        createHTML += '</p></div></a></li>';
                        document.getElementById("ruleMenu").innerHTML += createHTML;
                    });
                }

                
            });
        })
        .catch((e) => console.error(e));
}

function openBookmakerRule(filename){
    fetch("rules/"+filename)
        .then((res) => res.text())
        .then((text) => {
            var data = JSON.parse(text);
            data.bookmakers.forEach(function (folder) {
                if(folder.folder_name == filename){
                    folder.rule_list.forEach(function (rule) {
                        var createHTML = '<li class="nav-item mt-1"><a href="#" onclick="openBookmakerRule(\''+rule.book_filename+'\');event.preventDefault();" class="nav-link text-white d-flex align-items-center" aria-current="page"><img src="img/icons/bookmarker-yes.png" class="bi me-2" width="30" height="30"></img><div><p class="mb-0">';
                        createHTML += rule.book_name;
                        createHTML += '</p><p class="mb-0">';
                        createHTML += rule.rule_shortname;
                        createHTML += '</p></div></a></li>';
                        document.getElementById("ruleMenu").innerHTML += createHTML;
                    });
                }

                
            });
        })
        .catch((e) => console.error(e));
}

function showSidebar(pBool){
    document.getElementsByClassName('sidebar')[0].style.display = pBool ? "block" : "none";
    toggleSidebar = pBool;
    toggleSidebarButton();
}

function toggleSidebarButton(){
    if(toggleSidebar){
        document.getElementById('middlePlane').style.visibility = "visible";
        document.getElementsByClassName('sidebar')[0].style.width = "fit-content"; 
        document.getElementsByClassName('arrowImg')[0].style.transform = "rotate(180deg)";
        document.getElementsByClassName('arrowBar')[0].setAttribute('class', 'arrowBar');
        toggleSidebar = false;
    }else{
        document.getElementById('middlePlane').style.visibility  = "hidden";
        document.getElementsByClassName('sidebar')[0].style.width = "0px"; 
        document.getElementsByClassName('arrowImg')[0].style.transform = "rotate(0deg)";
        document.getElementsByClassName('arrowBar')[0].setAttribute('class', 'arrowBar arrowBarShow');
        toggleSidebar = true;
    }
}