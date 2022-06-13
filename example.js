import { component } from "./due.js";

const parent = document.querySelector("#root")
const template = `
        <h1>let(message)</h1>
        <input value="let(message)" />
        <input value="let(message)" />
        <button click="resetMessage" >Reset Message</button>
        `
const data = {
    message: '',
    checkboxValue : true, 
}
const methods = {
    resetMessage: function(){
        data.message = ''
    }
}
const dueApp = new component(parent, template,data, methods)

dueApp()
