function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var added = false;

function books_nft_handoff(ref, datamine, contractid, network, tokenid){
	console.log("books_nft_handoff: ref="+ref+" datamine="+datamine+" contractid="+contractid+" network="+network);

	//var url = "nft/marketplace/"+network+"/"+contractid+"/"+tokenid;
	//var url = "https://opensea.io/assets/matic/"+contractid+"/"+tokenid+"/";

	// This connects the mouseclick to the popup window.
	ref.setAttribute("data-toggle", "modal");
	ref.setAttribute("data-target", "#myModal");

	ref.onmouseover = function(){
	        $("#myModal").on('show.bs.modal', function(){
		//console.log("books_nft_handoff: show.bs.modal: ZETA");
                //$("#videoContainer").attr('src', url);
                //$("#videoContainer").innerHTML = '<embed src="'+url+'" width="100%" height="100%" type="text/html">';
        	});
	};

	if(false){
		var addedHtml = '<iframe seemless style="border: none;" src="/art?type=bookmark&curserial_num=' + tokenid +'&datamine=' + datamine + '" width = "307" height = "160"> </iframe>';
		console.log("books_nft_handoff: addedHtml: ", addedHtml);

		var newNode = document.createElement("div");
		newNode.innerHTML = addedHtml;
		newNode.className = "box";

		insertAfter(ref, newNode);

		document.addEventListener('mousemove', function(e) {
  			let body = document.querySelector('body');
  			let circle = newNode;
  			let left = e.offsetX;
  			let top = e.offsetY;
  			circle.style.left = left + 'px';
  			circle.style.top = top + 'px';
		});
		added = true;
	}

	ref.onclick = function(){
		console.log("books_nft_handoff: onclick: GAMMA");
		//window.open(url, '_blank');
		//

		console.log($("#myModal"));

		$("#myModal").on('shown.bs.modal', function () {
			//console.log("books_nft_handoff: shown.bs.modal: DELTA");
		});

		$("#myModal").on('show.bs.modal', function(){

			console.log("books_nft_handoff: onshow: BETA");
			$("#testresult").empty().text("The Great Library Says...");
			$("#pricespan").empty().text(getpriceFromMoralis(contractid, tokenid));



			console.log("Starting the price code.");
			$("#tokenspan").empty().text(tokenid);
			$("#contractspan").empty().text(contractid);
			//$("#dataminespan").empty().text(datamine);
			console.log($("#videoContainer"));
		});


	}

	$("#myModal").on('show.bs.modal', function(){
		console.log("books_nft_handoff: onshow: ALPHA");
		//$("#videoContainer").attr('src', url);
                //$("#videoContainer").innerHTML = '<embed src="'+url+'" width="100%" height="100%" type="text/html">';
    	});


}

