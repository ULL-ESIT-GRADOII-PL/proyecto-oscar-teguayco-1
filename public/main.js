(() => {
"use strict";

  // función para volcar el contenido del fichero arrastrado al textarea
  const handleDragFileSelect = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
  
    var files = evt.dataTransfer.files; // FileList object.
  
    var reader = new FileReader();
    reader.onload = (e) => {
      $("#input").val(e.target.result);
      evt.target.style.background = "purple";
    };
    
    reader.readAsText(files[0]);
  }

  $(document).ready(function() {
    let textarea = document.getElementById("input");
    if (window.localStorage && localStorage.textarea) {
      textarea.value = localStorage.textarea;
    }
    
    $('#parse').click(function() {
      if (window.localStorage) localStorage.textarea = textarea.value;
      try {
        var result = pl0.parse($('#input').val());
        $('#output').html(JSON.stringify(result,undefined,2));
      } catch (e) {
        $('#output').html('<div class="error"><pre>\n' + String(e) + '\n</pre></div>');
      }
    });
  
    // volcando contenido del fichero seleccionado al textarea
    $("#examples").change(function(ev) {
      var f = ev.target.files[0]; 
      var r = new FileReader();
      r.onload = function(e) { 
        var contents = e.target.result;
        input.innerHTML = contents;
      }
      r.readAsText(f);
    });
    
    // Descargar el AST en un fichero example.pl0
    $("#download").click(function() {
      console.log("download");
      var text = [];
      text[0] = $('#output').text();
      
      // si hay contenido, descargamos
      if (text[0] != "") {
        var blob = new Blob(text);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "ast.txt";
        link.click();
      }
    });
  });

  let dropZone = $('#input')[0];
  dropZone.addEventListener('drop', handleDragFileSelect, false);
})();