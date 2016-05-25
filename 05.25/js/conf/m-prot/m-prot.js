define('conf/m-prot/m-prot.js',function(require,exports,module) {
	require('$');
	//No network	
	if('onLine' in navigator && !navigator.onLine){		
		$('#prot-noact').css('display','none');	
		$('#prot-nonet').css('display','block');		
	};
	//No activity
	if (!($("ul > li").length < 0))  {			
		$('#prot-noact').css('display','block');		
	};
	// reload
	$('#prot-reload').on('click',function(){
		document.location.reload();
	});
});



	








