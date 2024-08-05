// Drag
interact(".resize-drag").draggable({
  onstart(e) {
    if (!e.target.posX) e.target.posX = 0;
    if (!e.target.posY) e.target.posY = 0;
  },
  onmove(e) {
    e.target.posX += e.dx;
    e.target.posY += e.dy;
    e.target.style.transform = `translate(${e.target.posX}px, ${e.target.posY}px)`;
  },
});

// 移動するjs
interact(".resize-drag").draggable({
  onmove: function (event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    var container = document.getElementById("textareaContainer");
    var containerRect = container.getBoundingClientRect();

    if (x < 0) {
      x = 0;
    } else if (x + target.offsetWidth > containerRect.width) {
      x = containerRect.width - target.offsetWidth;
    }

    if (y < 0) {
      y = 0;
    } else if (y + target.offsetHeight > containerRect.height) {
      y = containerRect.height - target.offsetHeight;
    }

    target.style.transform = "translate(" + x + "px, " + y + "px)";
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  },
});

interact(".resize-drag").resizable({
  edges: { left: true, right: true, bottom: true, top: true },
  listeners: {
    move(event) {
      var target = event.target;
      var x = parseFloat(target.getAttribute("data-x")) || 0;
      var y = parseFloat(target.getAttribute("data-y")) || 0;

      target.style.width = event.rect.width + "px";
      target.style.height = event.rect.height + "px";

      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.transform = "translate(" + x + "px," + y + "px)";

      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    },
  },
  modifiers: [
    interact.modifiers.restrictEdges({
      outer: "parent",
    }),
    interact.modifiers.restrictSize({
      min: { width: 100, height: 50 },
    }),
  ],
  inertia: true,
});
