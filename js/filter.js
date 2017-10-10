window.onload = function() {
    var img = document.getElementById('img');
    draw(img);
    // img.onload = function(elem) {
    //     draw(this);
    // };
};

var downloadbtn = document.getElementById('downloadbtn');
var downloadlink = document.getElementById('downloadlink');
downloadbtn.addEventListener('click', function() {
	var canvas = document.getElementById('canvas');
    var url = canvas.toDataURL('image/png');
    downloadlink.setAttribute('href', url);
    downloadlink.click();
});

function draw(img) {
    var canvas = document.getElementById('canvas');
    canvas.height = img.height;
    canvas.width = img.width;
    var ctx = canvas.getContext('2d');
    // ctx.drawImage(img,0,0);
    // img.style.display = "none";
    console.log("Let's Edit !");
    var fitImage = function() {
        var imageAspectRatio = img.width / img.height;
        var canvasAspectRatio = canvas.width / canvas.height;
        var renderableHeight, renderableWidth, xStart, yStart;
        // If image's aspect ratio is less than canvas's we fit on height
        // and place the image centrally along width
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = canvas.height;
            renderableWidth = img.width * (renderableHeight / img.height);
            xStart = (canvas.width - renderableWidth) / 2;
            yStart = 0;
        }
        // If image's aspect ratio is greater than canvas's we fit on width
        // and place the image centrally along height
        else if (imageAspectRatio > canvasAspectRatio) {
            renderableWidth = canvas.width;
            renderableHeight = img.height * (renderableWidth / img.width);
            xStart = 0;
            yStart = (canvas.height - renderableHeight) / 2;
        }
        // Happy path - keep aspect ratio
        else {
            renderableHeight = canvas.height;
            renderableWidth = canvas.width;
            xStart = 0;
            yStart = 0;
        }
        console.log(img);
        ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    };
    fitImage();
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var dataLen = data.length;
    var copydata = [];
    for (var i = dataLen - 1; i >= 0; i--) {
        copydata[i] = data[i];
    }
    var loop = function(callback, n) {
        n = n || 4;
        for (var i = dataLen - 1; i >= 0; i -= n) {
            callback(i);
        }
    };
    var invert = function(elem) {
        console.log(elem);
        loop(function(i) {
            data[i - 1] = 255 - data[i - 1]; //b
            data[i - 2] = 255 - data[i - 2]; //g
            data[i - 3] = 255 - data[i - 3]; //r
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var grayscale = function(elem) {
        loop(function(i) {
            // var avg = ( data[i-1] + data[i-2] + data[i-3] )/3;
            var avg = (0.229 * data[i - 1] + 0.587 * data[i - 2] + 0.114 * data[i - 3]);
            data[i - 1] = avg; //b
            data[i - 2] = avg; //g
            data[i - 3] = avg; //r
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var brighten = function(elem) {
        var value = parseInt(elem.dataset.value);
        loop(function(i) {
            data[i - 1] += value; //b
            data[i - 2] += value; //g
            data[i - 3] += value; //r
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var transparency = function(elem) {
        var value = parseInt(elem.dataset.value);
        value /= 100;
        value = 1 - value;
        loop(function(i) {
            data[i] *= value; //b
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var darken = function(elem) {
        var value = parseInt(elem.dataset.value);
        loop(function(i) {
            data[i - 1] -= value; //b
            data[i - 2] -= value; //g
            data[i - 3] -= value; //r
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var solarise = function(elem) {
        var value = parseInt(elem.dataset.value);
        loop(function(i) {
            data[i - 3] += value; //r
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var greenry = function(elem) {
        var value = parseInt(elem.dataset.value);
        loop(function(i) {
            data[i - 2] += value; //g
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var nightly = function(elem) {
        var value = parseInt(elem.dataset.value);
        loop(function(i) {
            data[i - 1] += value; //b
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var colorSwitch = function(elem) {
        var beforeValue = document.querySelector('#before').value;
        beforeValue = beforeValue.split(',');
        var afterValue = document.querySelector('#after').value;
        afterValue = afterValue.split(',');
        loop(function(i) {
            if (data[i - 1] == beforeValue[2] && data[i - 2] == beforeValue[1] && data[i - 3] == beforeValue[0]) {
                data[i] = afterValue[3] * 255; //a
                data[i - 1] = afterValue[2]; //b
                data[i - 2] = afterValue[1]; //g
                data[i - 3] = afterValue[0]; //r
            }
        });
        ctx.putImageData(imageData, 0, 0);
    };
    var restore = function(elem) {
        loop(function(i) {
            data[i] = copydata[i];
        }, 1);
        ctx.putImageData(imageData, 0, 0);
    };
    var editBtns = document.querySelector(".editBtns");
    editBtns.addEventListener("click", function(event) {
        var id = event.target.id;
        var elem = event.target;
        console.log(id);
        switch (id) {
            case 'invertbtn':
                invert(elem);
                break;
            case 'grayscalebtn':
                grayscale(elem);
                break;
            case 'brightenbtn':
                brighten(elem);
                break;
            case 'transparentbtn':
                transparency(elem);
                break;
            case 'darkenbtn':
                darken(elem);
                break;
            case 'solarisebtn':
                solarise(elem);
                break;
            case 'greenrybtn':
                greenry(elem);
                break;
            case 'nightlybtn':
                nightly(elem);
                break;
            case 'colorSwitchbtn':
                colorSwitch(elem);
                break;
            case 'restorebtn':
                restore(elem);
                break;
        }
    });
    // File upload feature
    function handleFiles(file) {
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            return;
        }
        var img = document.getElementById("img");
        var reader = new FileReader();
        reader.onload = (function() {
            return function(e) {
                img.src = e.target.result;
                draw(img);
            };
        })(img);
        reader.readAsDataURL(file);
    }
    document.querySelector('#load_file').addEventListener('change', function(e) {
        var files = this.files;
        for (var i = 0; i < files.length; i++) {
            handleFiles(files[i]);
        }
    }, false);
}
