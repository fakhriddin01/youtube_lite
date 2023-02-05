let register_form = document.querySelector('#register_form');

    register_form.addEventListener('submit', async (event)=> {
        event.preventDefault();
        let {username, password} = event.target
        let uploadFile = document.querySelector('#uploadInput')
        let file = uploadFile.files[0]

        if(!username.value){
            return alert('Please input username')
        }else{

        }
        if(!password.value){
            return alert('Please input password')
        }
  

        // var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        // if(!strongRegex.test(password.value)){
        //     return alert('password should contain at least 1 lowercase, 1 uppercase, 1 number, 1 special char and at least 8 characters long')
        // }

        const formData = new FormData()
        formData.append('username', (username.value).trim())
        formData.append('password', (password.value).trim())
        if(file){
            if(!(file.type == 'image/png' || file.type == 'image/apng' || file.type == 'image/avif' || file.type == 'image/gif' || file.type == 'image/jpeg' || file.type == 'image/svg+xml' || file.type == 'image/webp' || file.type == 'image/jpg')){
                return alert('Please choose correct image format!')
            }
            if(file.size > 5*1024*1024){
                return alert("Image size must be less then 5Mb !!!")
            }
            formData.append('file', file)
        }
     
        fetch("http://localhost:8000/register", {
                method: "POST",
                body: formData
            }).then(info => info.json())
            .then(msg => {
                if(msg == "succesfully registrated"){
                    document.location.href = "./login.html", true;
                }
                else{
                    alert(msg)
                }
         
            
            })

    })