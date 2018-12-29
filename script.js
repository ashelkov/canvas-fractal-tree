(function() {
  window.onload = init;

  const PI = Math.PI;

  function init() {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('click', init);
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const options = {
      maxDepth: 7,
      maxNodes: 5,
      spread: 1.75,
      colority: Math.random() * 240 - 120,
    };

    drawTree(
      ctx,
      {
        length: (HEIGHT / 3.8) | 0,
        angle: 1.5 * PI,
        point: [WIDTH / 2, HEIGHT],
        nodes: [],
        depth: 0,
      },
      options,
    );
  }

  function drawTree(ctx, root, options) {
    const stack = [root];
    do {
      const branch = stack.shift();
      drawBranch(ctx, branch, options);
      createSubNodes(branch, options);
      stack.push(...branch.nodes);
    } while (stack.length);
  }

  function drawBranch(ctx, node, { maxDepth, colority }) {
    const {
      length,
      point: [x1, y1],
      angle,
      depth,
    } = node;
    ctx.moveTo(x1, y1);
    const x2 = x1 + length * Math.cos(angle);
    const y2 = y1 + length * Math.sin(angle);
    ctx.globalAlpha = 0.6;
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#FFF';
    ctx.stroke();
    node._point2 = [x2, y2];

    if (depth >= maxDepth - 4) {
      ctx.beginPath();
      ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${(angle / PI) * colority}, 100%, 50%)`;
      ctx.fill();
      ctx.closePath();
    }
  }

  function createSubNodes(parent, { maxDepth, maxNodes, spread }) {
    if (parent.depth === maxDepth) return (parent.nodes = []);

    const count = Math.round(Math.random() * (maxNodes - 2)) + 2;
    parent.nodes = Array(count)
      .fill()
      .map((node) => ({
        parent,
        point: parent._point2,
        length: Math.round(parent.length * 0.75),
        angle: parent.angle + (Math.random() * spread - spread / 2),
        depth: parent.depth + 1,
      }));
  }
})();
