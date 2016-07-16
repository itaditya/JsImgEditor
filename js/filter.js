var img = document.getElementById('img');
img.onload = function() {
	draw(this);
};

function draw(img) {
	var canvas = document.getElementById('canvas');
	var url = canvas.toDataURL('image/png');

	canvas.height = img.height;
	canvas.width = img.width;

	var ctx = canvas.getContext('2d');
	ctx.drawImage(img,0,0);
	// img.style.display = "none";

	var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	var data = imageData.data;

	console.log("Let's Edit !");

	var copydata = []; 
	for (var i = data.length - 1; i >= 0; i--) {
		copydata[i] = data[i];
	};

	var invert = function() {
		for (var i = data.length - 1; i >= 0; i-=4) {
			data[i-1] = 255 - data[i-1];         //b
			data[i-2] = 255 - data[i-2];         //g
			data[i-3] = 255 - data[i-3];         //r

		}
		ctx.putImageData(imageData,0,0);
	};

	var grayscale = function() {
		for (var i = data.length - 1; i >= 0; i-=4) {

			// var avg = ( data[i-1] + data[i-2] + data[i-3] )/3;

			var avg = ( 0.229*data[i-1] + 0.587*data[i-2] + 0.114*data[i-3] );

			data[i-1] = avg;         //b
			data[i-2] = avg;         //g
			data[i-3] = avg;         //r

		}
		ctx.putImageData(imageData,0,0);
		url = canvas.toDataURL('image/png');
		console.log(url);

	};

	var brighten = function() {

		var value = parseInt(this.dataset.value);

		for (var i = data.length - 1; i >= 0; i-=4) {


			data[i-1] += value;         //b
			data[i-2] += value;         //g
			data[i-3] += value;         //r

		}
		ctx.putImageData(imageData,0,0);
	};

	var transparency = function() {

		var value = parseInt(this.dataset.value);

		value /= 100;
		value = 1 - value;

		for (var i = data.length - 1; i >= 0; i-=4) {
			data[i] *= value;         //b
		}
		ctx.putImageData(imageData,0,0);
	};

	var darken = function() {

		var value = parseInt(this.dataset.value);

		for (var i = data.length - 1; i >= 0; i-=4) {


			data[i-1] -= value;         //b
			data[i-2] -= value;         //g
			data[i-3] -= value;         //r

		}
		ctx.putImageData(imageData,0,0);
	};
	var solarise = function() {

		var value = parseInt(this.dataset.value);

		for (var i = data.length - 1; i >= 0; i-=4) {
			data[i-3] += value;         //r
		}
		ctx.putImageData(imageData,0,0);
	};

	var greenry = function() {

		var value = parseInt(this.dataset.value);

		for (var i = data.length - 1; i >= 0; i-=4) {
			data[i-2] += value;         //g
		}
		ctx.putImageData(imageData,0,0);
	};

	var nightly = function() {

		var value = parseInt(this.dataset.value);

		for (var i = data.length - 1; i >= 0; i-=4) {
			data[i-1] += value;         //b
		}
		ctx.putImageData(imageData,0,0);
	};

	var colorSwitch = function() {

		var beforeValue = document.querySelector('#before').value;
		beforeValue = beforeValue.split(',');

		var afterValue = document.querySelector('#after').value;
		afterValue = afterValue.split(',');

		console.log(data[0]/256,data[1]/256,data[2]/256);
		for (var i = data.length - 1; i >= 0; i-=4) {
			if(data[i-1] == beforeValue[2] && data[i-2] == beforeValue[1] && data[i-3] == beforeValue[0]) {
				data[i-1] = afterValue[2];         //b
				data[i-2] = afterValue[1];         //g
				data[i-3] = afterValue[0];         //r
			}

		}
		ctx.putImageData(imageData,0,0);
	};

	var restore = function() {          // working now

		for (var i = data.length - 1; i >= 0; i--) {
			data[i] = copydata[i] ;
		}

		ctx.putImageData(imageData,0,0);
	};

	var invertbtn = document.getElementById('invertbtn');
	invertbtn.addEventListener('click',invert);

	var grayscalebtn = document.getElementById('grayscalebtn');
	grayscalebtn.addEventListener('click',grayscale);

	var brightenbtn = document.getElementById('brightenbtn');
	brightenbtn.addEventListener('click',brighten);

	var transparentbtn = document.getElementById('transparentbtn');
	transparentbtn.addEventListener('click',transparency);

	var darkenbtn = document.getElementById('darkenbtn');
	darkenbtn.addEventListener('click',darken);

	var solarisebtn = document.getElementById('solarisebtn');
	solarisebtn.addEventListener('click',solarise);

	var greenrybtn = document.getElementById('greenrybtn');
	greenrybtn.addEventListener('click',greenry);

	var nightlybtn = document.getElementById('nightlybtn');
	nightlybtn.addEventListener('click',nightly);

	var colorSwitchbtn = document.getElementById('colorSwitchbtn');
	colorSwitchbtn.addEventListener('click',colorSwitch);

	var restorebtn = document.getElementById('restorebtn');
	restorebtn.addEventListener('click',restore);

	var downloadbtn = document.getElementById('downloadbtn');
	downloadbtn.setAttribute('href',url);
}

// File upload feature

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /^image\//;
    
    if (!imageType.test(file.type)) {
      continue;
    }
    
    var img = document.createElement("img");
    img.classList.add("obj");
    img.setAttribute('id','img')
    img.file = file;

    document.querySelector('#img-container').removeChild(document.querySelector('#img')); 

    document.querySelector('#img-container').appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

    img.onload = function() {
      draw(this);
    };
    
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
}

document.querySelector('#load_file').addEventListener('change', function (e) {
     handleFiles(this.files);
}, false);