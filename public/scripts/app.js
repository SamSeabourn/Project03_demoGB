const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpl1ntt00/upload"
const CLOUDINARY_UPLOAD_PRESET = "zwh7r6rg"

console.log( "Hello world");


let fileUpload = document.getElementById('file-upload')

fileUpload.addEventListener('change', function(event) {
	var file = event.target.files[0]
	console.log( file );
	console.log( "File looks lile this ");
	var formData = new FormData();
	console.log( formData );
	formData.append('file',file);
	console.log( formData );
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET );
	console.log( formData );

	axios({
		url: CLOUDINARY_URL,
		method: 'post',
		headers: {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		data: formData
	}).then( function(res) {
		console.log( res.data.secure_url );

	}).catch(function(err) {
		console.log( "Error ");
		console.log( err );
	})
})
