(function(){
	"use strict";

	var localMediaStream, video, ctx, canvas;
	var bgCanvas, bgContext;
	var w,h,ratio;

	window.$ = function(expr, con) {
		var selected = [].slice.call((con || document).querySelectorAll(expr));
		return selected.length==1?selected[0]:selected;
	}

	window.requestAnimationFrame = (function(){
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var onFailSoHard = function(e) {
		console.log('Reeeejected!', e);
	};

	var old_draw = function(){
		window.requestAnimationFrame(draw);
		if (localMediaStream) {
			bgContext.drawImage(video, 0, 0, w, h);
			var pixelData = bgContext.getImageData(0, 0, w, h);
			//console.log(pixelData.data.length);
			for (var i = 0; i < pixelData.data.length; i+=4 ) {
				var r = pixelData.data[i]/255;
				var g = pixelData.data[i+1]/255;
				var b = pixelData.data[i+2]/255;
				var found = 0;
				var distance_from_target = r*(1-b)*(1-g);

				var found = distance_from_target>0.35?255:0;

				pixelData.data[i+0] = found;
				pixelData.data[i+1] = found;
				pixelData.data[i+2] = found;
			}
			ctx.putImageData(pixelData, 0, 0);
		}
	};

	var slitScanLine = 0;
	var frame = 0;

	var draw = function(){
		window.requestAnimationFrame(draw);
		if (localMediaStream) {

			var SL = (slitScanLine++)%w

			ctx.drawImage(video, SL, 0, 1, h, SL,0,1,h);
			/*var pixelDataSrc = bgContext.getImageData(0, (slitScanLine++)%h, w, 1);
			var pixelDataDst = ctx.getImageData(0,0,w,h);
			for (var i=0; i<pixelDataSrc.data.length; i+=4) {
				var r = pixelDataSrc.data[i+0];
				var g = pixelDataSrc.data[i+1];
				var b = pixelDataSrc.data[i+2];

				pixelDataDst.data[3*slitScanLine+i+0] = r;
				pixelDataDst.data[3*slitScanLine+i+1] = g;
				pixelDataDst.data[3*slitScanLine+i+2] = b;
			}//*/

			/*if (slitScanLine%w == 0) {
				console.log("Complete frame: "+(frame++));
				console.log("ScanLineSize: "+pixelDataSrc.data.length/4);
				console.log("DestSize: "+pixelDataDst.data.length/4);
				console.log("Width: "+w+" Height: "+h);
			}//*/

			//ctx.putImageData(pixelDataDst, 0, 0);
		}
	};


	window.addEventListener("DOMContentLoaded",function(){

		video = $("#stream-in");
		ctx = (canvas = $("#stream-out")).getContext("2d");
		bgContext = (bgCanvas = document.createElement("canvas")).getContext("2d");


		// Not showing vendor prefixes.
		navigator.getUserMedia({video: true, audio: true}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			localMediaStream = stream;
			video.addEventListener("loadedmetadata", function(e) {
				ratio = video.videoWidth / video.videoHeight;
				w = video.videoWidth - 100;
				h = parseInt(w / ratio, 10);
				canvas.width = w;
				canvas.height = h;
				bgCanvas.width = w;
				bgCanvas.height = h;
			});
			draw();
		}, onFailSoHard);
	});
})();