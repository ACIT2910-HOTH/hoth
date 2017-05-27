$(document).ready(function() {
    var shopDisStatus = document.getElementById("shop_status");
    var shopSwitch = document.getElementById("switch");
    var showCustomer = document.getElementById("show_customer_accounts");
    var showChef = document.getElementById("show_employee_accounts");
    var showAdmin = document.getElementById("show_admin_accounts");
    var summary = document.getElementById("show_summary");
    var discardFood = document.getElementById("show_discard_food");
    var displayDiv = document.getElementById("container");
    var orderReportDiv = document.getElementById("order-report-div");
    var itemReportDiv = document.getElementById("item-report-div");
    var discardReportDiv = document.getElementById("discarded-report-div");
    var accountDiv = document.getElementById("table-div");
        generateOrder = document.getElementById("gen_order_report"),
        generateItem = document.getElementById("gen_item_report");

    generateOrder.addEventListener("click", function() {
        orderReportDiv.style.display = "inline";
        itemReportDiv.style.display = "none";
        accountDiv.style.display = "none";
        discardReportDiv.style.display = "none";

        $.ajax({
            url:"/report",
            type:"post",
            data: {
                type: "order"
            },
            success:function(resp) {
                var table = document.getElementById("table");
                var orderSumDiv = document.getElementById("order-summary");
                orderSumDiv.remove();
                table.remove();
                
                reportTableHeader(orderReportDiv, "Order ID", "Total Price", "Customer");
                var newT1 = document.getElementById("table");

                for (key in resp.result) {               
                    
                    listReports(newT1,resp.result[key].order_id, "$" + resp.result[key].total_price, resp.result[key].customer);

                    /*var reportWrapper = document.createElement("div");
                    reportWrapper.className = "report-wrapper";

                    var orderIdDiv = document.createElement("div");
                    orderIdDiv.className = "report-data";
                    var totalPriceDiv = document.createElement("div");
                    totalPriceDiv.className = "report-data";
                    var customerDiv = document.createElement("div");
                    customerDiv.className = "report-data";

                    orderIdDiv.innerHTML = resp.result[key].order_id;
                    totalPriceDiv.innerHTML = "$" + resp.result[key].total_price;
                    customerDiv.innerHTML = resp.result[key].customer;

                    reportWrapper.appendChild(orderIdDiv);
                    reportWrapper.appendChild(totalPriceDiv);
                    reportWrapper.appendChild(customerDiv);
                    orderReportDiv.appendChild(reportWrapper);*/
                }

                var orderSumDiv = document.createElement("div");
                orderSumDiv.id = "order-summary";
                orderSumDiv.className = "report-wrapper";
                orderSumDiv.innerHTML = "<h4>Total: $" + resp.result["0"].sum + "</h4>";
                orderReportDiv.appendChild(orderSumDiv);
            }
        });
    });

    generateItem.addEventListener("click", function() {
        orderReportDiv.style.display = "none";
        itemReportDiv.style.display = "inline";
        accountDiv.style.display = "none";
        discardReportDiv.style.display = "none";

        $.ajax({
            url:"/report",
            type:"post",
            data: {
                type: "item"
            },
            success:function(resp) {
                var table = document.getElementById("table");
                table.remove();
                
                reportTableHeader(itemReportDiv, "Item Name", "Total Price", "Quantity");
                var newT1 = document.getElementById("table");

                for (var i = 0; i < resp.length; i++) {

                    listReports(newT1, resp[i].item_name, "$" + resp[i].price, resp[i].quantity);

                    /*var reportWrapper = document.createElement("div");
                    reportWrapper.className = "report-wrapper";

                    var itemNameDiv = document.createElement("div");
                    itemNameDiv.className = "report-data";
                    var totalPriceDiv = document.createElement("div");
                    totalPriceDiv.className = "report-data";
                    var quantityDiv = document.createElement("div");
                    quantityDiv.className = "report-data";

                    itemNameDiv.innerHTML = resp[i].item_name;
                    totalPriceDiv.innerHTML = "$" + resp[i].price;
                    quantityDiv.innerHTML = resp[i].quantity;

                    reportWrapper.appendChild(itemNameDiv);
                    reportWrapper.appendChild(totalPriceDiv);
                    reportWrapper.appendChild(quantityDiv);
                    itemReportDiv.appendChild(reportWrapper);*/
                }
            }
        });
    });
    
    $.ajax({
        url:"/get/shopstatus",
        type:"post",
        success:function(resp){
            if(resp.shopStatus == 0){
                shopDisStatus.innerHTML = "Shop is Closed";
                shopSwitch.checked = false;
            } else{
                shopDisStatus.innerHTML = "Shop is Open";
                shopSwitch.checked = true;
            }
        }
    });
    
    shopSwitch.addEventListener("click",function(){
        
        if(shopSwitch.checked){
            $.ajax({
                url:"/open/close",
                type:"post",
                data:{
                    shopStatus:1
                },
                success:function(resp){
                    shopSwitch.checked = true;
                    shopDisStatus.innerHTML = "Shop is Open";
                }
            })
        } else{
            if(confirm("Are you sure you want to close the shop?")){
                $.ajax({
                url:"/open/close",
                type:"post",
                data:{
                    shopStatus:0
                },
                success:function(resp){
                    shopSwitch.checked = false;
                    shopDisStatus.innerHTML = "Shop is Closed";
                }
            })
            } else{
                shopSwitch.checked = true;
            }
        }
    });
    
    showChef.addEventListener("click",function(){
        orderReportDiv.style.display = "none";
        itemReportDiv.style.display = "none";
        accountDiv.style.display = "inline";
        discardReportDiv.style.display = "none";
      
        $.ajax({
            url:"/get/accounts",
            type:"post",
            data:{
                id:"E"
            },
            success:function(resp){
                
                var table = document.getElementById("table");
                table.remove();
                
                listTableHeader();
                var newT1 = document.getElementById("table")
                
                for(var i =0 ;i< resp.length;i++){
                    listAccounts(newT1,resp[i].user_id,resp[i].username,resp[i].email,resp[i].first_name,resp[i].last_name,"E")
                }
            }
        })
        
    });
    
    showAdmin.addEventListener("click",function(){
        orderReportDiv.style.display = "none";
        itemReportDiv.style.display = "none";
        accountDiv.style.display = "inline";
        discardReportDiv.style.display = "none";
      
        $.ajax({
            url:"/get/accounts",
            type:"post",
            data:{
                id:"A"
            },
            success:function(resp){
               
                var table = document.getElementById("table");
                table.remove();
                
                listTableHeader();
                var newT1 = document.getElementById("table")
                
                for(var i =0 ;i< resp.length;i++){
                     listAccounts(newT1,resp[i].user_id,resp[i].username,resp[i].email,resp[i].first_name,resp[i].last_name,"A")
                }
            }
        })
        
    });
    
    showCustomer.addEventListener("click",function(){
        orderReportDiv.style.display = "none";
        itemReportDiv.style.display = "none";
        accountDiv.style.display = "inline";
        discardReportDiv.style.display = "none";
      
        $.ajax({
            url:"/get/accounts",
            type:"post",
            data:{
                id:"C"
            },
            success:function(resp){
                
                var table = document.getElementById("table");
                table.remove();
                
                listTableHeader();
                var newT1 = document.getElementById("table")
                
                for(var i =0 ;i< resp.length;i++){
                 listAccounts(newT1,resp[i].user_id,resp[i].username,resp[i].email,resp[i].first_name,resp[i].last_name,"C")
                }
            }
        })
        
    });
    
    /*summary.addEventListener("click",function(){
       
        $.ajax({
            url:"/order/summary",
            type:"post",
            success:function(resp){
                console.log(resp)
                var table = document.getElementById("table");
                table.remove();
                
                listSummaryHeader(resp.totalIncome,resp.orderNumber);
				var newT1 = document.getElementById("table")
                for(var i = 0; i < resp.rows.length;i++){
                    listOrders(newT1,resp.rows[i].order_id,resp.rows[i].customer,resp.rows[i].created,resp.rows[i].total_price)
                }
            }
        })
    });*/
	
	discardFood.addEventListener("click",function(){
        orderReportDiv.style.display = "none";
        itemReportDiv.style.display = "none";
        accountDiv.style.display = "none";
        discardReportDiv.style.display = "inline";

        $.ajax({
            url:"/report",
            type:"post",
            data: {
                type: "discarded"
            },
            success:function(resp) {
                var table = document.getElementById("table");
                table.remove();
                
                reportTableHeader(discardReportDiv, "Item Name", "Total Price", "Quantity");
                var newT1 = document.getElementById("table");

                for (var i = 0; i < resp.length; i++) {

                    listReports(newT1, resp[i].item_name, "$" + resp[i].price * resp[i].quantity, resp[i].quantity);

                    /*var reportWrapper = document.createElement("div");
                    reportWrapper.className = "report-wrapper";

                    var itemNameDiv = document.createElement("div");
                    itemNameDiv.className = "report-data";
                    var totalPriceDiv = document.createElement("div");
                    totalPriceDiv.className = "report-data";
                    var quantityDiv = document.createElement("div");
                    quantityDiv.className = "report-data";

                    itemNameDiv.innerHTML = resp[i].item_name;
                    totalPriceDiv.innerHTML = "$" + resp[i].price * resp[i].quantity;
                    quantityDiv.innerHTML = resp[i].quantity;

                    reportWrapper.appendChild(itemNameDiv);
                    reportWrapper.appendChild(totalPriceDiv);
                    reportWrapper.appendChild(quantityDiv);
                    discardReportDiv.appendChild(reportWrapper);*/
                }
            }
        });

        /*$.ajax({
            url:"/discard",
            type:"post",
            success:function(resp){
                console.log(resp)
                var table = document.getElementById("table");
                table.remove();
                
                var newT = document.createElement("table");
				newT.className = "table";
				newT.id = "table";
				
				var header = newT.insertRow();
				var headcel0 = header.insertCell(0);
				var headcel1 = header.insertCell(1);
				headcel0.innerHTML = "<b>Item name</b>";
				headcel1.innerHTML = "<b>Discard number</b>";
				displayDiv.appendChild(newT);
				
                for(var i = 0; i < resp.length;i++){
                    listDiscardItem(newT,resp[i].item_name,resp[i].numbers)
                }
            }
        })*/
    });
    
    
    
    function listTableHeader(){
        var newT = document.createElement("table");
        newT.className = "table";
        newT.id = "table";
        var row = newT.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        var cel4 = row.insertCell(4);
        var cel5 = row.insertCell(5);
        cel0.innerHTML = "<b>User Name</b>";
        cel1.innerHTML ="<b>Email</b>";
        cel2.innerHTML ="<b>First Name</b>";
        cel3.innerHTML ="<b>Last Name</b>";
        cel4.innerHTML ="<b>Auth_Level</b>";

        accountDiv.appendChild(newT);
	}

    function reportTableHeader(div_to_append, header1, header2, header3){
        var newT = document.createElement("table");
        newT.className = "table";
        newT.id = "table";
        var row = newT.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        cel0.innerHTML = "<h4>" + header1 + "</h4>";
        cel1.innerHTML ="<h4>" + header2 + "</h4>";
        cel2.innerHTML ="<h4>" + header3 + "</h4>";

        div_to_append.appendChild(newT);
	}

    function orderSummary(total_price) {

    }
    
    function listAccounts(newtable,userId,username,email,firstName,lastName,authLevel){
		
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        var cel4 = row.insertCell(4);
        var cel5 = row.insertCell(5);
        var selectO = document.createElement("select");
        var op1 = document.createElement("option");
        var op2 = document.createElement("option");
        var op3 = document.createElement("option");
        var updateB = document.createElement("button")
        selectO.id = "select-"+userId;
        op1.value = "C";
        op1.innerHTML = "Customer";
        op2.value = "E";
        op2.innerHTML = "Chef";
        op3.value = "A"
        op3.innerHTML = "Admin"
        selectO.appendChild(op1)
        selectO.appendChild(op2)
        selectO.appendChild(op3)
        if(authLevel == "C"){
            selectO.selectedIndex = 0;
        } else if (authLevel == "E"){
            selectO.selectedIndex = 1;
        } else if (authLevel == "A"){
            selectO.selectedIndex = 2;
        }
        
        
        updateB.innerHTML = "Update";
        updateB.id = "Upbutton"+ userId;

        cel0.innerHTML = username;
        cel1.innerHTML = email;
        cel2.innerHTML = firstName;
        cel3.innerHTML = lastName;
        cel4.appendChild(selectO);
        cel5.appendChild(updateB)
        
        updateB.addEventListener("click",function(){
            var auth_level = document.getElementById("select-"+userId);
            var currentUser = userId;
            $.ajax({
                url:"/auth",
                type:"post",
                data:{
                    user:currentUser,
                    auth:auth_level.value
                },
                success:function(resp){
					alert("Updated account auth")
				}
            });
            
        });
        
        
    }

    function listReports(newtable,data1,data2,data3){
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);

        cel0.innerHTML = data1;
        cel1.innerHTML = data2;
        cel2.innerHTML = data3; 
    }
	
    
    function listSummaryHeader(income,orderNumber){
        var newT = document.createElement("table");
        newT.className = "table";
        newT.id = "table";
        
        var header = newT.insertRow();
        var headcel0 = header.insertCell(0);
        var headcel1 = header.insertCell(1);
        headcel0.innerHTML = "<b>Total Order Number is </b>" + orderNumber;
        headcel1.innerHTML = "<b>Total income is $ </b> " + income;
        
        var row = newT.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        
        cel0.innerHTML = "<b>Order Id</b>";
        cel1.innerHTML ="<b>customer</b>";
        cel2.innerHTML ="<b>Time Created</b>";
        cel3.innerHTML ="<b>Total Price</b>";
        

        displayDiv.appendChild(newT);
	}
		
				
	function listOrders(newtable,orderId,username,time,price){
        
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        var cel2 = row.insertCell(2);
        var cel3 = row.insertCell(3);
        
        

        cel0.innerHTML = orderId;
        cel1.innerHTML = username;
        cel2.innerHTML = time;
        cel3.innerHTML = price;
        
    }
	
	function listDiscardItem(newtable,ItemName,Quantity){
        
        var row = newtable.insertRow();
        var cel0 = row.insertCell(0);
        var cel1 = row.insertCell(1);
        
        
        

        cel0.innerHTML = ItemName;
        cel1.innerHTML = Quantity;
       
        
    }

});