let token  = localStorage.getItem('token');
let userInfo = localStorage.getItem('userInfo')
fetch(`http://localhost:8000/`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token,
        userInfo
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
        let checkedUser  = info.checkedUser;

        let navBar = document.querySelector('.navbar-list')

        let icon = document.querySelector('.header-right')

        let [a, img] = createElement('a', 'img');

        a.href = "./admin.html"
        img.className = 'avatar-img'
        if(user.image == null){
            img.src=`./img/avatar.jpg`
        }else{
            img.src=`../model/upload_files/avatars/${user.image}`
        }
        img.setAttribute('alt', 'avatar-img')
        img.setAttribute('width', '32px')
        img.setAttribute('height', '32px')
        a.append(img);
        icon.append(a);

        let iframe = document.querySelector('.iframes-list');
        let datalist = document.querySelector('#datalist')
        for (let vid of videos){
            let [li, video1, div1, img1, div2, h2, h3, time, a, span, img2, option] = createElement('li', 'video', 'div', 'img', 'div', 'h2', 'h3', 'time', 'a', 'span', 'img', 'option')
            li.className = 'iframe';
            video1.src = `../model/upload_files/videos/${vid.videoName}`
            video1.setAttribute('controls', "");
            div1.className="iframe-footer"
            img1.src=`../model/upload_files/avatars/${vid.user.image}`;
            img1.setAttribute('alt', 'channel-icon')
            div2.className = 'iframe-footer-text';
            h2.className="channel-name";
            h2.innerHTML = vid.user.username;
            h3.className= 'iframe-title'
            h3.innerHTML = vid.title;
            time.className = "uploaded-time";
            time.innerHTML = vid.uploadTime;
            a.className = 'download';
            a.href = "#";
            span.innerHTML = vid.size + "MB";
            img2.src="./img/download.png";
            option.value = vid.title;
            a.append(span, img2);
            div2.append(h2, h3, time, a)
            div1.append(img1, div2);
            li.append(video1, div1);
            iframe.append(li);
            datalist.append(option)
        }

        let homeBtn = document.querySelector('#youtube_icon');

        if(!userInfo){
            homeBtn.className += " active"
        }

        for (let i=0; i<users.length; i++){
            let [li, a, img, span]=createElement('li', 'a', 'img', 'span');
            li.className = "channel"
            if(userInfo == users[i].username){
                li.className += " active"
            }
            li.setAttribute('data-id', i+1);
            a.href=`#`

            a.addEventListener('click', (event)=>{
                // event.preventDefault();
                localStorage.setItem('userInfo', users[i].username);
                location.href='./index.html';
            })

            if(users[i].image == null){
                img.src=`https://cdn-icons-png.flaticon.com/512/146/146031.png`
            }else{
                img.src = `../model/upload_files/avatars/${users[i].image}`
            }

            img.setAttribute('alt', "channel-icon")
            img.setAttribute('width', "30px")
            img.setAttribute('height', "30px")
            span.innerHTML = users[i].username
            a.append(img, span)
            li.append(a)
            navBar.append(li);
           
        }

        localStorage.removeItem("userInfo");

    }
})



function createElement(...restData) {
    let store = [];
    for(let el of restData){
        store.push(document.createElement(el))
    }
    return store;
}