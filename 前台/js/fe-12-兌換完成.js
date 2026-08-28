(function(){
  var pnr=sessionStorage.getItem('rdmPnr');
  if(pnr){document.getElementById('pnrVal').textContent=pnr;}
})();