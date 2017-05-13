$(document).ready(function() {    
    // heroku deployment test
    var signInButton = document.getElementById("sign_in");
    var appetizers = document.getElementById("appetizers");
    var desserts = document.getElementById("desserts");
    var drinks = document.getElementById("drinks");
    var meals = document.getElementById("meals");
    var mealsDiv = document.getElementById("meals_div");
    var appetizersDiv = document.getElementById("appetizers_div");
    var dessertsDiv = document.getElementById("desserts_div");
    var drinksDiv = document.getElementById("drinks_div");
    var holderDiv = document.getElementById("holder");
    var warningDiv = document.getElementById("warning");
    var checkoutButton = document.getElementById("checkout")
    
    document.addEventListener("scroll", function() {
        warningDiv.style.display = "none";
    });
    
    var app_digit = 0;
    var bev_digit = 0;
    var meals_digit = 0;
    var des_digit = 0;
    
    var orders = {};
    var total_price = 0;

    $.ajax({
        url:"/meals",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, meals, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    $.ajax({
        url:"/appetizers",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, appetizers, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    $.ajax({
        url:"/drinks",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, drinks, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    $.ajax({
        url:"/desserts",
        type:"post",
        success:function(resp) {
            for (var i = 0; i < resp.length; i++) {
                createItem(i, desserts, resp[i].item_name, resp[i].item_code, resp[i].price, resp[i].filename, resp[i].description)
            }
        }
    });
    
    function createItem(i, divname, item_name, item_code, price, filename, description) {
        var container  = document.createElement("div");
        container.className = "col-lg-2 col-md-4 col-sm-6 col-xs-12";
        var panel = document.createElement("div");
        panel.className = "panel panel-default text-center";
        
        var panelHeading = document.createElement("div");
        panelHeading.className = "panel-heading head";
        panelHeading.innerHTML = "<h3>" + item_name + "</h3>";
        
        var panelBody = document.createElement("div");
        panelBody.className = "panel-body body";
        
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
        var h3 = document.createElement("h3");
        h3.innerHTML = "$" + price;
        panelFooter.appendChild(h4);
        panelFooter.appendChild(h3);

        var controlDiv = document.createElement("div");
        var form = document.createElement("form");
        form.id = "form-" + item_code;
        form.className = "item-control-form";
        form.action = "javascript:console.log('added');";
        form.method = "post";
        var quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.max = "5";
        quantityInput.name = "qty_input";
        quantityInput.id = "qty-" + item_code;
        quantityInput.className = "form-control";
        var submitCart = document.createElement("input");
        submitCart.type = "submit";
        submitCart.value = "Add to Cart";
        submitCart.id = "add-" + item_code;
        submitCart.className = "btn btn-lg";

        form.appendChild(quantityInput);
        form.appendChild(submitCart);
        panelFooter.appendChild(form);

        panel.appendChild(panelHeading);
        panel.appendChild(panelBody);
        panel.appendChild(panelFooter)
        container.appendChild(panel);
        divname.appendChild(container);

        var clearDiv = document.createElement("div");
        if ((i + 1) % 3 == 0) {
            clearDiv.className = "clearfix";
            divname.appendChild(clearDiv);
        }
        
        submitCart.addEventListener("click", function(event) {
            var cartItem = document.getElementById("cart-item-" + item_code);
            var itemQty = document.getElementById("qty-" + item_code);
            
            if (cartItem == null && quantityInput.value > 0 && quantityInput.value <= 5) {
                addToCart(item_name, item_code, price, quantityInput.value);

                orders[item_code] = parseInt(itemQty.value);
                
                total_price = total_price + (parseInt(itemQty.value) * parseFloat(price));
            } else if (cartItem != null) {
                warningDiv.style.display = "inline";
                warningDiv.innerHTML = "You already have this item in the cart.";
                warningDiv.style.top = event.pageY - 50 + "px";
                warningDiv.style.left = event.pageX + "px";
            }
        });
    }
    
    function addToCart(item_name, item_code, price, qty) {
        var container = document.createElement("div");
        container.className = "cart_items panel-default container-fluid";
        container.id = "cart-item-" + item_code;
        var deleteButton = document.createElement("div");
        deleteButton.className = "remove col-lg-1 col-md-1 col-sm-2 col-xs-2";
        deleteButton.id = "cart-delete-" + item_code;
        var deleteIcon = document.createElement("span");
        deleteIcon.className = "glyphicon glyphicon-remove";
        deleteButton.appendChild(deleteIcon);
        var itemName = document.createElement("div");
        itemName.className = "item col-lg-8 col-md-8 col-sm-6 col-xs-6";
        itemName.innerHTML = item_name;
        var qtyDiv = document.createElement("div");
        qtyDiv.className = "cart-items-qty col-lg-2 col-md-2 col-sm-3 col-xs-3";
        qtyDiv.id = "cart-items-qty-" + item_code;
        qtyDiv.innerHTML = qty + " x ";
        var priceDiv = document.createElement("div");
        priceDiv.className = "item-label col-lg-1 col-md-1 col-sm-2 col-xs-2";
        priceDiv.id = "cart-price-" + item_code;
        priceDiv.innerHTML = "$" + price;
        var form = document.createElement("form");
        form.id = "cart-form-" + item_code;
        form.className = "item-control-form";
        form.action = "javascript:console.log('updated');";
        form.method = "post";
        var cartQuantityInput = document.createElement("input");
        cartQuantityInput.type = "number";
        cartQuantityInput.min = "1";
        cartQuantityInput.max = "5";
        cartQuantityInput.name = "qty_input";
        cartQuantityInput.id = "cart-qty-" + item_code;
        cartQuantityInput.className = "item-control-input";
        var updateCart = document.createElement("input");
        updateCart.type = "submit";
        updateCart.value = "Update";
        updateCart.id = "cart-update-" + item_code;
        updateCart.className = "item-control-input";
        
        form.appendChild(cartQuantityInput);
        form.appendChild(updateCart);
        
        container.appendChild(deleteButton);
        container.appendChild(itemName);
        container.appendChild(qtyDiv);
        container.appendChild(priceDiv);
        container.appendChild(form);
        holderDiv.appendChild(container);
        
        var itemUpdate = document.getElementById("cart-update-" + item_code);
        var deleteItem = document.getElementById("cart-delete-" + item_code);
        var cartItem = document.getElementById("cart-item-" + item_code);
        
        itemUpdate.addEventListener("click", function() {
            var itemQty = document.getElementById("cart-qty-" + item_code);
            var itemPrice = document.getElementById("cart-price-" + item_code);
            orders[item_code] = parseInt(itemQty.value);
            
            qtyDiv.innerHTML = itemQty.value + " x ";
            console.log(orders);
        });
        
        deleteItem.addEventListener("click", function() {
            cartItem.parentNode.removeChild(cartItem);
            
            delete orders[item_code];
            
            console.log(orders);
        });
        
        console.log(orders);
    }
    
    checkoutButton.addEventListener("click",function(){
        $.ajax({
            url:"/orders",
            type:"post",
            data:{
                orders:orders
            },
            success:function(resp){
                location.href = "/orders";
        }
        })
    })
    
    
});