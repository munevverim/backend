document.addEventListener("DOMContentLoaded", function(){
  const styleRadios = document.querySelectorAll('input[type="radio"][name="style"]');
   const exteriorLabel = document.getElementById("exterior-label");
   const interiorLabel = document.getElementById("interior-label");

   const arrowContainer = document.getElementById('arrowContainer');
   const arrow = document.getElementById('arrow1');

   window.onscroll = function() {
    if (window.scrollY > 20) { 
        arrowContainer.style.opacity = "1";
    } else {
        arrowContainer.style.opacity = "0";
    }  
}

arrowContainer.addEventListener("click", function() {
  window.scrollTo({
      top: 0,
      behavior: "smooth"
  });
});
   
   const exteriorStyleText = document.getElementById("a");
   const exteriorStyleWeather = document.getElementById("b");
   const exteriorStylePrompt = document.getElementById("z");

   const interiorStyleText = document.getElementById("d");
   const interiorStyleWeather = document.getElementById("c");
   const interiorStylePrompt = document.getElementById("v");

   const fpStyleImage = document.getElementById("fp-image");
   const fpStylePrompt = document.getElementById("fp-prompt");
   const lsStyleImage = document.getElementById("ls-image");
   const lsStylePrompt = document.getElementById("ls-prompt");

   const maskStyleImage1 = document.getElementById("mask-image");
   const maskStyleImage = document.getElementById("mask2-image");
   const maskStyleImage2 = document.getElementById("mask3-image");
   const maskStylePrompt = document.getElementById("mask-prompt2");
   const maskStylePrompt2 = document.getElementById("mask-prompt4");

   const imagetoStyleImage = document.getElementById("imageto-image");
   const imagetoStylePrompt = document.getElementById("imageto-prompt");
   const imagetoStylePrompt2 = document.getElementById("imageto-prompt2");

   const thirditemStyleImage = document.getElementById("third-item-image");
   const thirditemStyleImage2 = document.getElementById("third-item-image3");
   const thirditemStylePrompt = document.getElementById("third-item-prompt3");
   const thirditemStylePrompt2 = document.getElementById("third-item-prompt5");
   const thirditemStylePrompt3 = document.getElementById("third-item-prompt6");
   const thirditemStylePrompt4 = document.getElementById("third-item-prompt4");

  const intImg = document.getElementById("x");
  const extImg = document.getElementById("y");

  var lastClickedIndex = -1;
   const textSets = [
    ["MODERN", "SUNNY", "The modernist villa is located organically on a hillside. The structure appears to emerge fluidly from the landscape"],
    ["NEOCLASSIC", "DUSK", "Large entrance gate, large columns, entrance with stairs, statues, fountains"],
    ["CHINESE", "SUNNY", "Sloped, curved roof lines, tiles, traditional roofing materials woodworking, carving, traditional Chinese motifs and symbols"],
    ["HELLENISTIC", "CLOUDY", "Architectural elements and designs from the ancient Greek period, elegant details, symmetrical arrangements and columns, reliefs, white color tones, staircase entrance, statues and reliefs"],
    ["CONSTRUCTIVIST", "DUSK", "Sharp lines, black walls, natural light, large windows, trees"],
    ["FUTURISTIC", "SUNNY", "Oval lines, plants, big windows, garden with stairs, in the forest, white walls"],
    ["MINIMALIST", "SNOWY", "Duplex villa, large windows, white walls, oval lines, in the forest"],
    ["CYBERPUNK", "DUSK", "Sharp lines, neon lights, large windows, wide entrance door, on the street"],
    ["INDUSTRIAL", "SUNNY", "Bronze colors, large windows on the facade, trees, entrance with stairs, glass entrance door"],
    ["GOTHIC", "CLOUDY", "High pointed towers, thorny roofs, old stone walls, staircase entrance, wooden door details"],
    ["NATIVE", "SUNNY", "Wooden veranda, plants, large glazed doors, balcony, wooden roof, lawn"],
    ["BAROQUE", "SUNNY", "Luxury materials, carved stonework, gold relief patterns, columns, statues, balconies"],
    ["ROCOCO", "SUNNY", "Rich details, ornate columns, arches, statues, large garden, trees, pool"],
    ["BAUHAUS", "SUNNY", "White walls, metal door and window, courtyard, geometric pool, fountain"],
    ["ART-DECO", "DUSK", "Large windows, balconies with ornate iron bars, geometrically patterned, marble-covered garden, plants in the garden, tables and chairs, pool"],
    ["MEDIEVAL", "SUNNY", "Courtyard, stone walls, vines, landscaping, garden, chairs in the garden"],
    ["BYZANTINE", "CLOUDY", "Large courtyard, statues, motif door, gold details, mosaic embroidery"],
    ["RENAISSANCE", "SUNNY", "Marble columns, statues, wooden details, balconies with marble railings"],
    ["OTTOMAN", "SUNNY", "Large courtyard, high walls, colorful flowers, green garden with high iron fences, fountain in the middle of the courtyard"],
    ["VICTORIAN", "RAINY", "Brown walled garden, large, paved patio"],
    ["BOHEMIAN", "SUNNY", "Colorful flowers, paved paths, wooden tables, outdoor seating areas, lamps"],
    ["COUNTRY", "SUNNY", "Wooden hut, inside the village, stony garden, tall trees, stone facade"],
    ["NORDIC", "FOGGY", "Natural stones, large windows, white shutters, path, in the forest"],
  ];

  const inttextSets = [
    ["MODERN", "FOGGY", "Modern furniture, simple and elegant atmosphere, neutral color palette, wooden touches, asymmetrical lighting details, large-sized artworks on the walls, elegant decorative objects, large window panes, bedroom"],
    ["NEOCLASSIC", "SNOWY", "Living room, elegant details, reliefs and classical elements, large space, high ceilings, reliefs, classic fabric furniture, gilded armchairs, marble coffee table, an elegant chandelier hanging in the middle of the ceiling"],
    ["CHINESE", "NIGHT", "Decorative elements, inlaid ceilings, woodwork, botanical elements, Chinese style chandeliers, sculptures"],
    ["HELLENISTIC", "SUNNY", "Ancient Greek and Roman details, columns and artistic elements, high and open ceilings, column capitals, pastel tones, cream, light yellow, light blue colors, wooden coffee table, sculptures, plants"],
    ["CONSTRUCTIVIST", "RAINY", "Living room, sharp lines, wood, modern furniture, plant, dark tone walls"],
    ["FUTURISTIC", "SUNNY", "Large and spacious living room in the forest, white walls, touch-sensitive wall panels, artistic paintings, smart armchairs, coffee table"],
    ["MINIMALIST", "FOGGY", "Kitchen, pendant lights, dark walls, wooden kitchen table, large window"],
    ["CYBERPUNK", "SNOWY", "Living room, leather furniture, purple neon lights, glass coffee table"],
    ["INDUSTRIAL", "SUNNY", "Kitchen, dark walls, pendant lamps, wooden dining table, metal details, plants"],
    ["GOTHIC", "NIGHT", "Darkness, stone and dark walls, large windows, antique furniture, candlelight, candlesticks and wall lamps, arches"],
    ["NATIVE", "SUNNY", "Large living room, high ceiling, large window, wooden furniture, light-colored walls, handmade artwork, red embroidered carpet, wooden coffee table"],
    ["BAROQUE", "FOGGY", "Luxury, extravagant decorations, red, golden yellow, heavy furniture with wooden carvings and gilded details, upholstered armchairs, frescoes, gilded mirror frames, high ceilings"],
    ["ROCOCO", "SUNNY", "Bedroom, decorated and gilded ceilings, large mirrors, crystal chandeliers, colorful wall panels, patterned flooring"],
    ["BAUHAUS", "SUNNY", "White, grey, black and metallic colors, wide, tall windows, furniture with wooden details, glass coffee table"],
    ["ART-DECO", "SNOWY", "Bedroom, high ceiling, large windows, marble floor, patterned carpet, glass lamp, artwork hanging on the wall"],
    ["MEDIEVAL", "SNOWY", "Living room, stone walls, round arched windows, stone fireplace, dark cedar chairs, upholstered chairs, wooden coffee table"],
    ["BYZANTINE", "SUNNY", "Bedroom, high ceiling, walls, gilded frescoes, stained glass windows, stone statues, marble columns"],
    ["RENAISSANCE", "FOGGY", "Living room, high ceiling, large windows, paintings, red patterned carpet, brown leather sofa, dark wall, plants"],
    ["OTTOMAN", "FOGGY", "Handcrafted decorations on the walls, large Ottoman carpet, wooden and carved detailed furniture, large windows"],
    ["VICTORIAN", "SNOWY", "Bedroom, floral patterned wallpaper, fire in the fireplace, gold framed mirrors, crystal chandelier, jewelry box"],
    ["BOHEMIAN", "SUNNY", "Living room, colorful carpet, lace curtains, wooden lampshades, wooden furniture, red patterned throw pillows, wooden bookcase"],
    ["COUNTRY", "SNOWY", "Kitchen, wooden floor, wooden cabinet, stone fireplace"],
    ["NORDIC", "DUSK", "Living room, large rectangular windows, television unit"],
  ];

  const flTexts = [
    ["Living room, entrance, kitchen, bedroom, toilet, stairs, cellar","Villa, apartment, tree, pool, road, garden, river, bridge","/static/images/landscape_floorplan/floor plan1.jpg","/static/images/landscape_floorplan/landscapee2.jpg"],
    ["Kitchen, living room, bedroom, toilet","Apartment, tree, pool, garden","/static/images/landscape_floorplan/floor plan2.png","/static/images/landscape_floorplan/landscape3.png"],
    ["Dining room, living room, kitchen, laundry room, bedroom, toilet, ","Villa, tree, pool, road, garden, river, mountain, bridge","/static/images/landscape_floorplan/floor plan3.png","/static/images/landscape_floorplan/landscape4.png"],
    ["Play room, kitchen, bedroom, toilet","Villa, pool, garden","/static/images/landscape_floorplan/floor plan4.png","/static/images/landscape_floorplan/landscape5.png"],
    ["Attic, living room, study room, kitchen, bedroom, bathroom","Building, tree, pool, road, garden, river, bridge","/static/images/landscape_floorplan/floor plan5.png","/static/images/landscape_floorplan/landscape6.png"]
  ];


  const maskimagetoTexts = [
    ["INTERIOR DESIGN", "INTERIOR DESIGN", "/static/images/mask-imagetoimage/imgtoimg5.png","/static/images/mask-imagetoimage/imgtoimg6.png","/static/images/mask-imagetoimage/imgtoimg7.png","/static/images/mask-imagetoimage/imgtoimg8.png","Snowy weather view","Snowy weather view,Nordic style"],
    ["LANDSCAPE","LANDSCAPE","/static/images/mask-imagetoimage/imgtoimg1.png","/static/images/mask-imagetoimage/imgtoimg4.png","/static/images/mask-imagetoimage/imgtoimg3.png","/static/images/mask-imagetoimage/imgtoimg2.png","Pool","Snowy weather view"],
    ["FLOOR PLAN","FLOOR PLAN","/static/images/mask-imagetoimage/mask1.png","/static/images/mask-imagetoimage/mask2.png","/static/images/mask-imagetoimage/mask3.png","/static/images/mask-imagetoimage/mask10.png","Black bed","Marble floor"],
    ["EXTERIOR","EXTERIOR","/static/images/mask-imagetoimage/mask4.png","/static/images/mask-imagetoimage/mask5.png","/static/images/mask-imagetoimage/mask6.png","/static/images/mask-imagetoimage/mask11.png","Curtain","Dusk"],
    ["EXTERIOR","EXTERIOR","/static/images/mask-imagetoimage/mask7.png","/static/images/mask-imagetoimage/mask8.png","/static/images/mask-imagetoimage/mask9.png","/static/images/mask-imagetoimage/mask12.png","Wooden railing","River view"],
  ];

  const thirditemTexts = [
    ["INTERIOR DESIGN", "CYBERPUNK","CLOUDY","Orange Sofa Set", "/static/images/sketch/sketch.jpg","/static/images/sketch/sketch1.png"],
    ["INTERIOR DESIGN","MODERN","SUNNY","Gray carpet ","/static/images/sketch/sketch2.jpg","/static/images/sketch/sketch3.png"],
    ["EXTERIOR DESIGN","MODERN", "DUSK/DOWN","Black windows, white and black walls","/static/images/sketch/sketch6.png","/static/images/sketch/sketch7.png"],
    ["EXTERIOR DESIGN","NATIVE","CLOUDY","Earth ground","/static/images/sketch/sketch8.jpg","/static/images/sketch/sketch9.png"],
    ["EXTERIOR DESIGN","COUNTRY", "DUSK/DOWN","Green grass","/static/images/sketch/sketch11.jpg","/static/images/sketch/sketch12.png"],
  ];

  function clickHandler() {
    var clickedIndex = Array.from(styleRadios).findIndex(radio => radio === this);

    if (lastClickedIndex !== clickedIndex) {
      const basePath = '/static/images/styles/';
      const styleOffsets = {
        0: '1.MODERN/',
        1: '2.NEOCLASSIC/',
        2: '3.CHINESE/',
        3: '4.HELLENISTIC/',
        4: '5.CONSTRUCTIVIST/',
        5: '6.FUTURISTIC/',
        6: '7.MINIMALIST/',
        7: '8.CYBERPUNK/',
        8: '9.INDUSTRIAL/',
        9: '10.GOTHIC/',
        10: '11.NATIVE/',
        11: '12.BAROQUE/',
        12: '13.ROCOCO/',
        13: '14.BAUHAUS/',
        14: '15.ART DECO/',
        15: '16.MEDIEVAL/',
        16: '17.BYZANTINE/',
        17: '18.RENAISSANCE/',
        18: '19.OTTOMAN/',
        19: '20.VICTORIAN/',
        20: '21.BOHEMIAN/',
        21: '22.COUNTRY/',
        22: '23.NORDIC/'
      };

      const selectedStyle = styleRadios[clickedIndex].value;
      let intImagePath = basePath + styleOffsets[clickedIndex] + 'interior.png';
      let extImagePath = basePath + styleOffsets[clickedIndex] + 'exterior.png';

      intImg.src = intImagePath;
      extImg.src = extImagePath;

      exteriorStyleText.innerHTML = textSets[clickedIndex][0];
      exteriorStyleWeather.innerHTML = textSets[clickedIndex][1];
      exteriorStylePrompt.innerHTML = textSets[clickedIndex][2];

      interiorStyleText.innerHTML = inttextSets[clickedIndex][0];
      interiorStyleWeather.innerHTML = inttextSets[clickedIndex][1];
      interiorStylePrompt.innerHTML = inttextSets[clickedIndex][2];

      lastClickedIndex = clickedIndex;
    }
  }

  let flTextIndex = 0;
  setInterval(function() {
    fpStylePrompt.innerHTML = flTexts[flTextIndex][0];
    fpStyleImage.src = flTexts[flTextIndex][3];
    lsStylePrompt.innerHTML = flTexts[flTextIndex][1];
    lsStyleImage.src = flTexts[flTextIndex][2];

    flTextIndex = (flTextIndex + 1) % flTexts.length;
  }, 3000);

  let maskimagetoTextIndex = 0;
  setInterval(function() {
    maskStylePrompt.innerHTML = maskimagetoTexts[maskimagetoTextIndex][0];
    imagetoStylePrompt.innerHTML = maskimagetoTexts[maskimagetoTextIndex][1];
    maskStyleImage1.src = maskimagetoTexts[maskimagetoTextIndex][2];
    maskStyleImage.src = maskimagetoTexts[maskimagetoTextIndex][3];
    maskStyleImage2.src = maskimagetoTexts[maskimagetoTextIndex][4];
    imagetoStyleImage.src = maskimagetoTexts[maskimagetoTextIndex][5];
    maskStylePrompt2.innerHTML = maskimagetoTexts[maskimagetoTextIndex][6];
    imagetoStylePrompt2.innerHTML = maskimagetoTexts[maskimagetoTextIndex][7];  

    maskimagetoTextIndex = (maskimagetoTextIndex + 1) % maskimagetoTexts.length;
  }, 3000);

  styleRadios.forEach(function(radio) {
    radio.addEventListener("change", clickHandler);
  });

  
  styleRadios.forEach(function(radio) {
    radio.addEventListener("change", clickHandler);
  });

  let thirditemTextIndex = 0;
  setInterval(function() {
    thirditemStyleImage.src = thirditemTexts[thirditemTextIndex][4];
    thirditemStyleImage2.src = thirditemTexts[thirditemTextIndex][5];
    thirditemStylePrompt.innerHTML = thirditemTexts[thirditemTextIndex][0];
    thirditemStylePrompt2.innerHTML = thirditemTexts[thirditemTextIndex][1];
    thirditemStylePrompt3.innerHTML = thirditemTexts[thirditemTextIndex][2];
    thirditemStylePrompt4.innerHTML = thirditemTexts[thirditemTextIndex][3];   

    thirditemTextIndex = (thirditemTextIndex + 1) % thirditemTexts.length;
  }, 3000);

  let isMouseOver = false;
  document.querySelector('.black-rectangle').addEventListener('mouseenter', function() {
    isMouseOver = true;
  });
  
  document.querySelector('.black-rectangle').addEventListener('mouseleave', function() {
    isMouseOver = false;
  });

  
  const blackRectangle = document.querySelector('.black-rectangle');
  const sliderContainer = document.querySelector('.slider-containerr');
  const baseScrollSpeed = 1; 
  const mouseScrollSpeed = 4; 
  let scrollSpeed = baseScrollSpeed;
  let scrollInterval;
  let isScrolling = false;
  
  function startScrolling() {
    if (isScrolling) return;
    isScrolling = true;
    scrollInterval = setInterval(() => {
      blackRectangle.scrollLeft += scrollSpeed;

      if (blackRectangle.scrollLeft + blackRectangle.clientWidth >= sliderContainer.scrollWidth) {
        blackRectangle.scrollLeft = 0;
      } else if (blackRectangle.scrollLeft <= 0) {
        blackRectangle.scrollLeft = sliderContainer.scrollWidth - blackRectangle.clientWidth;
      }
    }, 10);
  }
  
  function stopScrolling() {
    isScrolling = false;
    clearInterval(scrollInterval);
  }
  
  function adjustScrollSpeed(e) {
    const rect = blackRectangle.getBoundingClientRect();
    const x = e.clientX - rect.left;
  
    if (x < rect.width * 0.1) {
      scrollSpeed = -mouseScrollSpeed; 
    } else if (x > rect.width * 0.9) {
      scrollSpeed = mouseScrollSpeed; 
    } else {
      scrollSpeed = baseScrollSpeed; 
    }
  }
  
  blackRectangle.addEventListener('mousemove', (e) => {
    adjustScrollSpeed(e);
  });
  
  blackRectangle.addEventListener('mouseleave', () => {
    scrollSpeed = baseScrollSpeed;
  });
  
  blackRectangle.addEventListener('mouseenter', () => {
    scrollSpeed = baseScrollSpeed;
  });
  
  blackRectangle.addEventListener('touchstart', (e) => {
    adjustScrollSpeed(e.touches[0]);
  });
  
  blackRectangle.addEventListener('touchend', () => {
    scrollSpeed = baseScrollSpeed;
  });
  
  const images = document.querySelectorAll('.first img');
  
  images.forEach((img) => {
    img.addEventListener('mouseenter', stopScrolling);
    img.addEventListener('mouseleave', startScrolling);
  });
  
  startScrolling();

  const slides = document.querySelectorAll('.inner-container-new2');
  let currentIndex = 0;
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('show', 'hide');
      if (i === index) {
        slide.classList.add('show');
      } else {
        slide.classList.add('hide');
      }
    });
    currentIndex = index;
  }
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }
  setInterval(nextSlide, 4000);
  });
  
  
  
  document.addEventListener('DOMContentLoaded', function() {
    const imageSets = {
      "anime": [
        "/static/images/free/1 (8).jpg",
        "/static/images/free/Default_full_body_shot_of_xr_agent_of_the_nine_destiny_cloaked_0_250c3772-2d54-424c-97d6-4936d9f4fb78_0.jpg",
        "/static/images/free/1 (2).jpg",
        "/static/images/free/1 (3).jpg",
        "/static/images/free/1 (7).jpg",
      ],
  
      "photographic": [
        "/static/images/free/1 (8).jpg",
        "/static/images/free/Default_full_body_shot_of_xr_agent_of_the_nine_destiny_cloaked_0_250c3772-2d54-424c-97d6-4936d9f4fb78_0.jpg",
        "/static/images/free/1 (2).jpg",
        "/static/images/free/1 (3).jpg",
        "/static/images/free/1 (7).jpg",
      ],
      
      "pixel-art": [
        "/static/images/free/1 (8).jpg",
        "/static/images/free/Default_full_body_shot_of_xr_agent_of_the_nine_destiny_cloaked_0_250c3772-2d54-424c-97d6-4936d9f4fb78_0.jpg",
        "/static/images/free/1 (2).jpg",
        "/static/images/free/1 (3).jpg",
        "/static/images/free/1 (7).jpg",
      ],
    };
    const links = document.querySelectorAll('.gallerys a');
    const lineBoxs = document.getElementById('line-boxs');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.getAttribute('data-category');
        const images = imageSets[category];
        updateImages(images);
      });
    });
    function updateImages(images) {
      lineBoxs.innerHTML = '';
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Gallery Image';
        const lineBox = document.createElement('div');
        lineBox.className = 'line-box';
        lineBox.appendChild(img);
        lineBoxs.appendChild(lineBox);
      });
    }
  
  
  
    const linkss = document.querySelectorAll('.free-text2 a');
    linkss.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const imageUrl = this.getAttribute('data-image');
        updateImage(imageUrl);
      });
    });
    function updateImage(imageUrl) {
      const imageElement = document.getElementById('displayedImage');
      imageElement.src = imageUrl;
    }
  
  
  
    function toggleContent(index) {
      document.querySelectorAll('.sl-box .sl-box-down > div').forEach(element => {
          element.style.display = 'none';
      });
      let contentToShow;
      switch (index) {
          case 1:
              contentToShow = '.dr';
              break;
          case 2:
              contentToShow = '.dm';
              break;
          case 3:
              contentToShow = '.dl';
              break;
          case 4:
              contentToShow = '.dr'; 
              break;
          default:
              contentToShow = '.dr'; 
              break;
      }
  
      document.querySelector('.sl-box ' + contentToShow).style.display = 'flex';
  }
  
  
  
  function toggleContent(index) {
    document.querySelectorAll('.sr-box a').forEach(element => {
        element.style.color = 'rgb(190, 174, 174)';
    });
  
    document.querySelector('.sr-box a:nth-child(' + index + ')').style.color = 'rgb(221, 131, 221)';
  
    let selectedText = document.querySelector('.sl-box-top');
    selectedText.style.animation = 'none';  
    void selectedText.offsetWidth;  
    selectedText.style.animation = 'lightEffect 20s infinite';  
  }
  
  
  
  document.getElementById('img1').addEventListener('click', function() {
    updateImages1();
  });
  function updateImages1() {
    const drImages = [
        '/static/images/free/page/image (20).png',
        '/static/images/free/page/image (21).png',
        '/static/images/free/page/image (22).png',
        '/static/images/free/page/image (19).png'
    ];
    const dlImages = [
        '/static/images/free/page/image (23).png',
        '/static/images/free/page/image (24).png',
        '/static/images/free/page/image (25).png',
        '/static/images/free/page/image (26).png'
    ];
    const dmImageSrc = '/static/images/free/page/image (19).png';
    const slBoxTopText = `
        <p>Fantasy Art</p>
        <p>Let the dancing fairy land on the shoulder of the golden-haired princess, around the golden waterfall shining in the depths of the forest, and let the moon be in the sky.</p>
        <p>City View</p>
    `;
    const drDiv = document.getElementById('dr-container');
    const dlDiv = document.getElementById('dl-container');
    const dmDiv = document.querySelector('.dm img');
    const slBoxTopDiv = document.querySelector('.sl-box-top');
    drDiv.innerHTML = drImages.map(src => `<img src="${src}" alt="">`).join('');
    dlDiv.innerHTML = dlImages.map(src => `<img src="${src}" alt="">`).join('');
    dmDiv.src = dmImageSrc;
    slBoxTopDiv.innerHTML = slBoxTopText;
  }
  document.getElementById('img2').addEventListener('click', function() {
    updateImages2();
  });
  function updateImages2() {
    const drImages = [
        '/static/images/free/page/image (3).png',
        '/static/images/free/page/image (1).png',
        '/static/images/free/page/image (2).png',
        '/static/images/free/page/image.png'
    ];
    const dlImages = [
        '/static/images/free/page/image (41).png',
        '/static/images/free/page/image (5).png',
        '/static/images/free/page/image (6).png',
        '/static/images/free/page/image (7).png'
    ];
    const dmImageSrc = '/static/images/free/page/image.png';
    const slBoxTopText = `
        <p>Gothic</p>
        <p>The silver-winged dragon burns the city. Have skyscrapers and dark clouds in the background.</p>
        <p>Forest Fire</p>
    `;
    const drDiv = document.getElementById('dr-container');
    const dlDiv = document.getElementById('dl-container');
    const dmDiv = document.querySelector('.dm img');
    const slBoxTopDiv = document.querySelector('.sl-box-top');
    drDiv.innerHTML = drImages.map(src => `<img src="${src}" alt="">`).join('');
    dlDiv.innerHTML = dlImages.map(src => `<img src="${src}" alt="">`).join('');
    dmDiv.src = dmImageSrc;
    slBoxTopDiv.innerHTML = slBoxTopText;
  }
  document.getElementById('img3').addEventListener('click', function() {
    updateImages3();
  });
  function updateImages3() {
    const drImages = [
        '/static/images/free/page/image (11).png',
        '/static/images/free/page/image (12).png',
        '/static/images/free/page/image (14).png',
        '/static/images/free/page/image (13).png'
    ];
    const dlImages = [
        '/static/images/free/page/image (4).png',
        '/static/images/free/page/image (8).png',
        '/static/images/free/page/image (9).png',
        '/static/images/free/page/image (10).png'
    ];
    const dmImageSrc = '/static/images/free/page/image (13).png';
    const slBoxTopText = `
        <p>Cinematic</p>
        <p>A gray mouse follows the notes coming out of the music book, the notes fly in the air, the mouse watches the notes carefully.</p>
        <p>Mouse on guitar strings</p>
    `;
    const drDiv = document.getElementById('dr-container');
    const dlDiv = document.getElementById('dl-container');
    const dmDiv = document.querySelector('.dm img');
    const slBoxTopDiv = document.querySelector('.sl-box-top');
    drDiv.innerHTML = drImages.map(src => `<img src="${src}" alt="">`).join('');
    dlDiv.innerHTML = dlImages.map(src => `<img src="${src}" alt="">`).join('');
    dmDiv.src = dmImageSrc;
    slBoxTopDiv.innerHTML = slBoxTopText;
  }
  
  
  
  document.querySelectorAll('.sr-box img').forEach(img => {
    img.addEventListener('click', () => {
        document.querySelectorAll('.sr-box img').forEach(i => {
            i.style.filter = 'brightness(0.7)';
        });
        img.style.filter = 'brightness(1)';
    });
  });


  var fp1 = document.getElementById("fp1");
  var fp2 = document.getElementById("fp2");
  var fp3 = document.getElementById("fp3");
  var fp4 = document.getElementById("fp4");
  var fp5 = document.getElementById("fp5");
  var fp6 = document.getElementById("fp6");
  var ap1 = document.getElementById("ap1");
  var ap2 = document.getElementById("ap2");
  var ap3 = document.getElementById("ap3");
  var ap4 = document.getElementById("ap4");
  var freeAppButton = document.getElementById("free");
  var archAppButton = document.getElementById("arch");
  var freeButton = document.getElementById("free-button");
  var archButton = document.getElementById("arch-button");

  freeAppButton.addEventListener("change", function() {
    fp1.style.display = "flex";
    fp2.style.display = "flex";
    fp3.style.display = "flex";
    fp4.style.display = "flex";
    fp5.style.display = "flex";
    fp6.style.display = "flex";
    ap1.style.display = "none";
    ap2.style.display = "none";
    ap3.style.display = "none";
    ap4.style.display = "none";
    freeButton.style.border = "thin solid #4ea4b9";
    archButton.style.border = "1.5px solid #888785";
  }); 

  archAppButton.addEventListener("change", function() {
    fp1.style.display = "none";
    fp2.style.display = "none";
    fp3.style.display = "none";
    fp4.style.display = "none";
    fp5.style.display = "none";
    fp6.style.display = "none";
    ap1.style.display = "block";
    ap2.style.display = "block";
    ap3.style.display = "block";
    ap4.style.display = "block";
    freeButton.style.border = "1.5px solid #888785";
    archButton.style.border = "thin solid #7F3F00";
  }); 

  });