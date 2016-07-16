var image =document.getElementById('image');
console.log(image);
var imageManipulationCanvas = document.getElementById('crop-canvas');  
var imageManipulationCtx = imageManipulationCanvas.getContext('2d');  

window.onload = function () {
	imageManipulationCanvas.height = image.height;  
	imageManipulationCanvas.width = image.width;  
	imageManipulationCtx.drawImage(image, 0, 0); // Draw image on temporary canvas  
	var myImageData = imageManipulationCtx.getImageData(0, 0, image.width, image.height); // Parameters are left, top, width and height  
	console.log(imageManipulationCanvas);
	console.log(myImageData);
	console.log(myImageData.data.length);
	// console.log(toDataUrl(myImageData));
	myImageData.data = print_data(myImageData.data);
	console.log(myImageData.data[myImageData.data.length-1]);


}
function print_data(data) {
	console.log(data.length);

	for (var i = 0; i < data.length; i+=4) {
			var r = data[i];
		    var g = data[i+1];
		    var b = data[i+2];
		    // CIE luminance for the RGB
		    // The human eye is bad at seeing red and blue, so we de-emphasize them.
		    var v = 0.2126*r + 0.7152*g + 0.0722*b;
		    data[i] = data[i+1] = data[i+2] = v
	}
	return data;
}
function pick(event) {
	var x = event.layerX;
	var y = event.layerY;
	var pixel = imageManipulationCtx.getImageData(x,y,1,1);
	var data = pixel.data;
	var rgba = 'rgba('+data[0]+','+data[1]+','+data[2]+','+data[3]+')';
	var pallete = document.getElementById('pallete');
	pallete.style.background = rgba;
	pallete.style.color = '#fff';
	pallete.textContent = rgba;
}
imageManipulationCanvas.addEventListener('mousemove',pick);