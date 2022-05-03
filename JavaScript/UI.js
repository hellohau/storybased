

let add_node_button = document.getElementById("add_node_button");
let c = document.getElementById("canv");
let ctx = c.getContext("2d");

fix_dpr();
function fix_dpr(){
    var dpi = window.devicePixelRatio;
    var style_height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    var style_width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);
    c.setAttribute('height',style_height * dpi);
    c.setAttribute('width',style_width * dpi);
}


let tree = new Tree();
tree.add_node(new Node(1,tree));
tree.nodes[0].add_choice(new Node(2,tree));
tree.nodes[0].add_choice(new Node(3,tree));
tree.nodes[1].add_choice(new Node(4,tree));

let id_count = 5
let lines = [];
let nodes_UI = [];
let current_tree = tree;

function draw_tree(tree){
    lines = [];
    nodes_UI = [];

    if(tree.nodes.length == 0) return;

    let current_layer = [new Node_UI(tree.nodes[0])];
    nodes_UI.push(current_layer[0]);

    let already_added = [tree.nodes[0]];

    //Create all the nodes_UI
    while(current_layer.length != 0){

        let next_layer = [];
      
        for(let i = 0; i < current_layer.length; i++){

            //Create child nodes
            current_layer[i].node.childs.forEach(child => {
                if(already_added.indexOf(child) == -1){

                    let child_UI = new Node_UI(child);
                    
                    child_UI.parents.push(current_layer[i]);
                    current_layer[i].childs.push(child_UI);

                    let line = new Line(current_layer[i],child_UI);
                    lines.push(line);
                    current_layer[i].lines.push(line);

                    nodes_UI.push(child_UI);
                    next_layer.push(child_UI);
                    already_added.push(child);
                }
                else{
                    for (let j = 0; j < nodes_UI.length; j++) {
                        if(nodes_UI[j].node == child){
                            current_layer[i].childs.push(nodes_UI[j]);
                            nodes_UI[j].parents.push(current_layer[i]);

                            let line = new Line(current_layer[i],nodes_UI[j]);
                            lines.push(line);
                            current_layer[i].lines.push(line);
                        }
                    }
                }
            });
        }
        
        current_layer = next_layer;
    }

    //Position the nodes
    current_layer = [nodes_UI[0]];
    let visited = [nodes_UI[0]];
    let layer_index = 0

    while(current_layer.length != 0){
        let next_layer = []; 
        let cur_w = c.width / (current_layer.length + 1);
        
        for (let i = 0; i < current_layer.length; i++) {
            current_layer[i].x = cur_w * (i + 1);
            current_layer[i].y = 50 + 100 * layer_index;

            current_layer[i].childs.forEach(child => {
                if(visited.indexOf(child) == -1){
                    visited.push(child);
                    next_layer.push(child);
                }
            });
        }

        current_layer = next_layer;
        layer_index += 1;
    }
    
    //draw
    lines.forEach(line => line.draw());
    nodes_UI.forEach(node_UI => node_UI.draw());
}

let mouse = { x : undefined, y : undefined };
let selected_node = undefined;

c.width = window.innerWidth;
c.height = window.innerHeight;

window.addEventListener('resize', function () {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
});

let holding = false;
let first_pos = {x : undefined, y : undefined};
let first_mouse_pos = {x : undefined, y : undefined};

window.addEventListener('mousedown', (e) => {
    if(menu_open && e.button != 2) return;

    holding = true;
    let found = false;
    nodes_UI.forEach(node_UI => {
        if(node_UI.is_mouse_on()){
            selected_node = node_UI;
            found = true;
        }
    })

    if(found){
        first_pos.x = selected_node.x;
        first_pos.y = selected_node.y;

        first_mouse_pos.x = mouse.x;
        first_mouse_pos.y = mouse.y;

        if(connecting_node){
            //remove the line 
            //add connection
            lines.pop();
            connection_node.add_child(selected_node);
            let line = new Line(connection_node , selected_node);
            lines.push(line);
            connection_node.lines.push(line);
            connecting_node = false;
        }
    }else{
        selected_node = undefined;
        
    }
});

window.addEventListener('mouseup', (e) => {
    holding = false;    
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    if(holding && selected_node != undefined){
        let mouse_diff = {x :first_mouse_pos.x - mouse.x, y : first_mouse_pos.y - mouse.y};
        selected_node.x = first_pos.x - mouse_diff.x;
        selected_node.y = first_pos.y - mouse_diff.y;
    }
})

function add_node_UI(load = false){
    if(selected_node == undefined && !load){
        console.warn("No node selected");
        return;
    }else if(load) selected_node = node_loaded;

    let new_node = new Node_UI(
        new Node(id_count++,tree),
        selected_node.x - selected_node.radius * 2,
        selected_node.y + selected_node.radius * 2
    );
    
    selected_node.add_child(new_node);
    nodes_UI.push(new_node);
    lines.push(new Line(selected_node,new_node));

    selected_node = new_node;
    if(load) load_node(new_node);
}   

function remove_node_UI(){
    if(selected_node == undefined){
        console.warn("No node selected");
        return;
    }

    selected_node.parents.forEach(parent => {
        parent.remove_child(selected_node);
        selected_node.childs.forEach(child => {
            child.parent = parent;
            parent.add_child(child);
        });
    
        selected_node.lines.forEach(line => {
            line.node_from = parent;
            parent.lines.push(line);
        });
    
    })
    
    for(let i = 0; i < lines.length ; i++){
        if(lines[i].node_to == selected_node){
            lines.splice(i,1);
        }
    }

    let index = nodes_UI.indexOf(selected_node);
    nodes_UI.splice(index,1);
}

let connecting_node = false;
let connection_line = undefined;
let connection_node = undefined;
function add_connection(){
    if(selected_node == undefined) return;

    connection_line = new Line(selected_node,mouse);
    connection_node = selected_node;
    lines.push(connection_line);
    connecting_node = true;
    
    ctxMenu.classList.remove("visible");
    menu_open = false;
}


//Maybe add an editor / reader mode
//Better UI

function update(){
    ctx.clearRect(0,0,c.width,c.height);
    lines.forEach(line => line.draw());
    nodes_UI.forEach(node_UI => node_UI.update());  
}

setInterval(update,10);

draw_tree(current_tree);
load_node(nodes_UI[0]);

// add a save/load function to save the story
// add a front page for the stories
// add login to create a story
// add comments and reviews

const fs = require('fs');

const content = 'Some content!';

fs.writeFile('test.txt', content, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
