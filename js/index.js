$(function(){
	
$("body").on("click",".table-title",function(){
	$(this).hide();
	$(this).siblings(".table-content").show();
});

$("body").on("click",".tableMini",function(){
	$(this).parent(".table-content").hide();
	$(this).parent(".table-content").siblings(".table-title").show();
});

$("body").on("change",".table-title-input",function(){
	$(this).parent(".table-content").siblings(".table-title").html($(this).val());
});

$("body").on("click",".delete-field",function(){
	$(this).parent("li").remove();
});

$("body").on("click",".delete-table",function(){
	$(this).parents(".table").remove();
});

$("body").on("click",".add-field",function(){
	$(this).siblings(".fields").append(
		"<li>"+
			"<input class='field-name' placeholder='字段名'/>"+
			"<select><option selected = 'selected'>字符型</option><option>数值型</option></select>"+
			"<p class='delete-field'>X</p>"+
		"</li>"
	);
});

$("#addTable").click(function(){
	$("#tables").append("<div class='table'>"+
		"<div class='table-title' style='display:none;'></div>"+
		"<div class='table-content'>"+
			"<button class='delete-table table-button-little'>X</button>"+
			"<button class='tableMini table-button-little'>--</button>"+
			"<input  class='table-title-input' placeholder='表名'/>"+
			"<ul class='fields'>"+
				"<li>"+
					"<input class='field-name' placeholder='字段名'/>"+
					"<select><option selected = 'selected'>字符型</option><option>数值型</option></select>"+
					"<p class='delete-field'>X</p>"+
				"</li>"+
			"</ul>"+
			"<button class='add-field' >添加字段</button>"+
		"</div>"+
	"</div>");
});

$("#generate").click(function(){
	var emptyTitle = false;
	var emptyField = false;
	//整合表结构
	var tables = [];
	$(".table").each(function(){
		var table = {};
		var title = $(this).find(".table-title").html();
		if(title.trim()==""){
			emptyTitle = true;
			return;
		}
		table["title"] = title;
		var fields = [];
		$(this).find(".table-content .fields .field-name").each(function(){
			if($(this).val().trim()!="")
				fields.push($(this).val());
		});
		if(fields.length<=0){
			emptyField = true;
			return;
		}
		table["fields"] = fields;
		tables.push(table);
	});
	if(emptyTitle){
		layer.alert("表名不可为空！");
		return;
	}
	if(emptyField){
		layer.alert("表格需至少填写一个字段！");
		return;
	}
	//json序列化并发送给generated.html  
	if (window.localStorage) {  
		localStorage.data = JSON.stringify(tables);  
		location.href = './generated.html';  
	} else {  
		window.location.href="./generated.html?data="+JSON.stringify(tables); 
	}
});

$("#addTable").click();

});