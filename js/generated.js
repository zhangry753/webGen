$(function(){
//获取传递的table信息	
var data;
if (window.localStorage) {
	data = localStorage["data"];
} else {  
	data = UrlParam.paramValues("data");
}
var tables = JSON.parse(data);
//动态添加table
for(var i=0;i<tables.length;i++){
	$("#navigate").append("<div class='table-title' myValue='"+i+"'><i class='fa fa-file'></i> "+tables[i].title+"</div>");
	var htmlStr = 
		"<div class='table-wrap' name='"+i+"'>"+
			"<table class='table'>"+
				"<thead>";
	for(var j=0;j<tables[i].fields.length;j++){
		htmlStr += "<th>"+tables[i].fields[j]+"</th>";
	}
	htmlStr += "<th>操作</th>"+
				"</thead>"+
				"<tbody>"+
				"</tbody>"+
			"</table>"+
			"<button class='add'><i class='fa fa-plus'></i> 添加新行</button>"+
		"</div>";
	$("#content").append(htmlStr);
}

$(".table-title").click(function(){
	$(this).addClass("select");
	$(this).siblings().removeClass("select");
	var $table = $(".table-wrap[name='"+$(this).attr("myValue")+"']");
	$table.siblings(".table-wrap").hide();
	$table.show();
});
	
$(".add").click(function(){
	var fieldCount = $(this).siblings("table").find("th").length-1;
	var htmlStr = "<tr>";
	for(var i=0;i<fieldCount;i++){
		htmlStr += "<td></td>";
	}
	htmlStr += "<td name='buttons'>"+
				"<i class='fa fa-pencil line-button edit' id='bEdit'></i>"+
				"<i class='fa fa-trash line-button delete' id='bElim'></i>"+
				"<i class='fa fa-check line-button accept' id='bAcep' style='display:none;'></i>"+
				"<i class='fa fa-close line-button cancel' id='bCanc' style='display:none;'></i>"+
			"</td>"+
		"</tr>";
	$(this).siblings("table").children("tbody").append(htmlStr);
});

$("body").on("click",".delete",function(){
	$(this).parents("tr").remove();
});
$("body").on("click",".edit",function(){
	rowEdit(this);
});
$("body").on("click",".accept",function(){
	rowAcep(this);
});
$("body").on("click",".cancel",function(){
	rowCancel(this);
});

$("#navigate .table-title").eq(0).click();
	
});

//----------------------------------------------bootstable-------------------------------------------------------------
var colsEdi = null;
function IterarCamposEdit($cols, tarea) {
//Itera por los campos editables de una fila
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  //excluye columna de botones
        if (!EsEditable(n-1)) return;   //noe s campo editable
        tarea($(this));
    });
    
    function EsEditable(idx) {
    //Indica si la columna pasada está configurada para ser editable
        if (colsEdi==null) {  //no se definió
            return true;  //todas son editable
        } else {  //hay filtro de campos
//alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontró
        }
    }
}
function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}
function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que está en edición
}
function ModoEdicion($row) {
    if ($row.attr('id')=='editing') {
        return true;
    } else {
        return false;
    }
}
function rowAcep(but) {
//Acepta los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
      var cont = $td.find('input').val(); //lee contenido del input
      $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}
function rowCancel(but) {
//Rechaza los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}
function rowEdit(but) {  //Inicia la edición de una fila
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (ModoEdicion($row)) return;  //Ya está en edición
    //Pone en modo de edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.html(); //lee contenido
        var div = '<div style="display: none;">' + cont + '</div>';  //guarda contenido
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        $td.html(div + input);  //fija contenido
    });
    FijModoEdit(but);
}
//----------------------------------------------bootstable-------------------------------------------------------------