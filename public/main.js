(() => {
"use strict";

  const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var reader = new FileReader();
  reader.onload = (e) => {
    $("#input").val(e.target.result);
    evt.target.style.background = "purple";
  };
  
  reader.readAsText(files[0])
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


  let dropZone = $('.drop_zone')[0];
  dropZone.addEventListener('drop', handleDragFileSelect, false);
})();

  

