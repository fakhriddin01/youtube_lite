let login_form = document.querySelector('#login_form')

login_form.addEventListener('submit', (event)=>{
    event.preventDefault();

    let {username, password} = event.target
    fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        }).then(info => info.json())
        .then(data => {
            if(data.status == 'user' || data.status == 'password'){
                alert(data.msg)
            }
            if(data.status == 'loged'){
                localStorage.setItem('token', data.token);
                location.href = './index.html'
            }
        })

})



