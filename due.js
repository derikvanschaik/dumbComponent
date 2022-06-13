function component(parent, template, data, methods){
    const dataToNodesMapper = {}
    let dataBefore = {}
    Object.assign(dataBefore, data)

    function render(){

        parent.innerHTML = template;
        // recursive function that renders all variables embedded in 
        // template text content (like this <h1>let(variable)</h1>)
        // that was in user defined data object
        function render(node){
            if(!node) return

            for(const child of node.children){

                if(child.textContent.length > 0){
                    Object.keys(data).forEach(key =>{  
                        const idx = child.textContent.indexOf("let("+ key+ ")")
                        if(idx !== -1){
                            child.textContent = child.textContent.slice(0, idx)
                            + data[key]
                            + child.textContent.slice(
                            idx + key.length + "let()".length , child.textContent.length)
                            if (!dataToNodesMapper[key]){
                                dataToNodesMapper[key] = []
                            }
                            // here we can add data about how the textcontent should
                            // be structured...
                            dataToNodesMapper[key].push(child) 
                        }
                    })
                }
                // recursively call on all children 
                render(child)
            }
            
        }
        render(parent)
    }
    function addEvents(node){
        if(!node) return 

        for(const child of node.children){
            if(child.getAttributeNames().includes("input")){
                child.addEventListener("input", function(e){
                    // gets and calls function 
                    methods[child.getAttribute("input")](e)
                    // checks if any data has changed 
                    Object.keys(data).forEach(key => {
                        if(dataBefore[key] !== data[key]){
                            // update all dom element textcontent
                            dataToNodesMapper[key].forEach(node =>{
                                node.textContent = data[key];
                            })
                        }
                    })
                    // reassign data 
                    Object.assign(dataBefore, data)
                })

            }
            addEvents(child) 
        }
    }
    
    
   
    return () => {
        render()
        addEvents(parent)
    }
}
export {component}

