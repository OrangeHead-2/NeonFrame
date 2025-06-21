/**
 * NeonFrame Visual State Editor
 * Allows visual creation and editing of state graphs for games.
 */
const canvas = document.getElementById('state-canvas');
const ctx = canvas.getContext('2d');
const inspector = document.getElementById('state-properties');
const status = document.getElementById('status');

let states = [];
let transitions = [];
let selectedState = null;
let draggingState = null;
let dragOffset = {x:0,y:0};
let addingTransition = null;

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw transitions
  ctx.strokeStyle = '#53f6';
  ctx.lineWidth = 3;
  transitions.forEach(tr => {
    const from = states.find(s => s.id === tr.from);
    const to = states.find(s => s.id === tr.to);
    if (from && to) {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      // Draw arrowhead
      const dx = to.x - from.x, dy = to.y - from.y;
      const len = Math.hypot(dx, dy);
      if (len > 0) {
        const ax = to.x - dx/len*20, ay = to.y - dy/len*20;
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(Math.atan2(dy, dx));
        ctx.beginPath();
        ctx.moveTo(0,0); ctx.lineTo(-8,-5); ctx.lineTo(-8,5); ctx.closePath();
        ctx.fillStyle = '#53f'; ctx.fill();
        ctx.restore();
      }
    }
  });

  // Draw states
  states.forEach(st => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(st.x, st.y, 36, 0, Math.PI*2);
    ctx.fillStyle = st === selectedState ? '#3131fa' : '#232359';
    ctx.shadowColor = '#3131fa';
    ctx.shadowBlur = st === selectedState ? 18 : 6;
    ctx.fill();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    // Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px Segoe UI';
    ctx.fillStyle = '#fff';
    ctx.fillText(st.name, st.x, st.y);
    ctx.restore();
  });

  if (addingTransition && addingTransition.from) {
    ctx.save();
    ctx.strokeStyle = '#9ff';
    ctx.setLineDash([8,4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(addingTransition.from.x, addingTransition.from.y);
    ctx.lineTo(addingTransition.to.x, addingTransition.to.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

function showInspector(state) {
  inspector.innerHTML = '';
  if (!state) return;
  const label = document.createElement('label');
  label.textContent = 'Name';
  const input = document.createElement('input');
  input.value = state.name;
  input.oninput = e => { state.name = input.value; render(); };
  label.appendChild(input);

  const label2 = document.createElement('label');
  label2.textContent = 'Description';
  const textarea = document.createElement('textarea');
  textarea.rows = 4;
  textarea.value = state.description || '';
  textarea.oninput = e => { state.description = textarea.value; };
  label2.appendChild(textarea);

  inspector.appendChild(label);
  inspector.appendChild(label2);
}

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  // Check for state click
  for (const st of states) {
    if (Math.hypot(mx - st.x, my - st.y) < 36) {
      draggingState = st;
      dragOffset.x = mx - st.x;
      dragOffset.y = my - st.y;
      selectedState = st;
      showInspector(st);
      render();
      // Shift+click to start transition
      if (e.shiftKey) {
        addingTransition = { from: st, to: {x:mx, y:my} };
      }
      return;
    }
  }
  selectedState = null;
  showInspector(null);
  render();
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if (draggingState) {
    draggingState.x = mx - dragOffset.x;
    draggingState.y = my - dragOffset.y;
    render();
  }
  if (addingTransition) {
    addingTransition.to = {x:mx, y:my};
    render();
  }
});

canvas.addEventListener('mouseup', e => {
  if (draggingState) draggingState = null;
  if (addingTransition) {
    // Find target state
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (const st of states) {
      if (st !== addingTransition.from && Math.hypot(mx - st.x, my - st.y) < 36) {
        transitions.push({from: addingTransition.from.id, to: st.id});
        break;
      }
    }
    addingTransition = null;
    render();
  }
});

document.getElementById('add-state').onclick = () => {
  const id = Math.random().toString(36).slice(2, 10);
  const state = {
    id,
    name: `State${states.length+1}`,
    x: 120 + states.length*80,
    y: 120 + states.length*80,
    description: ''
  };
  states.push(state);
  selectedState = state;
  showInspector(state);
  render();
};

document.getElementById('save').onclick = () => {
  const data = {
    states: states.map(s => ({id:s.id, name:s.name, x:s.x, y:s.y, description:s.description})),
    transitions
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "states.json";
  a.click();
  status.textContent = "Saved!";
  setTimeout(()=>status.textContent = '', 1200);
};

document.getElementById('load').onclick = () => {
  document.getElementById('loadfile').click();
};

document.getElementById('loadfile').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);
      states = data.states || [];
      transitions = data.transitions || [];
      selectedState = null;
      showInspector(null);
      render();
      status.textContent = "Loaded!";
      setTimeout(()=>status.textContent = '', 1200);
    } catch {
      status.textContent = "Load failed";
    }
  };
  reader.readAsText(file);
};

render();