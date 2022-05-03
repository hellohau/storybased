let title = document.getElementById('title');
let area = document.getElementById('area');
let choices_div = document.getElementById('choices');

let node_loaded = undefined;

function load_node(node){
    save_preface();
    if(showing_tree) swap_screen();

    if(typeof(node) == "number"){
        console.log("got an id");
        for (let i = 0; i < nodes_UI.length; i++) {
            if(nodes_UI[i].node.id == node){
                node = nodes_UI[i];
                break;
            }
        }
    }

    node_loaded = node;
    selected_node = node;

    title.value = node.node.title;
    area.value = node.node.description;

    choices_div.innerHTML = "";
    node.node.childs.forEach(child => {
        choices_div.innerHTML += 
            '<button class = "choice" onclick = "load_node('+ child.id +')">'+ child.title +'</button>';
    });

    choices_div.innerHTML += '<button class = "choice" onclick = "add_node_UI(true)"> + </button>'
}

function save_preface(){
    if(node_loaded == undefined){
        console.warn("nope can't do, no node to save");
        return;
    }

    node_loaded.node.title = title.value;
    node_loaded.node.description = area.value;
}

let canvas = document.getElementById("canv");
let pref = document.getElementById("preface");
let showing_tree = false;

function swap_screen(){
    if(showing_tree){
        canvas.classList.add("hide");
        pref.classList.remove("hide");
    }
    else
    {
        pref.classList.add("hide");
        canvas.classList.remove("hide");
    }

    showing_tree = !showing_tree
}

let last_click = new Date();
window.addEventListener('click', () => {
    if(selected_node == undefined) return;

    if(new Date() - last_click < 200){
        load_node(selected_node);
    }

    last_click = new Date();
});


