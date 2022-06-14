import { component , dispatch } from "./due.js";

const parent = document.querySelector("#root")
const template = `
        <h1>let(count)</h1>
        <h2>let(name)</h2>
        `
const data = {
    count: 0,
    name: 'jeff',
}
// this is how we notify the framework what we change not in event handlers...
setInterval(() =>{
    const names = ['jeff', 'alex', 'mary', 'susan', 'tyler']
    data.count++;
    data.name = names[(data.count % names.length)]
    // need to let framework know what we are modifying by using the dispatch function
    dispatch(["count", "name"])
}, 1000)
const dueApp = new component(parent, template,data, {})

dueApp()
