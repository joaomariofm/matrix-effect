document.addEventListener("DOMContentLoaded",() => {
  var canvas: HTMLCanvasElement | null;
  var context: CanvasRenderingContext2D | null;

  // Trying to get the canvas
  canvas = document.querySelector('#matrix');

  if (canvas == null) 
    return console.log("could not build canvas element!");

  //Setting up canvas dimensions
  if (canvas.parentElement) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      if (canvas) {
        canvas.width = entries[0].borderBoxSize[0].inlineSize;
        canvas.height = entries[0].borderBoxSize[0].blockSize;
      }
    });

    resizeObserver.observe(canvas.parentElement);
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Trying to build context
  context = canvas.getContext("2d");

  if (context == null) 
    return console.log("could not build context element!");

  // Setting up the background color
  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Setting up the characters
  var letters = '!@#$%¨&*()_+-=/?123456789ABCDEFGHIJKLMNOPQRSTUVWYXZ';

  // Setting up the columns, lines and characters font size
  var fontSize = 12;
  var columns = Math.floor(canvas.width / fontSize);
  var lines = canvas.height / fontSize;

  context.font = `${fontSize}px Arial`
  const dropsLength = 50;
  const dropsSpeeds = [ 50, 60, 70, 80, 90 ];

  // Setting up the drops
  interface drop {
    isDropping: boolean;
    currentX: number;
    elements: Array<string>;
    speed: number;
  }

  var drops: Array<drop>;
  drops = [];

  async function delay(time: number) {
    await new Promise(resolve => {
      return setTimeout(resolve, time);
    })
  }

  function setDrops()  {
    for (var i = 0; i < columns; i++) {
      var drop = {
        isDropping: false,
        currentX: -1,
        elements: [],
        speed: 0
      }

      drops.push(drop);
    }
  }

  function thereIsAvailableDropSpaces() {
    for (var i = 0; i < drops.length; i++) {
      if(!drops[i].isDropping)
        return true;
    }

    return false;
  }

  function columnIsInUse(column: number) {
    if (drops[column].isDropping)
      return true;

    return false;
  }
  
  function createDrop(column: number, elements: Array<string>) {
    drops[column] = { isDropping: true, elements, currentX: 1, speed: dropsSpeeds[Math.floor(Math.random() * dropsSpeeds.length)]} 
  }
  
  async function dropsControl() {
    if (!thereIsAvailableDropSpaces()) 
      return;

    var column = 0;

    do {
      column = Math.floor(Math.random() * columns);
    } while (columnIsInUse(column))

    var elements: Array<string>
    elements = []

    // Randomly populate the elements array
    for (var i = 0; i < lines; i++) {
      elements.push(letters[Math.floor(Math.random() * letters.length)])
    }

    createDrop(column, elements);
    startDrop(drops[column], column);
  }

  async function startDrop(drop: drop, column: number) {
    for(var i = 0; i < drop.elements.length + dropsLength; i++) {
      await delay(drop.speed);
      drop.currentX++;
    }

    //remover drop do array de drops
    drops[column].isDropping = false;
    return;
  }

  function renderDrop(drop: drop, column: number) {
    for(var i = 1; i < drop.elements.length; i++) {
      if (context) {
        if (i > drop.currentX - dropsLength) {
          context.fillStyle = 'rgba(101, 163, 13, 1)';

          if (i === drop.currentX) {
            context.fillStyle = `rgba(236, 252, 203, 1)`;
          }

          if (i < (drop.currentX - dropsLength/2) && i >  drop.currentX - (dropsLength - (dropsLength/10 * 4))) {
            context.fillStyle = 'rgba(101, 163, 13, 0.8)';
          }

          if (i <=  drop.currentX - (dropsLength - (dropsLength/10 * 4)) && i >  drop.currentX - (dropsLength - (dropsLength/10 * 3))) {
            context.fillStyle = 'rgba(101, 163, 13, 0.6)';
          }

          if (i <= drop.currentX - (dropsLength - (dropsLength/10 * 3)) && i >  drop.currentX - (dropsLength - (dropsLength/10 * 2))) {
            context.fillStyle = 'rgba(101, 163, 13, 0.4)';
          }

          if (i <=  drop.currentX - (dropsLength - (dropsLength/10 * 2)) && i >  drop.currentX - (dropsLength - (dropsLength/10 * 1))) {
            context.fillStyle = 'rgba(101, 163, 13, 0.2)';
          }

          if (i <= drop.currentX - (dropsLength - (dropsLength/10 * 1))) {
            context.fillStyle = 'rgba(101, 163, 13, 0.01)';
          }
          
          context.fillText(drop.elements[i], column * fontSize, i * fontSize);
        }

        if (i === drop.currentX) 
          break;
      }
    }
  }

  function renderScreen() {
    if(context && canvas) {
      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    for(var i = 0; i < drops.length; i++) {
      if (drops[i].isDropping) {
        renderDrop(drops[i], i);
      }
    }
  }

  function matrix() {
    dropsControl();
  }

  setDrops();
  setInterval(matrix, 60);
  setInterval(renderScreen, 10);
});