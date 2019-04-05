document.getElementById('submitExercise').addEventListener('click',function(event){              
	if(document.getElementById('exercise').value === "" || document.getElementById('date').value === ""){
		alert("Please fill out an exercise name and a date!");
		return;
	}

	var units;
	if(document.getElementById('lbs').checked){
		units = 1;                           
	}
	else{
		units = 0;
	}

	var param = "name=" + document.getElementById('exercise').value + 
			"&reps=" + document.getElementById('reps').value +
			"&weight=" + document.getElementById('weight').value +
			"&date=" + document.getElementById('date').value +
			"&lbs=" + units;

	var req = new XMLHttpRequest();
	req.open("GET", "/insert?" + param, true);              
	req.setRequestHeader('Content-Type','application/json');

	req.addEventListener('load', function(){                   
		if(req.status >= 200 && req.status < 400){
			document.getElementById('exercise').value = null;
			document.getElementById('reps').value = null;
			document.getElementById('weight').value = null;
			document.getElementById('date').value = null;

			var response = JSON.parse(req.responseText);  
			var table = document.getElementById("workouts"); 
			var row = document.createElement('tr');                        

			var exerciseName = document.createElement('td');              
			exerciseName.textContent = response.name;
			row.appendChild(exerciseName);

			var repsCounted = document.createElement('td');
			repsCounted.textContent = response.reps;
			row.appendChild(repsCounted);

			var weightLifted = document.createElement('td');
			weightLifted.textContent = response.weight;
			row.appendChild(weightLifted);
			
			var units = document.createElement('td');
			if(response.lbs == 1){
				units.textContent = "lb";
			}else{
			units.textContent = "kg";
			}
			row.appendChild(units);

			var dateDone = document.createElement('td');
			var format = new Date(response.date);
			format = [('0' + (format.getMonth() + 1)).slice(-2),('0' + format.getDate()).slice(-2),format.getFullYear()].join("-");
			dateDone.textContent = format;
			row.appendChild(dateDone);
			
			var updateData = document.createElement('td');  
			var updateLink = document.createElement('a');
			updateLink.setAttribute('href', 'updateTable?id=' + response.id)           
			var updateButton = document.createElement('button');        
			updateButton.setAttribute('name','update');      
			updateButton.setAttribute('type','button'); 
			updateButton.setAttribute('class', 'btn btn-info')
			updateButton.textContent = "Update";
			updateLink.appendChild(updateButton);
			updateData.appendChild(updateLink); 
			row.appendChild(updateData);                        

			var deleteData = document.createElement('td'); 
			deleteData.setAttribute('name', response.id);           
			var deleteButton = document.createElement('button');       
			deleteButton.setAttribute('type','button');
			deleteButton.setAttribute('name','delete');   
			deleteButton.setAttribute('class', 'btn btn-danger')                 
			deleteButton.setAttribute('onClick', 'deleteEntry(' + response.id + ')');
			deleteButton.textContent = "Delete";
			deleteData.appendChild(deleteButton);       
			row.appendChild(deleteData);  
			
			table.appendChild(row);
		}
		else {
			console.log(req.statusText);
		}
	});
	req.send("/insert?" + param);  
	event.preventDefault();                              
});

function deleteEntry(id){                        
	var req = new XMLHttpRequest();
	var payload = {"id": id}
	req.open("POST", "/delete", true);
	req.setRequestHeader('Content-Type','application/json')
	req.addEventListener("load",function(){
		if(req.status >= 200 && req.status < 400){      
			var table = document.getElementById("workouts"); 
			var row_count = table.rows.length;
			for (var i = 1; i < row_count; i++) {
				var findData = table.rows[i].getElementsByTagName("td");		        
				if(findData[findData.length - 1].getAttribute('name') == id){      
					table.deleteRow(i);
				}
			}
		} else {
			alert('Unable to delete item.');
			console.log(req.status);
		}
	});
	req.send(JSON.stringify(payload));
}