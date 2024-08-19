document.addEventListener("DOMContentLoaded", function () {

    var canvas = new fabric.Canvas('myCanvas');
    canvas.hoverCursor = 'default';
    var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    canvas.freeDrawingCursor = "none";

    var imageCanvas = new fabric.Canvas('ic', { height: heightCanvas, width: widthCanvas, backgroundColor: 'rgba(0,0,0,0)', isDrawingMode: false, containerClass: 'off-screen-canvas' });
    imageCanvas.wrapperEl.style.left = '-9999px';

    var backendCanvas = new fabric.Canvas('backend-img', { height: heightCanvas, width: widthCanvas, backgroundColor: 'rgba(0,0,0,0)', isDrawingMode: false, containerClass: 'off-screen-canvas' });
    backendCanvas.wrapperEl.style.left = '-9999px';
    
    var maskCanvas = new fabric.Canvas('mc', { height: heightCanvas, width: widthCanvas, backgroundColor: 'rgba(0,0,0,0)', isDrawingMode: false, containerClass: 'off-screen-canvas' });
    maskCanvas.wrapperEl.style.left = '-9999px';

    var isBrushActive = false;
    var brushButton = document.getElementById("brush");
    var autoMaskButton = document.getElementById('auto-mask-button');
    var objectPrompt = document.getElementById('object-prompt');
    var sliderArea = document.getElementById('slider-area');

    var i2iButton = document.getElementById('i2i-generate');

    var invertCheck = document.querySelector('.bn39 input[type="checkbox"]');
    var invertedValue;
        
    invertCheck.addEventListener('change', function() {
        if (this.checked) {
            invertedValue = 1;
        } else {
            invertedValue = 0;
        }
    });

    objectPrompt.style.display = 'none';
    sliderArea.style.display = 'none';

    const SCALE_FACTOR = 1.1;
    const zoomMax = 5;
    let originalZoom = 1;

    var radioButtons = document.getElementsByName('scale');
    
    var selectedImagesContainer = document.querySelector('.images');
    
    let savedHTML;

    var v = localStorage.getItem("vi");

    localStorage.setItem('vi',v);

    let layerCounter;

    function getUserInfo(v) {
        return new Promise(function(resolve, reject) {
            fetch('/userInfo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({'v': v}),
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(data) {
                var cFrontend = data.c;
                var tFrontend = data.t;
                resolve({cFrontend, tFrontend});
            })
            .catch(function(error) {
                console.error('Hata: ' + error);
                reject(error);
            });
        });
    }
    
    getUserInfo(v).then(function(result) {
        var cFrontend = result.cFrontend;
        var tFrontend = result.tFrontend;
        layerCounter = cFrontend.lastLayerCounter;
    
        var canvasWidthBack = cFrontend.width;
        var canvasHeightBack = cFrontend.height;
    
        canvas.setDimensions({
            width: canvasWidthBack,
            height: canvasHeightBack
        });
    
        imageCanvas.setDimensions({
            width: canvasWidthBack,
            height: canvasHeightBack
        });
    
        backendCanvas.setDimensions({
            width: canvasWidthBack,
            height: canvasHeightBack
        });
    
        maskCanvas.setDimensions({
            width: canvasWidthBack,
            height: canvasHeightBack
        });
    
        var radioButtons = document.getElementsByName('scale');
        var scaleText = document.getElementById('canvas-size-text');
    
        if (canvasWidthBack === 768 && canvasHeightBack === 768) {
            radioButtons[0].checked = true;
            radioButtons[1].checked = false;
            radioButtons[2].checked = false;
            radioButtons[3].checked = false;
            radioButtons[4].checked = false;
        } else if (canvasWidthBack === 768 && canvasHeightBack === 576) {
            radioButtons[0].checked = false;
            radioButtons[1].checked = true;
            radioButtons[2].checked = false;
            radioButtons[3].checked = false;
            radioButtons[4].checked = false;
        } else if (canvasWidthBack === 576 && canvasHeightBack === 768) {
            radioButtons[0].checked = false;
            radioButtons[1].checked = false;
            radioButtons[2].checked = true;
            radioButtons[3].checked = false;
            radioButtons[4].checked = false;
        } else if (canvasWidthBack === 768 && canvasHeightBack === 432) {
            radioButtons[0].checked = false;
            radioButtons[1].checked = false;
            radioButtons[2].checked = false;
            radioButtons[3].checked = true;
            radioButtons[4].checked = false;
        } else if (canvasWidthBack === 432 && canvasHeightBack === 768) {
            radioButtons[0].checked = false;
            radioButtons[1].checked = false;
            radioButtons[2].checked = false;
            radioButtons[3].checked = false;
            radioButtons[4].checked = true;
        }
        
        selectedImagesContainer.innerHTML = tFrontend;
        bindEventListeners();

        var objects = typeof cFrontend.objects === 'string' ? JSON.parse(cFrontend.objects) : cFrontend.objects;

        addObjectsToCanvas(canvas, objects);
    
    }).catch(function(error) {
        console.error("Hata: " + error);
    });

    function bindEventListeners() {
        const hideButtons = document.querySelectorAll('.hide');
        const deleteButtons = document.querySelectorAll('.delete');
        const lockButtons = document.querySelectorAll('.lock');
    
        hideButtons.forEach(function(button) {
            button.addEventListener('click', function () {
                const layerItem = event.currentTarget.parentElement;
                const layerId = layerItem.id;
                const number = layerId.match(/\d+/)[0];
                const objects = canvas.getObjects();
                const dImage = objects.find(obj => obj.id === `canvasImage${number}`);
    
                if (dImage.visible){
                    dImage.visible = false;
                    button.innerHTML = '<img src="/static/images/icons/invisible.png" width="100%" height="100%">';
                } else {
                    dImage.visible = true;
                    button.innerHTML = '<img src="/static/images/icons/visible.png" width="100%" height="100%">';
                }
                canvas.renderAll();
                saveCanvasData();
            });
        });
    
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function () {
                const layerItem = event.currentTarget.parentElement;
                const layerId = layerItem.id;
                const number = layerId.match(/\d+/)[0];
                const objects = canvas.getObjects();
                const dImage = objects.find(obj => obj.id === `canvasImage${number}`);
    
                canvas.remove(dImage);
                canvas.renderAll();
    
                layerItem.remove();
                if (selectedImagesContainer.innerHTML==="") {
                    layerCounter = 0;
                    i2iButton.style.display = 'none';
                }
                
                saveCanvasData();
            });
        });
    
        lockButtons.forEach(function(button){
            button.addEventListener('click', function () {
                canvas.discardActiveObject();
                const layerItem = event.currentTarget.parentElement;
                const layerId = layerItem.id;
                const number = layerId.match(/\d+/)[0];
                const objects = canvas.getObjects();
                const dImage = objects.find(obj => obj.id === `canvasImage${number}`);
            
                if (dImage.selectable){
                    dImage.selectable = false;
                    button.innerHTML = '<img src="/static/images/icons/locked.png" width="100%" height="100%">';
                } else {
                    dImage.selectable = true;
                    button.innerHTML = '<img src="/static/images/icons/unlocked.png" width="100%" height="100%">';
                }
                canvas.renderAll();
                saveCanvasData();
            });
        });
    }

    function addObjectsToCanvas(canvas, objects) {
        canvas.clear();
    
        objects.forEach(function(objData) {
            if (objData.type === 'image') {
                fabric.Image.fromURL(objData.src, function(img) {
                    img.set(objData); 
                    canvas.add(img); 
                    canvas.renderAll();
                    i2iButton.style.display = 'flex';
                });
            }
        });
    }
    
    
    var heightCanvas = canvas.height;
    var widthCanvas = canvas.width;

    var userCredit = document.getElementById('user-credit');
    
    let mousePressedForPan = false;
    let lastPosX = 0;
    let lastPosY = 0;
    
    canvas.on('mouse:move', (event) => {
      if (event.e.ctrlKey && mousePressedForPan) {
        canvas.setCursor('grab');
        const currentPosX = event.e.clientX;
        const currentPosY = event.e.clientY;
    
        const deltaX = currentPosX - lastPosX;
        const deltaY = currentPosY - lastPosY;
        event.e.preventDefault();
        event.e.stopPropagation();
    
        const panDelta = new fabric.Point(deltaX, deltaY);
    
        canvas.relativePan(panDelta);
    
        lastPosX = currentPosX;
        lastPosY = currentPosY;
    
        canvas.renderAll();
      }
    });

    let ctrlPressed = false;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Control') {
            ctrlPressed = true;
            canvas.forEachObject(function(obj) {
                if (obj instanceof fabric.Image) {
                  obj.set({ evented: false, selectable: false });
                }
            canvas.isDrawingMode = false;
            isBrushActive = false;
            });
            
            canvas.discardActiveObject().renderAll();
            canvas.isDrawingMode = false;
            isBrushActive = false;
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Control') {
            ctrlPressed = false;
            canvas.forEachObject(function(obj) {
                if (obj instanceof fabric.Image) {
                  obj.set({ evented: true, selectable: true });
                }
            });
        }
    });

    var panButton = document.getElementById('pan');
    var panImage = panButton.querySelector('img');

    panButton.addEventListener('click', function () {
        ctrlPressed = !ctrlPressed;
    
        if (ctrlPressed) {
            canvas.forEachObject(function(obj) {
                if (obj instanceof fabric.Image) {
                  obj.set({ evented: false, selectable: false });
                }
            });

            panImage.src="/static/images/icons/cursor.png";
            
            canvas.isDrawingMode = false;
            isBrushActive = false;
            
            canvas.discardActiveObject().renderAll();
            canvas.isDrawingMode = false;
            isBrushActive = false;
        } else {
            panImage.src="/static/images/icons/pan.png";
            ctrlPressed = false;
            canvas.forEachObject(function(obj) {
                if (obj instanceof fabric.Image) {
                  obj.set({ evented: true, selectable: true });
                }
            });
        }
    });
    
    canvas.on('mouse:down', (event) => {
        if (ctrlPressed && event.e.button === 0) {
            canvas.discardActiveObject().renderAll();
            canvas.allowObjectMovement = false;
            event.e.preventDefault();
            event.e.stopPropagation();
            mousePressedForPan = true;
            canvas.setCursor('grab');
            const currentPosX = event.e.clientX;
            const currentPosY = event.e.clientY;
            lastPosX = currentPosX;
            lastPosY = currentPosY;
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:up', (event) => {
        if (mousePressedForPan && event.e.button === 0) {
            event.e.preventDefault();
            event.e.stopPropagation();
            mousePressedForPan = false;
            canvas.setCursor('default');
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:move', (event) => {
        if (mousePressedForPan) {
            canvas.setCursor('grab');
            const currentPosX = event.e.clientX;
            const currentPosY = event.e.clientY;
        
            const deltaX = currentPosX - lastPosX;
            const deltaY = currentPosY - lastPosY;
            event.e.preventDefault();
            event.e.stopPropagation();
        
            const panDelta = new fabric.Point(deltaX, deltaY);
        
            canvas.relativePan(panDelta);
        
            lastPosX = currentPosX;
            lastPosY = currentPosY;
        
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:down', (event) => {
      if (event.e.ctrlKey && event.e.button === 0) {
        canvas.discardActiveObject().renderAll();
        canvas.allowObjectMovement = false;
        event.e.preventDefault();
        event.e.stopPropagation();
        mousePressedForPan = true;
        canvas.setCursor('grab');
        const currentPosX = event.e.clientX;
        const currentPosY = event.e.clientY;
        lastPosX = currentPosX;
        lastPosY = currentPosY;
        canvas.renderAll();
      }
    });
    
    canvas.on('mouse:up', (event) => {
      if (event.e.button === 0 && event.e.ctrlKey) {
        event.e.preventDefault();
        event.e.stopPropagation();
        mousePressedForPan = false;
        canvas.setCursor('default');
        canvas.renderAll();
      }
    });

    var c1 = document.getElementById('checkbox1');
    var c2 = document.getElementById('checkbox2');
    var c3 = document.getElementById('checkbox3');
    var c4 = document.getElementById('checkbox4');
    c1.style.display = "none";
    c2.style.display = "none";
    c3.style.display = "none";
    c4.style.display = "none";
    const addButton = document.querySelector('.add-button');

    const outputImageSections = document.querySelectorAll('.output-image-section');
  
    document.getElementById("t2i-generate").addEventListener("click", async function () {
        
        for (let i = 1; i <= 4; i++) {
          const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
          imgElement.src = "/static/images/generate-image-free.gif";
        }

        idChange();
        
        var promptValue = document.getElementById("t2i-prompt").value;
        var negativePromptValue = document.getElementById("t2i-negative-prompt").value;
        var style = document.querySelector('input[name="style"]:checked').value;
        var scale = document.querySelector('input[name="scale"]:checked').value;
  
        var requestData = {
            "prompt": promptValue,
            "negative-prompt": negativePromptValue,
            "design": "free",
            "style": style,
            "scale": scale,
            "weather": ""
        };
  
        var apiUrl = "generate_index";
  
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(requestData),
            });
  
            if (!response.ok) {
                for (let i = 1; i <= 4; i++) {
                    const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                    imgElement.src = "/static/images/Yükleme Ekranı.gif";
                }
                throw new Error("Network response was not ok");
            }
  
            const responseData = await response.json();
  
            if (responseData.image && responseData.image.length > 0) {
                for (let i = 1; i <= 4 && i <= responseData.image.length; i++) {
                    const base64Image = responseData.image[i - 1];
                    const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                    imgElement.src = "data:image/png;base64," + base64Image;
                }
                idChangeBack();
                userCredit.innerHTML = responseData.credit;
            } else {
                console.error('Image array is not defined or is an empty array in the response');
                idChangeBack();
            }
        } catch (error) {
            console.error('Fetch error:', error);
            idChangeBack;
            document.getElementById("t2i-generate").disabled=false;
            document.getElementById("i2i-generate").disabled=false;
            document.getElementById("ip-generate").disabled=false;
            document.getElementById("rm-generate").disabled=false;
            for (let i = 1; i <= 4; i++) {
                const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                imgElement.src = "/static/images/GENERATE LOGO FREE.png";
            }
        }
    });

    document.getElementById("ip-generate").addEventListener("click", async function () {
        var image = renderCanvas().imageCanvas;
        var mask = renderCanvas().maskCanvas;
    
        for (let i = 1; i <= 4; i++) {
            const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
            imgElement.src = "/static/images/generate-image-free.gif";
        }
    
        idChange();
    
        var promptValue = document.getElementById("mask-prompt").value;
        var canvasDataImage = image.toDataURL("image/png");
        var scale = document.querySelector('input[name="scale"]:checked').value;
        var style = document.querySelector('input[name="style"]:checked').value;
        var maskPrompt = document.getElementById("object-prompt").value;
    
        if (maskCanvas.getObjects().length === 0 && maskPrompt === "") {
            var canvasDataMask = 0;
        } else if(maskCanvas.getObjects(length !== 0 && (maskPrompt === "" || maskPrompt !== ""))){
            var canvasDataMask = mask.toDataURL("image/png");
        } else {
            var canvasDataMask = 1;
        }
    
        var requestData = {
            "prompt": promptValue,
            "image": canvasDataImage,
            "mask": canvasDataMask,
            "scale": scale,
            "style" : style,
            "maskPrompt": maskPrompt,
            "maskInvert": invertedValue
        };
    
        var apiUrl = "generate_canvas";
    
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) {
                for (let i = 1; i <= 4; i++) {
                    const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                    imgElement.src = "/static/images/generate-image-free.gif";
                }
                throw new Error("Network response was not ok");
            }
    
            const responseData = await response.json();
    
            if (responseData.image && responseData.image.length > 0) {
                for (let i = 1; i <= 4 && i <= responseData.image.length; i++) {
                    const base64Image = responseData.image[i - 1];
                    const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                    imgElement.src = "data:image/png;base64," + base64Image;
                }
                idChangeBack();
                clearCanvas();
                userCredit.innerHTML = responseData.credit;
            } else {
                idChangeBack();
                clearCanvas();
            }
        } catch (error) {
            console.error("Fetch error:", error);
            clearCanvas();
            idChangeBack();
            document.getElementById("t2i-generate").disabled=false;
            document.getElementById("i2i-generate").disabled=false;
            document.getElementById("ip-generate").disabled=false;
            document.getElementById("rm-generate").disabled=false;
            for (let i = 1; i <= 4; i++) {
                const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                imgElement.src = "/static/images/GENERATE LOGO FREE.png";
            }
            c1.style.display = "none";
            c2.style.display = "none";
            c3.style.display = "none";
            c4.style.display = "none";
        }
        clearCanvas();
    });

    document.getElementById("rm-generate").addEventListener("click", async function () {
        try {
            var rmButton = document.getElementById("rm-generate");

            rmButton.disabled = true;

            const divCount = selectedImagesContainer.querySelectorAll('div').length;
        
            const selectedImages = document.querySelectorAll('.image-container .output-image-section input:checked');
    
            const allCount = selectedImages.length + divCount;
        
            if (allCount >= 10) {
                alert('Maximum layer count (10 layers) is exceeding. Please delete some layers before continue.');
                return;
            }
            var b= "";
            var image = renderCanvas().imageCanvas;
            var mask = renderCanvas().maskCanvas;
            var maskPrompt = document.getElementById("object-prompt").value;
            var scale = document.querySelector('input[name="scale"]:checked').value;
            var canvasDataImage = image.toDataURL("image/png");

            if (maskCanvas.getObjects().length === 0 && maskPrompt === "") {
                var canvasDataMask = 0;
            } else if(maskCanvas.getObjects(length !== 0 && (maskPrompt === "" || maskPrompt !== ""))){
                var canvasDataMask = mask.toDataURL("image/png");
            } else {
                var canvasDataMask = 1;
            }
            
        
            var requestData = {
                "image": canvasDataImage,
                "mask": canvasDataMask,
                "prompt": maskPrompt,
                "scale": scale
            };
        
            var apiUrl = "remove_objects";
        
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(requestData),
            });
        
            const responseData = await response.json();
        
            if (responseData.image) {
                const base64Image = responseData.image;
                b = "data:image/png;base64," + base64Image;
            } else if (responseData.error) {
                console.error('Image processing error:', responseData.error);
            } else {
                console.error('Unexpected response:', responseData);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        const imageDataURLb = b;
        const imgElementb = new Image();

        imgElementb.onload = function () {
            
            var imageWidth = imgElementb.width;
            var imageHeight = imgElementb.height;

            var aspectRatio = canvas.width / imageWidth;
            imageWidth = canvas.width;
            imageHeight *= aspectRatio;

            const selectedImageContainer = createLayerItem(imageDataURLb);

            imgElementb.width = imageWidth;
            imgElementb.height = imageHeight;

            selectedImagesContainer.insertBefore(selectedImageContainer, selectedImageContainer.firstChild);
        };

        imgElementb.src = imageDataURLb;

        
        var objects = canvas.getObjects();
        for (var i=0; i < objects.length; i++){
            if(objects[i] instanceof fabric.Path ){
                canvas.remove(objects[i]);
            }
        }
        canvas.renderAll();

        rmButton.disabled = false;

        clearCanvas();
    });

    document.getElementById("i2i-generate").addEventListener("click", async function () {
        var image = renderCanvas().imageCanvas;
        var mask = renderCanvas().maskCanvas;
    
        for (let i = 1; i <= 4; i++) {
            const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
            imgElement.src = "/static/images/generate-image-free.gif";
        }
    
        idChange();
        
        var promptValue = document.getElementById("t2i-prompt").value;
        var negativePromptValue = document.getElementById("t2i-negative-prompt").value;
        var canvasDataImage = image.toDataURL("image/png");
        var scale = document.querySelector('input[name="scale"]:checked').value;
        var style = document.querySelector('input[name="style"]:checked').value;
    
        var canvasDataMask = 0;
    
        var requestData = {
            "prompt": promptValue,
            "negative-prompt": negativePromptValue,
            "image": canvasDataImage,
            "mask": canvasDataMask,
            "scale": scale,
            "style" : style,
            "weather": "",
            "design": "free"
        };
    
        var apiUrl = "generate_canvas";
    
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) {
                for (let i = 1; i <= 4; i++) {
                    const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                    imgElement.src = "/static/images/generate-image-free.gif";
                }
                throw new Error("Network response was not ok");
            }
    
            const responseData = await response.json();
    
            if (responseData.image && responseData.image.length > 0) {
                for (let i = 1; i <= 4 && i <= responseData.image.length; i++) {
                    const base64Image = responseData.image[i - 1];
                    const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                    imgElement.src = "data:image/png;base64," + base64Image;
                }
                idChangeBack();
                clearCanvas();
                userCredit.innerHTML = responseData.credit;
            } else {
                idChangeBack();
                clearCanvas();
            }
        } catch (error) {
            console.error("Fetch error:", error);
            clearCanvas();
            idChangeBack();
            document.getElementById("t2i-generate").disabled=false;
            document.getElementById("i2i-generate").disabled=false;
            document.getElementById("ip-generate").disabled=false;
            document.getElementById("rm-generate").disabled=false;
            for (let i = 1; i <= 4; i++) {
                const imgElement = document.getElementById("image" + i).getElementsByTagName("img")[0];
                imgElement.src = "/static/images/GENERATE LOGO FREE.png";
            }
            c1.style.display = "none";
            c2.style.display = "none";
            c3.style.display = "none";
            c4.style.display = "none";
        }
        clearCanvas();
    });

    function idChange() {
        var generateButtont2i = document.getElementById("t2i-generate");
        var generateButtoni2i = document.getElementById("i2i-generate");
        var generateButtonip = document.getElementById("ip-generate");
        var generateButtonrm = document.getElementById("rm-generate");
        generateButtont2i.disabled = true;
        generateButtoni2i.disabled = true;
        generateButtonip.disabled = true;
        generateButtonrm.disabled = true;
        outputImageSections.forEach(function(section) {
            section.removeEventListener('click', handleImageClick);
        });
        c1.style.display = "none";
        c2.style.display = "none";
        c3.style.display = "none";
        c4.style.display = "none";
        addButton.removeEventListener('click', handleAddButtonClick);
        uncheckAllCheckboxes();
    }
    
    function idChangeBack() {
        var interruptButtont2i = document.getElementById("t2i-generate");
        var interruptButtoni2i = document.getElementById("i2i-generate");
        var interruptButtonip = document.getElementById("ip-generate");
        var interruptButtonrm = document.getElementById("rm-generate");
        interruptButtont2i.disabled = false;
        interruptButtoni2i.disabled = false;
        interruptButtonip.disabled = false;
        interruptButtonrm.disabled = false;
        outputImageSections.forEach(function(section) {
            section.addEventListener('click', handleImageClick);
        });
        c1.style.display = "flex";
        c2.style.display = "flex";
        c3.style.display = "flex";
        c4.style.display = "flex";
        addButton.addEventListener('click', handleAddButtonClick);
    }


function createLayerItem(srcy, imageId) {
    layerCounter++;
    const layerItem = document.createElement('div');
    layerItem.classList.add('layer-item');
    layerItem.id = `layer${layerCounter}`;
    i2iButton.style.display = 'flex';

    const img = document.createElement('img');
    img.src = srcy;
    img.height = 50;
    img.width = 50;
    img.id = `layer-image${layerCounter}`;

    var imgInstance = new fabric.Image(img, {
        id: `canvasImage${layerCounter}`,
        src: srcy,
        zIndex: -1,
        inverted: !1
    });

    var aspectRatio = imgInstance.width / imgInstance.height;

if (imgInstance.width > 768 || imgInstance.heigt > 768) {
    if (aspectRatio > 1) {
     imgInstance.scaleToWidth(768);
    } else {
        imgInstance.scaleToHeight(768);
    }
}
    canvas.add(imgInstance);

    const layerText = document.createElement('i');
    layerText.style.width = 'auto';
    layerText.style.height = 'auto';
    layerText.style.margin = '2%';
    layerText.textContent = `Layer ${layerCounter}`;
    layerText.style.fontStyle = "normal";
    layerText.style.fontFamily = "oswald";
    layerText.style.fontSize = "16px";

    const hideButton = document.createElement('button');
    hideButton.id = `hide${layerCounter}`;
    hideButton.classList.add('hide');
    hideButton.innerHTML = '<img src="/static/images/icons/visible.png" width="100%" height="100%">';
    hideButton.addEventListener('click', function () {
        const layerItem = event.currentTarget.parentElement;
        const layerId = layerItem.id;
        const number = layerId.match(/\d+/)[0];
        const objects = canvas.getObjects();
        const dImage = objects.find(obj => obj.id === `canvasImage${number}`);

        if (dImage.visible){
            dImage.visible = false;
            hideButton.innerHTML = '<img src="/static/images/icons/invisible.png" width="100%" height="100%">';
        } else {
            dImage.visible = true;
            hideButton.innerHTML = '<img src="/static/images/icons/visible.png" width="100%" height="100%">';
        }
        canvas.renderAll();
        saveCanvasData();
    });

    const deleteButton = document.createElement('button');
    deleteButton.id = `delete${layerCounter}`;
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '<img src="/static/images/icons/trash.png" width="100%" height="100%">';
    deleteButton.addEventListener('click', function () {
        const layerItem = event.currentTarget.parentElement;
        const layerId = layerItem.id;

        const number = layerId.match(/\d+/)[0];
        const objects = canvas.getObjects();
        const dImage = objects.find(obj => obj.id === `canvasImage${number}`);

        canvas.remove(dImage);
        canvas.renderAll();
        
        layerItem.remove();
        if (selectedImagesContainer.innerHTML==="") {
            layerCounter = 0;
            i2iButton.style.display = 'none';
        }
        saveCanvasData();
    });

    const lockButton = document.createElement('button');
    lockButton.id = `lock${layerCounter}`;
    lockButton.classList.add('lock');
    lockButton.innerHTML = '<img src="/static/images/icons/unlocked.png" width="100%" height="100%">';
    lockButton.addEventListener('click', function () {
        canvas.discardActiveObject();
        const layerItem = event.currentTarget.parentElement;
        const layerId = layerItem.id;
        const number = layerId.match(/\d+/)[0];
        const objects = canvas.getObjects();
        const dImage = objects.find(obj => obj.id === `canvasImage${number}`);

        if (dImage.selectable){
            dImage.selectable = false;
            lockButton.innerHTML = '<img src="/static/images/icons/locked.png" width="100%" height="100%">';
        } else {
            dImage.selectable = true;
            lockButton.innerHTML = '<img src="/static/images/icons/unlocked.png" width="100%" height="100%">';
        }
        canvas.renderAll();
        saveCanvasData();
    });

    layerItem.appendChild(img);
    layerItem.appendChild(layerText);
    layerItem.appendChild(lockButton);
    layerItem.appendChild(hideButton);
    layerItem.appendChild(deleteButton);

    selectedImagesContainer.insertBefore(layerItem, selectedImagesContainer.firstChild);
    updateCanvasOrder();
    saveCanvasData();

    return layerItem;
}

function handleImageClick() {
    var images = document.querySelectorAll('.output-image-section img');
    var popupContainer = document.getElementById('popupContainer');
    var popupImage = document.getElementById('popupImage');
    var leftArrow = document.getElementById('popup-left');
    var rightArrow = document.getElementById('popup-right');
    var currentIndex = 0;

    images.forEach(function(image, index) {
        image.addEventListener('click', function() {
            var src = image.src;
            if (!src.includes("GENERATE%20LOGO%20FREE.png") && !src.includes("generate-image-free.gif")) {
                images.forEach(function(img) {
                    img.style.border = 'thin solid #4ea4b9';
                });

                image.style.border = 'thick solid #4ea4b9';

                popupContainer.style.display = 'flex';
                popupImage.src = image.src;
                currentIndex = index;
            }
        });
    });

    leftArrow.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = images.length - 1;
        }
        updatePopupImage();
    });

    rightArrow.addEventListener('click', function() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updatePopupImage();
    });

    popupContainer.addEventListener('click', function(event) {
        if (event.target === popupContainer) {
            popupContainer.style.display = 'none';
            images.forEach(function(img) {
                img.style.border = 'thin solid #4ea4b9';
            });
        }
    });

    function updatePopupImage() {
        images.forEach(function(img) {
            img.style.border = 'thin solid #4ea4b9';
        });
        images[currentIndex].style.border = 'thick solid #4ea4b9';
        popupImage.src = images[currentIndex].src;
    }
}

handleImageClick();

    function handleFileSelect(event) {
        const file = event.target.files[0];
    
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size is very big.");
                return;
            }
    
            const reader = new FileReader();
    
            reader.onload = function (e) {
                const imageDataURL = e.target.result;
                const imgElement = new Image();
    
                imgElement.onload = function () {
                    var imageWidth = imgElement.width;
                    var imageHeight = imgElement.height;
    
                    var aspectRatio = canvas.width / imageWidth;
                    imageWidth = canvas.width;
                    imageHeight *= aspectRatio;
    
                    const selectedImageContainer = createLayerItem(imageDataURL);
    
                    imgElement.width = imageWidth;
                    imgElement.height = imageHeight;
    
                    selectedImagesContainer.insertBefore(selectedImageContainer, selectedImagesContainer.firstChild);
                };
    
                imgElement.src = imageDataURL;
            };
    
            reader.readAsDataURL(file);
        }
    }
    
    document.getElementById("upload").addEventListener('click', function () {
        const divCount = selectedImagesContainer.querySelectorAll('div').length;
    
        if (divCount >= 10) {
            alert('Maximum layer count (10 layers) is exceeding. Please delete some layers before continue.');
            return;
        }
    
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg, .jpeg, .png';
        input.addEventListener('change', handleFileSelect);
        input.click();
    });

    $(function() {
        $("#images").sortable({
          connectWith: "#images",
          cursor: "move",
          helper: function(event, ui) {
            ui.children().each(function() {
              $(this).width($(this).width());
              $(this).height($(this).height());
            });
            return ui;
          },
          start: function(event, ui) {
            ui.helper.css("position", "unset");
          },
          update: function() {
            updateCanvasOrder();
          }
        }).disableSelection();
    });

    function updateCanvasOrder() {
        const layers = document.querySelectorAll('.images div');
      
        const totalLayers = layers.length;
        const objects = canvas.getObjects();
        var number = [];

        for(let i=0;i<totalLayers;i++){
            var a = layers[i].id;
            number.push(a.match(/\d+/)[0]);
        }
        number.reverse();
        for(let j=0;j<totalLayers;j++){
            var a = number[j];
            var dImage = objects.find(obj => obj.id === `canvasImage${a}`);
            canvas.moveTo(dImage, j);
            canvas.renderAll();
        }
        canvas.requestRenderAll();
        saveCanvasData();
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          canvas.discardActiveObject().renderAll();
          canvas.isDrawingMode = false;
          isBrushActive = false;
          ctrlPressed = false;
          sliderArea.style.display = 'none';
          objectPrompt.style.display = 'none';
          objectPrompt.value = '';
          canvas.forEachObject(function(obj) {
              if (obj instanceof fabric.Image) {
                obj.set({ evented: true, selectable: true });
              }
          });
        }
    });

    function setCanvasSize(selectedButton) {
        var canvasWidth, canvasHeight;
        var scaleText = document.getElementById('canvas-size-text');
    
        if (selectedButton.id === 's') {
            canvasWidth = 768;
            canvasHeight = 768;
            scaleText.innerHTML = '768x768';
        } else if (selectedButton.id === 'h') {
            canvasWidth = 768;
            canvasHeight = 576;
            scaleText.innerHTML = '768x576';
        } else if (selectedButton.id === 'v') {
            canvasWidth = 576;
            canvasHeight = 768;
            scaleText.innerHTML = '576x768';
        } else if (selectedButton.id === 'h2') {
            canvasWidth = 768;
            canvasHeight = 432;
            scaleText.innerHTML = '768x432';
        } else if (selectedButton.id === 'v2') {
            canvasWidth = 432;
            canvasHeight = 768;
            scaleText.innerHTML = '432x768';
        }
    
        canvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight
        });

        imageCanvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight
        });

        maskCanvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight
        });

        backendCanvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight
        });
    }

    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener('change', function() {
            setCanvasSize(this);
            saveCanvasData();
        });
    }

    document.getElementById("bg-cleaner").addEventListener("click", async function () {
        try {
            var bgButton = document.getElementById("bg-cleaner");

            bgButton.disabled = true;

            const divCount = selectedImagesContainer.querySelectorAll('div').length;
        
            const selectedImages = document.querySelectorAll('.image-container .output-image-section input:checked');
    
            const allCount = selectedImages.length + divCount;
        
            if (allCount >= 10) {
                alert('Maximum layer count (10 layers) is exceeding. Please delete some layers before continue.');
                return;
            }
            var a= "";
            var canvasData = renderCanvas().imageCanvas.toDataURL("image/png");
        
            var requestData = {
                "image": canvasData,
            };
        
            var apiUrl = "background_cleaner";
        
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify(requestData),
            });
        
            const responseData = await response.json();
        
            if (responseData.image) {
                const base64Image = responseData.image;
                a = "data:image/png;base64," + base64Image;
            } else if (responseData.error) {
                console.error('Image processing error:', responseData.error);
            } else {
                console.error('Unexpected response:', responseData);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }

        const imageDataURL = a;
        const imgElement = new Image();

        imgElement.onload = function () {
            
            var imageWidth = imgElement.width;
            var imageHeight = imgElement.height;

            var aspectRatio = canvas.width / imageWidth;
            imageWidth = canvas.width;
            imageHeight *= aspectRatio;

            const selectedImageContainer = createLayerItem(imageDataURL);

            imgElement.width = imageWidth;
            imgElement.height = imageHeight;

            selectedImagesContainer.insertBefore(selectedImageContainer, selectedImageContainer.firstChild);
        };

        imgElement.src = imageDataURL;

        bgButton.disabled = false;

        clearCanvas();
    });

    document.getElementById("eraser").addEventListener("click", async function () {
        var objects = canvas.getObjects();
        for (var i=0; i < objects.length; i++){
            if(objects[i] instanceof fabric.Path ){
                canvas.remove(objects[i]);
            }
        }
        canvas.renderAll();
    });

    function renderCanvas() {
    
        canvas.getObjects('image').forEach(obj => {
            if (obj.visible) {
                const clonedImage = fabric.util.object.clone(obj);
                imageCanvas.add(clonedImage);
            }
        });
    
        imageCanvas.renderAll();
    
        canvas.getObjects('path').forEach(obj => {
            const clonedObj = fabric.util.object.clone(obj);
            maskCanvas.add(clonedObj);
        });
    
        maskCanvas.renderAll();
    
        return { imageCanvas, maskCanvas };
    }

    function clearCanvas() {
        imageCanvas.clear();
        imageCanvas.renderAll();
        maskCanvas.clear();
        maskCanvas.renderAll();
    }

    document.getElementById('center').addEventListener('click', function () {
        var selectedObject = canvas.getActiveObject();

        if (selectedObject) {
            selectedObject.top = 0;
            selectedObject.left = 0;
            canvas.renderAll();
        }
        saveCanvasData();
    });

    brushButton.addEventListener('click', function () {
        isBrushActive = !isBrushActive;
        ctrlPressed = false;
        if (isBrushActive) {
          canvas.isDrawingMode = true;
          sliderArea.style.display = 'flex';
          objectPrompt.value = '';
          objectPrompt.style.display = 'none';
        } else {
          canvas.isDrawingMode = false;
          sliderArea.style.display = 'none';
        }
      });
      
      canvas.freeDrawingBrush.width = 10;
      canvas.freeDrawingBrush.color = "hsla(192, 43%, 60%, 1)";
      
      let initialBrushWidth = canvas.freeDrawingBrush.width;

      var brushSizeInput = document.getElementById('valueSlider');
      var selectedValue = document.getElementById('selectedValue');
      brushSizeInput.addEventListener('input', function () {
          var selectedSize = parseInt(this.value);
          selectedValue.innerText = selectedSize;
          initialBrushWidth = selectedSize;
          updateBrushWidth();
      });
      
      function updateBrushWidth() {
          const zoom = canvas.getZoom();
          canvas.freeDrawingBrush.width = initialBrushWidth / zoom;
      }
      
      canvas.on('mouse:wheel', function(options) {
          const delta = -options.e.deltaY;
          let zoom = canvas.getZoom();
          zoom *= Math.pow(1.1, delta / 100);
        
          const maxZoom = Math.max(originalZoom, zoomMax);
          const minZoom = Math.min(originalZoom, 1);
        
          if (zoom > maxZoom) {
            zoom = maxZoom;
          }
          if (zoom < minZoom) {
            zoom = minZoom;
            canvas.viewportTransform[4] = 0;
            canvas.viewportTransform[5] = 0;
          }
        
          canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
      
          updateBrushWidth();
        
          options.e.preventDefault();
          options.e.stopPropagation();
      });
      
      var brushCursor = document.createElement('div');
      brushCursor.className = 'brush-cursor';
      document.body.appendChild(brushCursor);
      
      brushSizeInput.addEventListener('input', function () {
        var selectedSize = parseInt(this.value);
        brushCursor.style.width = selectedSize + 'px';
        brushCursor.style.height = selectedSize + 'px';
      });
      
      document.addEventListener('mousemove', function (event) {
        var canvasRect = canvas.getElement().getBoundingClientRect();
        var mouseX = event.pageX;
        var mouseY = event.pageY;
      
        var brushSize = parseInt(brushSizeInput.value);
        var innerBoundary = brushSize / 2;
      
        if (canvas.isDrawingMode && mouseX >= canvasRect.left + innerBoundary && mouseX <= canvasRect.right - innerBoundary &&
          mouseY >= canvasRect.top + innerBoundary && mouseY <= canvasRect.bottom - innerBoundary) {
          var offsetX = brushSize / 2;
          var offsetY = brushSize / 2;
      
          brushCursor.style.display = 'block';
          brushCursor.style.left = mouseX - offsetX + 'px';
          brushCursor.style.top = mouseY - offsetY + 'px';
          brushCursor.style.width = brushSize + 'px';
          brushCursor.style.height = brushSize + 'px';
          canvas.setCursor('none'); 
        } else {
          brushCursor.style.display = 'none';
          if (!canvas.isDrawingMode) {
            canvas.setCursor('default'); 
          }
        }
      });
      
      canvas.on('path:created', function (event) {
        if (isBrushActive) {
          var path = event.path;
          path.set({
            selectable: false,
            evented: false,
            opacity: 1,
            shadow: null,
            strokeLineJoin: 'round',
            strokeLineCap: 'round',
            straightLineKey: "shiftKey",
            strokeDashArray: null,
            transparentCorners: true,
            perPixelTargetFind: true,
            clipPath: void 0,
            controls: false,
            globalCompositeOperation: 'lighter source-in',
            color: "(242, 67%, 54%, 0.5)",
            dirty: true
          });
          canvas.bringToFront(path);
          canvas.renderAll();
        }
      });

      var downloadBtn = document.getElementById('download');
      downloadBtn.addEventListener("click", async function(){
          try{
              var image2download = "";
              var canvasData = renderCanvas().imageCanvas.toDataURL("image/png");
              var requestData = {
                  "image": canvasData,
              };
      
              var apiUrl = "download_image";
      
              const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      "X-CSRFToken": csrfToken,
                  },
                  body: JSON.stringify(requestData),
              });
      
              if (!response.ok) {
                  throw new Error(`Server error: ${response.statusText}`);
              }
      
              const responseData = await response.json();
      
              if (responseData.image){
                  const base64Image = responseData.image;
                  image2download = "data:image/png;base64," + base64Image; // Ensure the base64 string is correctly formatted
              } else if(responseData.error) {
                  console.error('Image processing error:', responseData.error);
              } else {
                  console.error('Unexpected response:', responseData);
              }
          } catch (error) {
              console.error('Fetch error:', error);
          }
      
          if (image2download) {
              const a = document.createElement('a');
              a.href = image2download; // Use the correctly formatted base64 URL
              a.download = 'quvi.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          } else {
              console.error('No image data available for download.');
          }
      });

    function addImageToCanvas(imgElement) {
        const srcy = imgElement.src;
        const imageId = imgElement.id;
        createLayerItem(srcy, imageId);
    }

    function handleAddButtonClick() {
        const divCount = selectedImagesContainer.querySelectorAll('div').length;
    
        const selectedImages = document.querySelectorAll('.image-container .output-image-section input:checked');

        const allCount = selectedImages.length + divCount;
    
        if (allCount > 10) {
            alert('Maximum layer count (10 layers) is exceeding. Please delete some layers before continue.');
            return;
        }
        
        selectedImages.forEach(function (checkbox) {
            const imageContainer = checkbox.closest('.output-image-section');
            const imgElement = imageContainer.querySelector('img');
            var popupContainer = document.getElementById('popupContainer');
            popupContainer.style.display = 'none';
            var images = document.querySelectorAll('.output-image-section img');
            images.forEach(function(img) {
                img.style.border = 'thin solid #4ea4b9';
            });
            
            addImageToCanvas(imgElement);
        });
        uncheckAllCheckboxes();
    }

    function uncheckAllCheckboxes() {
        var checkboxes = document.querySelectorAll('.output-image-section input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
    }
    
    
    async function saveCanvasData() {
        var canvasData = createCanvasJSON(canvas);
        var layerDataFront = getSavedHTML();
        var backendUrl;

        var imageObjects = canvas.getObjects('image');

        if (imageObjects.length > 0) {
            imageObjects.forEach(obj => {
                var cc = fabric.util.object.clone(obj);
                backendCanvas.add(cc);
                backendCanvas.requestRenderAll();
                backendUrl = backendCanvas.toDataURL('image/png');
            });
        } else {
            backendCanvas.clear();
            backendCanvas.requestRenderAll();
            backendUrl = backendCanvas.toDataURL('image/png');
        }

        
        var x = {
            valueC: v,
            canvas_json_data: canvasData,
            layerDataFront: layerDataFront,
            backendUrl: backendUrl,
        };

        try {    
            const response = await fetch('save_canvas_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify(x),
                credentials: "same-origin",
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function createCanvasJSON(canvas) {
        var canvasJSON = {
          width: canvas.width,
          height: canvas.height,
          lastLayerCounter: layerCounter,
          objects: []
        };
      
        var objects = canvas.getObjects().filter(obj => obj !== undefined);
      
        objects.forEach(function(obj) {
          var objJSON = {
            type: obj.type,
            top: obj.top,
            left: obj.left,
            angle: obj.angle,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            fill: obj.fill,
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth,
            opacity: obj.opacity,
            visible: obj.visible,
            selectable: obj.selectable,
            hasControls: obj.hasControls,
            hasBorders: obj.hasBorders,
            flipX: obj.flipX,
            flipY: obj.flipY,
            shadow: obj.shadow,
            skewX: obj.skewX,
            skewY: obj.skewY,
            originX: obj.originX,
            originY: obj.originY,
            transparentCorners: obj.transparentCorners,
            perPixelTargetFind: obj.perPixelTargetFind,
            dirty: obj.dirty,
            id: obj.id,
            zIndex: obj.zIndex,
            inverted: obj.inverted,
            selectable: obj.selectable,
            evented: obj.evented,
            src: obj.src,
            strokeLineJoin: obj.strokeLineJoin,
            strokeLineCap: obj.strokeLineCap,
            straightLineKey: obj.straightLineKey,
            strokeDashArray: obj.strokeDashArray,
            clipPath: obj.clipPath,
            globalCompositeOperation: obj.globalCompositeOperation,
            color: obj.color,
          };
          canvasJSON.objects.push(objJSON);
        });
      
        return canvasJSON;
    }

    function getSavedHTML() {
        savedHTML = selectedImagesContainer.innerHTML;
        return savedHTML;
    }

    function handleObjectModified(event) {
        saveCanvasData();
    }

    canvas.on('object:modified', function(event) {
        handleObjectModified(event);
    });

    autoMaskButton.addEventListener('click', function () {
        if (objectPrompt.style.display === 'none') {
            objectPrompt.style.display = 'flex';
            sliderArea.style.display = 'none';
            isBrushActive = false;
            ctrlPressed = false;
            canvas.isDrawingMode = false;
        } else {
            objectPrompt.style.display = 'none';
            objectPrompt.value = '';
        }
    });

    const snapToGrid = 3; // Piksel aralığı

    canvas.on('object:moving', function(e) {
        const obj = e.target;
        
        // Piksel aralığına hizalama
        obj.set({
            left: Math.round(obj.left / snapToGrid) * snapToGrid,
            top: Math.round(obj.top / snapToGrid) * snapToGrid
        });
        
        // Canvas'ı güncelle
        canvas.renderAll();
    });

    canvas.on('object:modified', function(e) {
        const obj = e.target;
        
        // Piksel aralığına hizalama
        obj.set({
            left: Math.round(obj.left / snapToGrid) * snapToGrid,
            top: Math.round(obj.top / snapToGrid) * snapToGrid
        });
        
        // Canvas'ı güncelle
        canvas.renderAll();
    });
});