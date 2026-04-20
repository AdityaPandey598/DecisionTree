const state = {
  signals: {},
  answers: {}
};

let treeData = null;
let currentNodeId = null;

const contentDiv = document.getElementById('content');

async function init() {
  try {
    const response = await fetch('./reflection-tree.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    treeData = Array.isArray(data) ? data[0] : data;

    currentNodeId = treeData.startNode;
    renderNode();
  } catch (error) {
    console.error('Failed to load reflection-tree.json:', error);
    contentDiv.innerHTML = '<p style="color: #ef4444;">Error loading reflection data. If you are opening this via <code>file://</code> protocol, modern browsers may block the fetch request due to CORS. Please serve this folder using a local web server (e.g., <code>npx http-server</code> or <code>python -m http.server</code>).</p>';
    contentDiv.classList.add('visible');
  }
}

function renderNode() {
  const node = treeData.nodes[currentNodeId];
  if (!node) {
    console.error(`Node ${currentNodeId} not found`);
    return;
  }

  // Handle decisions silently
  if (node.type === 'decision') {
    handleDecision(node);
    return;
  }

  // Fade out current content
  contentDiv.classList.remove('visible');

  setTimeout(() => {
    let html = '';
    const text = interpolateText(node.text);

    html += `<div class="node-text">${text}</div>`;
    html += `<div class="button-container">`;

    if (node.type === 'start' || node.type === 'bridge' || node.type === 'reflection' || node.type === 'summary') {
      html += `<button class="primary" onclick="advance('${node.next}')">Continue</button>`;
    } else if (node.type === 'question') {
      node.options.forEach((option, index) => {
        html += `<button onclick="handleOption(${index})">${option.label}</button>`;
      });
    } else if (node.type === 'end') {
      // No buttons rendered for end state
    }

    html += `</div>`;
    contentDiv.innerHTML = html;

    // Fade in new content
    contentDiv.classList.add('visible');
  }, 400); // Wait for fade out transition
}

function interpolateText(text) {
  if (!text) return '';
  return text.replace(/\{([^}]+)\}/g, (match, key) => {
    // e.g. key = "Q1_START.answer"
    const parts = key.split('.');
    if (parts.length === 2 && parts[1] === 'answer') {
      return state.answers[parts[0]] || `[Missing: ${key}]`;
    }
    return match;
  });
}

window.advance = function (nextNodeId) {
  currentNodeId = nextNodeId;
  renderNode();
};

window.handleOption = function (optionIndex) {
  const node = treeData.nodes[currentNodeId];
  const option = node.options[optionIndex];

  // 1. Add signals
  for (const [key, value] of Object.entries(option.signals)) {
    state.signals[key] = (state.signals[key] || 0) + value;
  }

  // 2. Save answer text using the storeAs key
  state.answers[option.storeAs] = option.label;

  // 3. Advance to the target node
  currentNodeId = option.target;
  renderNode();
};

function handleDecision(node) {
  let target = null;

  // Provide a safe proxy around the signals to default missing values to 0
  const safeState = new Proxy(state.signals, {
    get(targetObj, prop) {
      return prop in targetObj ? targetObj[prop] : 0;
    }
  });

  for (const condition of node.conditions) {
    if (condition.if === 'default') {
      target = condition.target;
      break;
    } else {
      try {
        // Evaluate condition safely
        const evaluate = new Function('state', `return ${condition.if};`);
        if (evaluate(safeState)) {
          target = condition.target;
          break;
        }
      } catch (e) {
        console.error('Error evaluating condition:', condition.if, e);
      }
    }
  }

  if (target) {
    currentNodeId = target;
    renderNode();
  } else {
    console.error('Decision node did not resolve to a target:', node);
  }
}

// Start the engine
document.addEventListener('DOMContentLoaded', init);
