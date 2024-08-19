document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("project1").addEventListener("click", function(){
        window.location.href = "/project/editor";
        var c = "c1";
        var t = "t1";
        localStorage.setItem("v", 1);
    });

    document.getElementById("project2").addEventListener("click", function(){
      window.location.href = "/project/editor";
      var c = "c2";
      var t = "t2";
      localStorage.setItem("v", 2);
    });

    document.getElementById("project3").addEventListener("click", function(){
      window.location.href = "/project/editor";
      var c = "c3";
      var t = "t3";
      localStorage.setItem("v", 3);
    });

    document.getElementById("project4").addEventListener("click", function(){
      window.location.href = "/project/editor";
      var c = "c4";
      var t = "t4";
      localStorage.setItem("v", 4);
    });
    
    document.getElementById("project5").addEventListener("click", function(){
      window.location.href = "/project/editor";
      var c = "c5";
      var t = "t5";
      localStorage.setItem("v", 5);
    });
    
    document.getElementById("project6").addEventListener("click", function(){
      window.location.href = "/project/editor-free";
      var c = "c6";
      var t = "t6";
      localStorage.setItem("vi", 6);
    });
    
    document.getElementById("project7").addEventListener("click", function(){
      window.location.href = "/project/editor-free";
      var c = "c7";
      var t = "t7";
      localStorage.setItem("vi", 7);
    });
    
    document.getElementById("project8").addEventListener("click", function(){
      window.location.href = "/project/editor-free";
      var c = "c8";
      var t = "t8";
      localStorage.setItem("vi", 8);
    });
    
    document.getElementById("project9").addEventListener("click", function(){
      window.location.href = "/project/editor-free";
      var c = "c9";
      var t = "t9";
      localStorage.setItem("vi", 9);
    });
    
    document.getElementById("project10").addEventListener("click", function(){
      window.location.href = "/project/editor-free";
      var c = "c10";
      var t = "t10";
      localStorage.setItem("vi", 10);
    });

    function handleProjectClick(){
      var projectType = document.querySelector('input[name="project-type"]:checked').value;
      var container1 = document.getElementById("container1");
      var container2 = document.getElementById("container2");
      var gallery1 = document.getElementById("pin-container");
      var gallery2 = document.getElementById("pin-container-2");
  
      if(projectType === "arch"){
          container1.style.display = "flex";
          container2.style.display = "none";
          gallery1.style.display = "none";
          gallery2.style.display = "grid";
      }
      else if(projectType === "free"){
          container1.style.display = "none";
          container2.style.display = "flex";
          gallery1.style.display = "grid";
          gallery2.style.display = "none";
      }    
  }
  
  var projectClicked = document.getElementsByName("project-type");
  
  for (var i = 0; i < projectClicked.length; i++) {
      projectClicked[i].addEventListener('change', function() { handleProjectClick();});
  }
});

function activateBtn1() {
  document.querySelector('.btn1').classList.add('active');
  document.querySelector('.btn2').classList.remove('active');
}

function activateBtn2() {
  document.querySelector('.btn2').classList.add('active');
  document.querySelector('.btn1').classList.remove('active');
}