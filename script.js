const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// Predefined graph
const nodes = ["A", "B", "C", "D", "E"];
const edges = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "D"],
    ["D", "E"]
];

// Build adjacency list
const adjacencyList = {};
nodes.forEach(node => adjacencyList[node] = []);
edges.forEach(([u, v]) => {
    adjacencyList[u].push(v);
    adjacencyList[v].push(u); // For undirected graph
});

function findShortestPath() {
    const startNode = document.getElementById("start").value;
    const endNode = document.getElementById("end").value;

    // Validate input
    if (!nodes.includes(startNode) || !nodes.includes(endNode)) {
        document.getElementById("result").innerHTML = "Invalid start or end node!";
        return;
    }

    // BFS to find the shortest path
    const queue = [[startNode, [startNode]]];
    const visited = new Set([startNode]);

    while (queue.length > 0) {
        const [currentNode, path] = queue.shift();

        if (currentNode === endNode) {
            const totalEdges = path.length - 1;
            const totalCost = totalEdges * 5;
            document.getElementById("result").innerHTML = `
                Shortest Path: ${path.join(" -> ")}<br>
                Total Cost: ${totalCost}
            `;
            drawGraph(path);
            return;
        }

        for (const neighbor of adjacencyList[currentNode]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }

    document.getElementById("result").innerHTML = "No path found!";
    drawGraph();
}

function drawGraph(highlightPath = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Node positions
    const nodePositions = {};
    const radius = 20;
    const angleStep = (2 * Math.PI) / nodes.length;

    nodes.forEach((node, index) => {
        const x = canvas.width / 2 + 100 * Math.cos(angleStep * index);
        const y = canvas.height / 2 + 100 * Math.sin(angleStep * index);
        nodePositions[node] = { x, y };
    });

    // Draw edges
    edges.forEach(([u, v]) => {
        const { x: x1, y: y1 } = nodePositions[u];
        const { x: x2, y: y2 } = nodePositions[v];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    });

    // Highlight shortest path edges
    for (let i = 0; i < highlightPath.length - 1; i++) {
        const u = highlightPath[i];
        const v = highlightPath[i + 1];
        const { x: x1, y: y1 } = nodePositions[u];
        const { x: x2, y: y2 } = nodePositions[v];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Draw nodes
    nodes.forEach(node => {
        const { x, y } = nodePositions[node];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = highlightPath.includes(node) ? "red" : "#007bff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px Arial";
        ctx.fillText(node, x, y);
    });
}

drawGraph();