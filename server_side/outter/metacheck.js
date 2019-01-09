// Process headers

function metacheck() {

	console.log("METACHECKING");
	console.log(JSON.stringify(req.headers));

}


exports.metacheck = metacheck;
