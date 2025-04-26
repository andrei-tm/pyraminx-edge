// Array representing the Pyraminx (28 values, 7 for each side)
// First 7: front face (original red)
// Next 7: right face (original yellow)
// Next 7: left face (original green)
// Last 7: bottom face (the corner red/yellow pointing up)
let pyraminx_solved = [
    'red', 'red', 'red', 'red', 'red', 'red', 'red',  // Side 1
    'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', // Side 2
    'green', 'green', 'green', 'green', 'green', 'green', 'green', // Side 3
    'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'  // Side 4
];

let initial_colors_top_swap = [
  'red', 'yellow', 'yellow', 'yellow', 'red','red', 'red',  // Side 1
  'yellow', 'green', 'green', 'green', 'yellow', 'yellow', 'yellow', // Side 2
  'green', 'red', 'red', 'red', 'green', 'green', 'green', // Side 3
  'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'  // Side 4       
];

let initial_colors = [
    'red', 'yellow', 'blue', 'blue', 'red', 'green', 'green',  // Side 1
    'yellow', 'green', 'blue', 'blue', 'yellow', 'blue', 'yellow', // Side 2
    'green', 'green', 'yellow', 'yellow', 'blue', 'red', 'green', // Side 3
    'blue', 'red', 'red', 'yellow', 'green', 'red', 'red'  // Side 4       
];

const right_up = [0, 22, 2, 3, 4, 26, 27, // 5, 6, 1 move to face 3
                  7, 12, 13, 8, 9, 10, 11,
                  14, 15, 16,  5, 6, 1, 20, // 17, 18, 19 move to face 4
                  21, 19 , 23, 24, 25, 17, 18]; // 22, 26, 27, move to face 1
const left_up = [0, 1, 2, 3, 4, 5, 6,
                 7, 8, 9, 10, 11, 12, 13,
                 14, 15, 16, 17, 18, 19, 20,
                 21, 22, 23, 24, 25, 26, 27];
const turn_right = [7, 8, 9, 10, 11, 12, 13,
                    14, 15, 16, 17, 18, 19, 20,
                    0, 1, 2, 3, 4, 5, 6,
                    21, 24, 25, 26, 27, 22, 23];

// Function to permute the Pyraminx colors
function permutePyraminx(pyraminx, rotation) {
    const shuffled = [...pyraminx];
    let print_string = "";
    for (let i = shuffled.length - 1; i >= 0; i--) {
        pyraminx[i] = shuffled[rotation[i]];
        print_string += pyraminx[i] + " ";
    }
    // console.log("new config " + print_string);
    return print_string;
}

let pyraminx = initial_colors.slice(); // Copy of the solved Pyraminx

let visited = new Map(); // Set to track visited configurations
let total = 0;
let found_solution = false;

function dfs(depth, solution = '') {
  if (found_solution) {
    return true; // Stop searching if a solution is found
  }
  // console.log("trying " + JSON.stringify(pyraminx));
  if (depth > 25) {
    return false; // Limit depth to 20
  }
  if (JSON.stringify(pyraminx) === JSON.stringify(pyraminx_solved)) {
    // found a solution r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r t r r t r t r r t r r t r r t r t r t t r r t r t r r t r t r t r t r r 
    // found a solution r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t r r t t r t r r t t r r t r t t r t t r t t r r t t r r t r r t r r t r t r r t r r t r r t
    console.log("found a solution " + solution);
    let textElement = document.getElementById('solutionTextElement');
    textElement.textContent = "Solution: " + solution;  
    found_solution = true;
    return true;
  }
  if (visited.has(JSON.stringify(pyraminx)) && visited.get(JSON.stringify(pyraminx)) <= depth) {
    // console.log("already visited " + JSON.stringify(pyraminx) + " at depth " + visited.get(JSON.stringify(pyraminx)));
    return false; // Already visited this configuration
  }
  visited.set(JSON.stringify(pyraminx), depth); // Mark this configuration as visited
  total++;
  if (total % 1000000 === 0) {
    console.log("total " + total);
  }

  permutePyraminx(pyraminx, right_up);
  dfs(depth + 1, solution + 'r ');
  // revert the last move
  permutePyraminx(pyraminx, right_up);
  dfs(depth + 1, solution + 'rr ');
  permutePyraminx(pyraminx, right_up);
  
  permutePyraminx(pyraminx, turn_right);
  dfs(depth + 1, solution + 't ');
  // revert the last move
  permutePyraminx(pyraminx, turn_right);
  dfs(depth + 1, solution + 'tt ');
  
  permutePyraminx(pyraminx, turn_right);
}

pyraminx = initial_colors.slice();

// Function to update the visible triangle
function updateTriangleView(sideIndex) {
    const startIndex = sideIndex * 7;
    const visibleColors = pyraminx.slice(startIndex, startIndex + 7);

    visibleColors.forEach((color, i) => {
        const part = document.getElementById(`part-${i}`);
        if (part) {
            part.setAttribute('fill', color); // Set the fill color
        }
    });
}

// Initialize with the first side
updateTriangleView(0);

function setText() {
    let textElement = document.getElementById('solutionTextElement');
    textElement.textContent = "Searching for solution...";
}

// Wait for the DOM to be fully loaded before running script
document.addEventListener('DOMContentLoaded', (event) => {

    // Get references to the buttons
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');
    const button4 = document.getElementById('button4');

    // Get a reference to a part of the SVG to manipulate (example)
    const topRhombus = document.getElementById('part-0');
    const centerTriangle = document.getElementById('part-6');

    // --- Define Actions for Buttons ---

    // Action for Button 1: Change color of the top rhombus
    button1.addEventListener('click', () => {
        permutePyraminx(pyraminx, right_up);
        updateTriangleView(0);
    });

    // Action for Button 2: Change color of the center triangle
    button2.addEventListener('click', () => {
        permutePyraminx(pyraminx, left_up);
        updateTriangleView(0);
    });

    // Action for Button 3: Reset colors (or another action)
    button3.addEventListener('click', () => {
        permutePyraminx(pyraminx, turn_right);
        updateTriangleView(0);
    });
    button4.addEventListener('click', () => {
      setText();
      dfs(0, '');
      console.log("total " + total);
    });

    // You can add more complex logic or interactions here
    console.log('Pyraminx Visualizer Ready!');

}); // End of DOMContentLoaded listener