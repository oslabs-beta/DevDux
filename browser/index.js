const svg = d3.select('svg');

const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = { top: 20, right: 90, bottom: 20, left: 90 };
const innerWidth = height - margin.top - margin.bottom;
const innerHeight = height * margin.top - margin.bottom;

const treeLayout = d3.tree() // creating tree map here.
    .size([height, innerWidth])

const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g') // g element is used to group things together 


const g = zoomG.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


svg.call(d3.zoom().on('zoom', () => {
    zoomG.attr('transform', d3.event.transform)
}))




// Recursive function that converts JSON data into an object that D3 expects (d3.hierarchy)
function createD3Obj(data) {
    if (typeof data === "string") { //base case 
        if (data.includes('.js') || data.includes('.ts')) { // Leaf node is a file path. 
            data = filePath(data);
        }
        return [{ // leaf node is not a file path, display data as is.
            "data": {
                "id": data
            },
            "children": []
        }];
    }

    let result = [];
    for (const key in data) {
        if (data[key].length === 0 || Object.keys(data[key]).length === 0) { // if the object or array is empty (aka imports/props/selected/etc), do nothing, and continue the loop
            continue;
        }
        let children = createD3Obj(data[key]); // since the obj or array has a value that we need to display, recursively call function and store result in variable
        let obj;

        if (parseInt(key) || key === "0") {
            obj = { "data": { "id": "" }, "children": children } // create obj with new information.
        } else {
            obj = { "data": { "id": key }, "children": children } // create obj with new information.
        }
        result.push(obj);
    }
    return result;
}

function filePath(file) { // change relative file path to display "/folderName/fileName" only.
    let newData = [];
    let slashCount = 0;
    for (let i = file.length - 1; i > 0; i--) {
        if (slashCount < 2) {
            if (file[i] === '/') {
                slashCount++;
                newData.push(file[i]);
            } else {
                newData.push(file[i]);
            }
        }
    }
    return newData.reverse().join('');
}



d3.json('../main/data/data.json') // fetch call to the JSON object
    .then(d => {
        const treeMapObj = createD3Obj(d);
        const data = {
            "data": {
                "id": "FlowChart",
            },
            "children": treeMapObj
        };

        let root = d3.hierarchy(data);

        const links = treeLayout(root).links(); //returns an array of object used for the linkeages between nodes
        const linkPathGenerator = d3.linkHorizontal()
            .x(function (d) { return d.y; })
            .y(function (d) { return d.x; });

        g.selectAll('path').data(links)  // path
            .enter().append('path')
            .attr('d', linkPathGenerator)

        g.selectAll('text').data(root.descendants()) // node
            .enter().append('text')
            .attr('x', function (d) { return d.y })
            .attr('y', function (d) { return d.x })
            .attr('dy', '0.32em')
            .attr('text-anchor', d => d.children ? 'middle' : 'start')
            .attr('font-size', '15px')
            .text(d => d.data.data.id)
    })

