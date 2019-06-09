const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpl1ntt00/upload"
const CLOUDINARY_UPLOAD_PRESET = "zwh7r6rg"

console.log( "Hello world");


let fileUpload = document.getElementById('file-upload')
let imageUpload = document.getElementById('image-upload')
let fileUploadComplete = false
let imageUploadComplete = false

fileUpload.addEventListener('change', function(event) {
	var file = event.target.files[0]
	var formData = new FormData();
	formData.append('file',file);
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET );
	axios({
		url: CLOUDINARY_URL,
		method: 'post',
		headers: {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		data: formData
	}).then( function(res) {
		console.log( res.data.secure_url );
		let dataSend = res.data.secure_url
		document.getElementById('lol-this-is-janky').value = dataSend
		fileUploadComplete = true
		uploadComplete()

	}).catch(function(err) {
		console.log( "Error ");
		console.log( err );
	})
})

imageUpload.addEventListener('change', function(event) {
	var file = event.target.files[0]
	var formData = new FormData();
	formData.append('file',file);
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET );


	axios({
		url: CLOUDINARY_URL,
		method: 'post',
		headers: {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		data: formData
	}).then( function(res) {
		console.log( res.data.secure_url );
		let dataSend = res.data.secure_url
		document.getElementById('lol-this-is-janky2').value = dataSend
		imageUploadComplete = true
		uploadComplete()

	}).catch(function(err) {
		console.log( "Error ");
		console.log( err );
	})
})


const uploadComplete = () => {
		if (imageUploadComplete && fileUploadComplete ) {
			document.getElementById("submitButton").className = ""
			console.log( "Go Time");
	}
}
