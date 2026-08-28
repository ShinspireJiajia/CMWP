// 共用分頁元件：FE_05／FE_07／FE_09 皆用同一套 .pg-left/.pg-info/.pg-size-select/.pg-btn 渲染與換頁邏輯
// 用法：var pager=FePager(pagination,{pageSizeOptions:[10,30,50],getList:function(){...},renderRows:function(pageItems){...}});
//      清單資料變動後呼叫 pager.render()；篩選條件改變需回到第 1 頁則呼叫 pager.reset()
function FePager(container,options){
  var pageSizeOptions=options.pageSizeOptions||[10,30,50];
  var pageSize=pageSizeOptions[0];
  var currentPage=1;
  var getList=options.getList;
  var renderRows=options.renderRows;

  function totalPages(list){return Math.max(1,Math.ceil(list.length/pageSize));}

  function renderControls(total,tp){
    var html='<div class="pg-left"><span class="pg-info">共 '+total+' 筆，第 '+currentPage+'／'+tp+' 頁</span>';
    html+='<label class="pg-size">每頁<select class="pg-size-select">'+pageSizeOptions.map(function(n){
      return '<option value="'+n+'"'+(n===pageSize?' selected':'')+'>'+n+'</option>';
    }).join('')+'</select>筆</label></div>';
    html+='<button type="button" class="pg-btn nav" id="pgPrev"'+(currentPage===1?' disabled':'')+'>‹ 上一頁</button>';
    for(var i=1;i<=tp;i++){
      html+='<button type="button" class="pg-btn'+(i===currentPage?' is-current':'')+'" data-page="'+i+'">'+i+'</button>';
    }
    html+='<button type="button" class="pg-btn nav" id="pgNext"'+(currentPage===tp?' disabled':'')+'>下一頁 ›</button>';
    container.innerHTML=html;
  }

  function render(){
    var list=getList();
    var tp=totalPages(list);
    if(currentPage>tp)currentPage=tp;
    var start=(currentPage-1)*pageSize;
    renderRows(list.slice(start,start+pageSize));
    renderControls(list.length,tp);
  }

  container.addEventListener('click',function(e){
    var t=e.target;
    if(t.id==='pgPrev'){if(currentPage>1){currentPage--;render();}return;}
    if(t.id==='pgNext'){if(currentPage<totalPages(getList())){currentPage++;render();}return;}
    if(t.dataset&&t.dataset.page){currentPage=parseInt(t.dataset.page,10);render();}
  });

  container.addEventListener('change',function(e){
    var t=e.target;
    if(t.classList&&t.classList.contains('pg-size-select')){
      pageSize=parseInt(t.value,10);
      currentPage=1;
      render();
    }
  });

  return{
    render:render,
    reset:function(){currentPage=1;render();}
  };
}
