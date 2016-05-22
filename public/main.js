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
    $('#parse').click(function() {
      try {
        var result = pl0.parse($('#input').val());
        $('#output').html(JSON.stringify(result,undefined,2));
      } catch (e) {
        $('#output').html('<div class="error"><pre>\n' + String(e) + '\n</pre></div>');
      }
    });
    
    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
    
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
    }
  
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
  });

  let dropZone = $('#input')[0];
  dropZone.addEventListener('drop', handleDragFileSelect, false);
})();