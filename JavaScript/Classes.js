class Node {
    tree;
    //string
    description;
    title;
    
    //Nodes leading to that
    //{ Choice description , Node }
    childs = [];
    
    //int
    id;

    constructor(id,tree){
        this.tree = tree;

        this.id = id;
        this.title = "" + id;
        this.description = "This node does not have a description, id : " + id;
    }

    add_choice(node){
        this.childs.push(node);
        this.tree.nodes.push(node);
    }

    remove_choice(node){
        this.childs.splice(this.childs.indexOf(node),1);
        this.tree.nodes.splice(this.tree.nodes.indexOf(node),1);
    }
}

class Tree {
    //Array of nodes
    nodes = [];
    add_node(node){
        this.nodes.push(node);
    }
}

class Node_UI{
    node;
    x;
    y;
    radius = 20;
    color = "#18A813";
    childs = [];
    parents = [];
    lines = []

    constructor(node,x=0,y=0){
        this.node = node;
        this.x = x;
        this.y = y;
    }

    draw(){
        ctx.beginPath();
    
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    
        ctx.fillStyle = "black";
    
        ctx.fillText(this.node.id, this.x, this.y);
        ctx.stroke();
    }

    update(){
        if(selected_node == this){
            this.color = "#49FF42";
        }else{
            this.color = "#18A813";
        }

        this.draw();
    }

    is_mouse_on(){
        if((Math.abs(this.x - mouse.x) <= this.radius 
        && Math.abs(this.y - mouse.y) <= this.radius)){
            return true;
        }

        return false;
    }

    add_child(child){
        this.childs.push(child);
        this.node.add_choice(child.node);
    }

    remove_child(to_remove){

        for(let i = 0; i < this.lines.length ; i++){
            if(this.lines[i].node_to == to_remove){
                this.lines.splice(i,1);
            }
        }

        let index = this.childs.indexOf(to_remove);
        this.childs.splice(index,1);
        this.node.remove_choice(to_remove.node);
    }
}

class Line{
    node_from;
    node_to;

    constructor(from,to){
        this.node_from = from;
        this.node_to = to;
    }

    draw(){
        ctx.lineWidth = 3;

        ctx.moveTo(this.node_from.x, this.node_from.y);
        ctx.lineTo(this.node_to.x, this.node_to.y);
        ctx.stroke();
    }

}
