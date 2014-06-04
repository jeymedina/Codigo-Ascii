var debug = "";
window.onload = function()
{
    var ejecutaVideo = false;
    var reproVideo = false;
    var video = nom_div("video");
    var canvas = nom_div('canvas');
    var tomafoto = nom_div('boton');
    var width = 320;
    var height = 0;
    var efecto = 0;
    var colorAlfa = 255;
    var colorGama = 1;
    //Solicitar la cámara al usuario...
    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);
    navigator.getMedia(
    {
        video: true,
        audio: false
    },

    function(fuente)//URL blog
    {
        if(navigator.mozGetUserMedia)
        {
            video.mozSrcObject = fuente;
        }
        else
        {
            var URL = window.URL || window.webkitURL;
            video.src = URL.createObjectURL(fuente);
        }
        video.play();
    },
    function(err)
    {
        //alert("El navegador no soporta getMedia");
        console.log("El navegador no soporta getUserMedia");
    });

    video.addEventListener('canplay', function(ev)
    {
        if (!ejecutaVideo)
        {
            height = video.videoHeight / (video.videoWidth/width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            ejecutaVideo = true;
        }
    });
	
	//ascci();

    function capturarFoto()
    {
        canvas.width = width;
        canvas.height = height;
        var c = canvas.getContext('2d');
        c.drawImage(video, 0, 0, width, height);
        var imgd = c.getImageData(0, 0, 500, 300);
        var pix = imgd.data;
        var rgba = [0, 0, 0, colorAlfa];
        //var ascii = nom_div("ascii");
        //ascii.innerHTML = "";
        //var linea = "";
        if(efecto != 0)
        {
            for (var i = 0, n = pix.length; i < n; i +=4)
            {
                if(efecto == 1 || efecto == 2)//Blanco y negro o sephia..
                {
                    var blancoNegro = pix[i] * 0.3 + pix[i+1] * 0.59 + pix[i+2] * 0.11;
                    rgba[0] = blancoNegro;
                    rgba[1] = blancoNegro;
                    rgba[2] = blancoNegro;
                    if(efecto == 2)//Sephia...
                    {
                        rgba[0] += 100;
                        rgba[1] += 50;
                    }
                }
                else
                {
                    if(efecto == 3)//Negativo...
                    {
                        rgba[0] = 255 - pix[i];
                        rgba[1] = 255 - pix[i + 1];
                        rgba[2] = 255 - pix[i + 2];
                    }
                    else
                    {
                        if(efecto == 4)//Ruido...
                        {
                            var aleatorio =  (0.5 - Math.random()) * 300;
                            rgba[0] = pix[i] + aleatorio;
                            rgba[1] = pix[i + 1] + aleatorio;
                            rgba[2] = pix[i + 2] + aleatorio;
                        }
                        else
                        {
                            if(efecto == 5)//Azul/verde/Rojo...
                            {
                                rgba[0] = pix[i + 2];
                                rgba[1] = pix[i + 1];
                                rgba[2] = pix[i];
                            }
                            else
                            {
                                if(efecto == 6)
                                {
                                    rgba[0] = pix[i];
                                    rgba[1] = 0;
                                    rgba[2] = pix[i + 2] + aleatorio;
                                }
                                else
                                {
                                	rgba[0] = Math.pow(pix[i] / 255, colorGama) * 255;
                            		rgba[1] = Math.pow(pix[i + 1] / 255, colorGama) * 255;
                            		rgba[2] = Math.pow(pix[i + 2] / 255, colorGama) * 255;
                                }
                            }
                        }
                    }
                }
                pix[i] = rgba[0]; //rojo..
                pix[i+1] = rgba[1]; //Verde
                pix[i+2] = rgba[2]; //Azul..
                pix[i+3] = rgba[3]; //Alpha...
            }
            c.putImageData(imgd, 0, 0);
        }
    }
    setInterval(loop, 10);

    function loop()
    {
    	if(reproVideo)
    	{
    		//console.log("Ingresa...");
    		capturarFoto();
    		reproVideo = !reproVideo;
    	}
    }

    tomafoto.addEventListener('click', function(event)
    {
        reproVideo = !reproVideo;
        video.style.display = "block";

    });
    var elementosEfecto = ["efectos", "alfa", "gama"];
    for(var i in elementosEfecto)
    {
    	nom_div(elementosEfecto[i]).addEventListener('change', function(event)
	    {
	        var efectoSelecciona = 0;
	        for(var i = 0; i < elementosEfecto.length; i++)
	        {
	        	if(event.target.id === elementosEfecto[i])
	        	{
	        		efectoSelecciona = i;
	        		break;
	        	}
	        }
	        if(efectoSelecciona == 0)
	        {
	        	efecto = this.value;
	        }
	        else
	        {
	        	if(efectoSelecciona == 1)
				{
					colorAlfa = this.value;
				}
				else
				{
					colorGama = this.value;
				}
			}
	        capturarFoto();
	    });	
    }

    nom_div("descarga").addEventListener('click', function(event)
    {  
		var nomfoto = prompt("Nombre de la foto", "foto");
        this.download = nomfoto + ".png";
        this.href = canvas.toDataURL();
    });

    function nom_div(div)
    {
        return document.getElementById(div);
    }
	
	/*function ascci(){
		var r, g, b, gray;
	  var character, line = "";
	  var sprite = document.getElementById("sprite");
	  var W = sprite.width;
	  var H = sprite.height;
	  var tcanvas = document.createElement("canvas");
	  tcanvas.width = W;
	  tcanvas.height = H; //same as the image
	  var tc = tcanvas.getContext("2d");
	  tc.fillStyle = "white";
	  tc.fillRect(0, 0, W, H);
	  tc.drawImage(sprite, 0, 0, W, H);
	  var pixels = tc.getImageData(0, 0, 500, 300);
	  var colordata = pixels.data;
	  var ascii = document.getElementById("ascii");
	  for(var i = 0; i < colordata.length; i = i+4){
		r = colordata[i];
		g = colordata[i+1];
		b = colordata[i+2];
		gray = r*0.2126 + g*0.7152 + b*0.0722;
		if(gray > 250) character = " ";
		else if(gray > 230) character = "`";
		else if(gray > 200) character = ":";
		else if(gray > 175) character = "*";
		else if(gray > 150) character = "+";
		else if(gray > 125) character = "#";
		else if(gray > 50) character = "W";
		else character = "@";
		if(i != 0 && (i/4)%W == 0){
		  ascii.appendChild(document.createTextNode(line));
		  ascii.appendChild(document.createElement("br"));
		  line = "";
		}
		line += character;
	  }
	  var frames = 10;
	  var container = document.getElementById("container");
	  var frame_width = parseInt(window.getComputedStyle(container).width)/frames;
	  container.style.width = frame_width+"px";
	  ascii.style.marginLeft = "0";
	  setInterval(loop, 1000/10);
	  function loop(){
		var current_ml = parseFloat(ascii.style.marginLeft);
		if(current_ml == frame_width*(frames-1)*-1)
		  ascii.style.marginLeft = "0";
		else
		  ascii.style.marginLeft = (current_ml - frame_width) + "px";
	  }
	}*/
}
