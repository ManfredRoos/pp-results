var ALI_VIEW = ( function (){
	var aliObj = {};

	

return{
	draw: function(_objAli, targetDiv){
		this.aliObj = _objAli;
		var table = document.createElement('table');

		
		var table = '<table>';
		table += '<tr><th>id</th><th>identity</th><th>Eval</th><th>Matched Length</th></tr>';
		jQuery.map( this.aliObj, function(target, index) {
			var row = '<tr>';
			row+= "<td>"+target.id+"</td>";
			row+= "<td>"+parseFloat(target.identity).toFixed(2)+"</td>";
			row+= "<td>"+target.eval+"</td>";
			row+= "<td>"+target.matchlen+"</td>";
			table += row;
		});
table += '</table>';

		targetDiv.append(table);
		// targetDiv.append (table);
	}
};
})();