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
                // parses and replaces variables embedded in textcontent
                // there is a bug here: if I have <h1>my count is: let(count)</h2>
                // it will initially render the textcontent as <h1>my count is 0</h1>
                // but later on when we add the events and this count variable is changed 
                // it will simply render the count variable and not the accompanying text
                if(child.textContent.length > 0 && child.children.length === 0){
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
                if(child.value){
                    // user is doing a 'v-model' type bind (we use notation <input value="let(yourvar)" />)
                    if(child.value.includes("let(")){

                        Object.keys(data).forEach(key =>{  
                            const idx = child.value.indexOf("let("+ key+ ")")
                            if(idx !== -1){
                                child.value = data[key];
                                if (!dataToNodesMapper[key]){
                                    dataToNodesMapper[key] = []
                                }
                                dataToNodesMapper[key].push(child)
                                // two way binding
                                child.addEventListener("input", (e) =>{

                                    data[key] = e.target.value;
                                    dataToNodesMapper[key].forEach(node =>{
                                        if(node.tagName.toLowerCase() === "input"){
                                            node.value = data[key];
                                        }else{
                                            node.textContent = data[key];
                                        }
                                    })
                                    // reassign data 
                                    Object.assign(dataBefore, data)
                                })
                            }
    
                        })
    
                    }
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
            const events = ['click', 'input']
            const attrEvents = child.getAttributeNames().filter(attr => events.includes(attr))
            attrEvents.forEach( event =>{
                
                child.addEventListener(event, function(e){
                    // gets and calls function 
                    methods[child.getAttribute(event)](e)
                    // checks if any data has changed 
                    Object.keys(data).forEach(key => {
                        if(dataBefore[key] !== data[key]){
                            // update all dom element textcontent
                            dataToNodesMapper[key].forEach(node =>{
                                if(node.tagName.toLowerCase() === "input"){
                                    node.value = data[key];
                                }else{
                                    node.textContent = data[key];
                                }
                            })
                        }
                    })
                    // reassign data 
                    Object.assign(dataBefore, data)
                })
            })

            addEvents(child) 
        }
    }
    
    
   
    return () => {
        render()
        addEvents(parent)
        // this is how we listen for changes that aren't in traditional event listeners
        // for example in a setTimeout call that modifies data
        document.addEventListener("data-change", function(e){
            
                e.detail.forEach(dataKey =>{
                    dataToNodesMapper[dataKey].forEach(node =>{
                    if(node.tagName.toLowerCase() === "input"){
                        node.value = data[dataKey];
                    }else{
                        node.textContent = data[dataKey];
                    }
                })
                })
            // reassign data 
            Object.assign(dataBefore, data)
            
        })

    }
}
function dispatch(dataVars){
    document.dispatchEvent(new CustomEvent("data-change", {detail: dataVars}))
}

export {component, dispatch }

