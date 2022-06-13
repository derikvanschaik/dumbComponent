function component(parent, template, data, methods){
    // HUGE ISSUE: SINCE THIS IS CONSTANTLY RESETING AND RERENDERING 
    // THE HTML, WE BASICALLY HAVE NO WAY TO HAVE INPUT VALUES WORK 
    // WE NEED A SOLN WHICH ONLY RERENDERS CERTAIN PARTS OF THE PARENT ELEMENT
    // NOT ALL OF IT !
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
                        }
                    })
                }
                // renders lists of this syntax: 
                // <h1 foreach="el in arrayName">let(el)</h1>
                if(child.getAttributeNames().includes("foreach")){
                    // too difficult if we allow this 
                    // all rendered items must be wrappe inside an element to make this logic simpler
                    if( child.parentNode === parent){

                        throw new Error(
                            "Error: found a " + child.tagName.toLowerCase()+ " element with a foreach loop but no parent "
        
                            )
                    }

                    const splitPattern = child.getAttribute("foreach").split(" in ")
                    const [elementName, arrayName] = splitPattern

                    data[arrayName].forEach(element =>{
                        const idx = child.textContent.indexOf("let("+ elementName + ")")
                        const el = document.createElement(child.tagName.toLowerCase())
                        el.textContent = child.textContent.slice(0, idx)
                            + element
                            + child.textContent.slice(
                            idx + elementName.length + "let()".length , child.textContent.length)
                        child.parentNode.appendChild(el)
                    })
                    child.parentNode.removeChild(child)
                }
                // recursively call on all children 
                render(child)
            }
        }
        render(parent)
    }
    
    
    // add events
    function addEvents(node){
      if(!node) return 
      for(const child of node.children){
        const attrs = child.getAttributeNames();
        const eventAttrs = ["click", "mouseenter", "input"]
        const events = attrs.filter(attr => eventAttrs.includes(attr))
       
        if(attrs.includes("if")){
            // using eval is dangerous but only thing I can think of right now...
            // mitigating danger by not evaluating the attribute but 
            // evaluating the key of the data which the user controls...
            const show = eval(data[child.getAttribute("if")])
            if(!show){
              node.removeChild(child)
            }
          }
          events.forEach( (event) => {
               child.addEventListener(event, function(e){
                   methods[child.getAttribute(event)](e)
                   render()
                   addEvents(parent) // not root but global parent
               })    
    
          })
          addEvents(child)
        }
    }
    return () => {
        render()
        addEvents(parent)
    }
}
export {component}

