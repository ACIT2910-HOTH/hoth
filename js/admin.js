$(document).ready(function(){
	var addbut = document.getElementById("addbut");
    var ic = document.getElementById("item-code");
	var itemName = document.getElementById("item-name");
	var itemCat = document.getElementById("item-cat");
	var itemDesc = document.getElementById("item-desc");
	var itemPrice = document.getElementById("item-price");
	var itemImg = document.getElementById("item-image");
	var okayBut = document.getElementById("okayBut");
	var mealDiv = document.getElementById("meal-items");
	var appDiv = document.getElementById("app-items");
	var drinkDiv = document.getElementById("drink-items");
	var dessertDiv = document.getElementById("dessert-items");
    var priceUpMess = document.getElementById("price-updated");
    var pictureUpMess = document.getElementById("picture-updated");
    var submitBut = document.getElementById("image-submit");
    
    
    var imgSubmitCheck = 0;
    var itemCode;
    var fileNameSplit;
    var fileName;
    
    $.ajax({
        url:"/meals",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, mealDiv, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    $.ajax({
        url:"/appetizers",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, appDiv, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    $.ajax({
        url:"/drinks",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, drinkDiv, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    $.ajax({
        url:"/desserts",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, dessertDiv, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    function createItem(i, divname, item_name, item_code, price, filename, description) {
        var container  = document.createElement("div");
        container.className = "col-lg-2 col-md-4 col-sm-6 col-xs-12";
		container.id = "container-"+item_code;
        var panel = document.createElement("div");
        panel.className = "panel panel-default text-center";
        
        var panelHeading = document.createElement("div");
        panelHeading.className = "panel-heading head";

        panelHeading.innerHTML = "<h2>" + item_name + "</h2>";
		var deleteDiv = document.createElement("div");
		deleteDiv.className = "deleteDiv"
		deleteDiv.innerHTML = "X"
		panel.appendChild(deleteDiv);

    
        var imgDiv = document.createElement("div");
        imgDiv.className = "menu-imgs";
        
        var panelBody = document.createElement("div");
        panelBody.className = "panel-body body";
        var newImg = document.createElement("img");
        newImg.src = "/images/" + filename;
        newImg.className = "menu";
        imgDiv.appendChild(newImg);
        panelBody.appendChild(imgDiv);
        
        var panelFooter = document.createElement("div");
        panelFooter.className = "panel-footer foot";
        var h4 = document.createElement("h4");
        h4.innerHTML = description;
        var priceIn = document.createElement("input");
        priceIn.type = 'number';
        priceIn.min = '0';
        priceIn.max = '100';
        priceIn.value = price;
        priceIn.id = "priceIn-" + item_code;
		
		

		
		
        panelFooter.appendChild(h4);
        panelFooter.appendChild(priceIn);
		

        var controlDiv = document.createElement("div");
        var form = document.createElement("div");
        form.id = "form-" + item_code;
        form.className = "item-control-form";
        
        var updataPrice = document.createElement("input");
        updataPrice.type = "submit";
        updataPrice.value = "Update Price";
        updataPrice.id = "upDate-" + item_code;
        updataPrice.className = "btn btn-lg";

        form.appendChild(updataPrice);
        panelFooter.appendChild(form);
        panel.appendChild(panelHeading);
        panel.appendChild(panelBody);
        panel.appendChild(panelFooter)
        container.appendChild(panel);
        divname.appendChild(container);
		
		deleteDiv.addEventListener("click",function(){
			if(confirm("Delete this item?")){
				$.ajax({
					url:"/delete/item",
					type:"post",
					data:{
						item:item_code
					},
					success:function(resp){
						document.getElementById("container-"+item_code).remove();
					}
				})
			   }
		})
        
        updataPrice.addEventListener("click", function(event) {
            var updatedPrice = document.getElementById("priceIn-" + item_code);
            var itemCode = item_code;
            
            
            if(updatedPrice.value < 0){
                alert("price must be positive")
            } else {
                $.ajax({
                    url:"/change/price",
                    type:"post",
                    data:{
                        price: parseFloat(updatedPrice.value),
                        item:item_code
                    },
                    success:function(resp){
                        priceUpMess.style.bottom = '2vh';
                        setTimeout(function(){
                            priceUpMess.style.bottom = '-5vh';
                        },2000);
                        
                        
                        
                    }
                    
                });
            }
            
            
        });
    }
    
    submitBut.addEventListener("click",function(){
        
        
        
        if(itemName.value == ''){
            alert("Must fill item information first")
        } else{
            itemCode = itemName.value.replace(/ /g,"_")
            fileNameSplit = itemImg.files.item(0).name.split(".")
            fileName = itemCode +'.'+fileNameSplit[1].toLowerCase();
            $.ajax({
                url:"filename",
                type:"post",
                data:{
                    fileName:fileName
                }
            })
        
            var files = $(itemImg).get(0).files;
        

            if (files.length > 0){
                var formData = new FormData();
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    formData.append('uploads[]', file, file.name);
                }
                $.ajax({
                    url: '/upload',
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(data){
                        console.log('upload successful!\n' + data);
                        imgSubmitCheck = 1;
                        pictureUpMess.style.display = 'block';
                        setTimeout(function(){
                            pictureUpMess.style.display = 'none';
                        },2000);
                        
                        
                    },
      
            
        });
        }
        }
        
        });
        
    
	
	okayBut.addEventListener("click", function(){
        if(imgSubmitCheck == 0){
            alert("Don't forget submit your image")
        } else{
            var category;
            var targetDiv;
            
            if(itemCat.value == "Appetizers"){
                category = 'a';
                targetDiv = appDiv;
            }
            if(itemCat.value == "Desserts"){
                category = 'd';
                targetDiv = dessertDiv;
            }
            if(itemCat.value == "Drinks"){
                category = 'b';
                targetDiv = drinkDiv;
            }
            if(itemCat.value == "Meals"){
                category = 'm';
                targetDiv = mealDiv;
            }
            $.ajax({
                url:"/adminItems",
                type:"post",
                data:{
                    itemCode:ic.value,
                    fileName:fileName,
                    category:category,
				    name: itemName.value,
				    img:itemImg.value	,
				    desc:itemDesc.value,
				    price: itemPrice.value,
				    type:"create"	
                },
                success:function(resp){
                    console.log(resp);
                    var i=1;
				    if(resp.status == "success"){
                        createItem(i, targetDiv, resp.name, resp.item_code, resp.price, resp.filename, resp.desc);
                        imgSubmitCheck = 0;

				}
			}
		});	
            
        }
	
	});
    

	

	
});