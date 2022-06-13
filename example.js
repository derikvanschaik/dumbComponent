import { component } from "./due.js";

const parent = document.querySelector("#root")
const template = `
        <h1>let(message)</h1>
        <input input="setMessage" />
        `
const data = {
    message: ''
}
const methods = {
    setMessage: function(e){
        data.message = e.target.value;
    }
}
const dueApp = new component(parent, template,data, methods)

dueApp()
