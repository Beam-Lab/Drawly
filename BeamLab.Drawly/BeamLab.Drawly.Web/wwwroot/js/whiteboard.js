$(document).ready(function () {

    $('#ShareUrl').val(document.URL);

    $('#shareButton').click(function () {

        var copyText = document.getElementById("ShareUrl");

        copyText.select();
        document.execCommand("copy");

        alert("Your whiteboard url is on your clipboard");
    });

});

var mirror = document.getElementById('preview');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasx = $(canvas).offset().left;
var canvasy = $(canvas).offset().top;
var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;
var tooltype = 'draw';

$(canvas).on('mousedown', function (e) {
    last_mousex = mousex = parseInt(e.clientX - canvasx + document.documentElement.scrollLeft);
    last_mousey = mousey = parseInt(e.clientY - canvasy + document.documentElement.scrollTop);
    mousedown = true;
});

$(canvas).on('mouseup', function (e) {
    mousedown = false;

    UpdatePreview();
});

var drawCanvas = function (prev_x, prev_y, x, y, clr, sz) {
    ctx.beginPath();
    console.log("X: " + x + " Y: " + y);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = clr;
    ctx.lineWidth = sz;
    ctx.moveTo(prev_x, prev_y);
    ctx.lineTo(x, y);
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.stroke();
};

$(canvas).on('mousemove', function (e) {
    mousex = parseInt(e.clientX - canvasx + document.documentElement.scrollLeft);
    mousey = parseInt(e.clientY - canvasy + document.documentElement.scrollTop);

    var clr = $('select[id=color]').val();
    var sz = $('select[id=size]').val();

    if ((last_mousex > 0 && last_mousey > 0) && mousedown) {
        drawCanvas(mousex, mousey, last_mousex, last_mousey, clr, sz);
        connection.invoke('draw', tooltype, last_mousex, last_mousey, mousex, mousey, clr, sz);
    }

    last_mousex = mousex;
    last_mousey = mousey;
    // $('#output').html('current: ' + mousex + ', ' + mousey + '<br />last: ' + last_mousex + ', ' + last_mousey + '<br />mousedown: ' + mousedown);
});

var mouse_down = false;

var connection = new signalR.HubConnectionBuilder()
    .withUrl('/draw')
    .build();

function DrawBackground()
{
    var base_image = new Image();
    base_image.src = 'https://media.istockphoto.com/vectors/santa-claus-christmas-fling-sleigh-sled-reindee-vector-id1030835344?s=2048x2048';
    base_image.onload = function () {
        ctx.drawImage(base_image, 0, 0);
    };
}

DrawBackground();

connection.on('Draw', function (prev_x, prev_y, x, y, clr, sz) {
    drawCanvas(prev_x, prev_y, x, y, clr, sz);
});

connection.on('updateonlineusers', function (onlineusers) {
    $("#onlineusers").html(onlineusers);
});

connection.start().then(function () {
    connection.invoke('joinwhiteboard', GetQuerystringParameter("whiteboard"));
});

clearMousePositions = function () {
    last_mousex = 0;
    last_mousey = 0;
};

function UpdatePreview() {
    var dataURL = canvas.toDataURL('image/png');
    mirror.src = dataURL;
}

dragElement(document.getElementById("toolbar"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    //document.getElementById("toolbar").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var button = document.getElementById('btn-download');
button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
});

var buttonClear = document.getElementById('btn-clear');
buttonClear.addEventListener('click', function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    UpdatePreview();
});

function GetQuerystringParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get(name);

    return param;
}