let token  = localStorage.getItem('token')
fetch("http://localhost:8000/", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token
    })
}).then(data => data.json())
.then(info => {
    if(info.status == 'token'){
        location.href = "./login.html"
    }
    if(info.status == 'ok'){
        let users = info.users
        let videos = info.videos
        let user = info.foundUser

        let navBar = document.querySelector('.navbar-list')

        for (let i=0; i<users.length; i++){
            let [li, a, img, span]=createElement('li', 'a', 'img', 'span');
            li.className = "channel"
            li.setAttribute('data-id', i+1);
            a.href='#'
            img.src = `../model/upload_files/avatars/${users[i].image}`
            img.setAttribute('alt', "channel-icon")
            img.setAttribute('width', "30px")
            img.setAttribute('height', "30px")
            span.innerHTML = users[i].username
            a.append(img, span)
            li.append(a)
            navBar.append(li);
        }


        // console.log(users, videos, user);
    }
})



function createElement(...restData) {
    let store = [];
    for(let el of restData){
        store.push(document.createElement(el))
    }
    return store;
}