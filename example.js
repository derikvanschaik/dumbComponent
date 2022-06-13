import { component } from "./due.js";

const parent = document.querySelector("#root")
const template = `
        <h1>number of elements: let(elementCount)</h1>
        <button click="addElement">Add element</button>
        <ul>
            <li foreach="e in arr" >let(e)</li>
        </ul>
        `
const data = {
    elementCount: 0,
    arr: [],
    val: 'hey',
}
const methods = {
    addElement: function(){
        data.arr.push(data.val)
        data.elementCount++
    }
}
const dueApp = new component(parent, template,data, methods)

dueApp()
