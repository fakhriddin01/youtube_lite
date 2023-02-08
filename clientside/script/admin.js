let token  = localStorage.getItem('token')
fetch("http://localhost:8000/admin_panel", {
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
    if(info.status == "ok"){
        let videos = info.videos;

        let video_list  = document.querySelector('.videos-list')

        for (let vid of videos){
            let [li, video, p, img] = createElement('li', 'video', 'p', 'img');
            li.className="video-item";
            video.src = `../model/upload_files/videos/${vid.videoName}`;
            video.setAttribute('controls', "");
            p.className="content";
            p.innerHTML = vid.title;
            p.setAttribute('contenteditable', 'true')
            img.src = "./img/delete.png"
            img.setAttribute('width', '25px')
            img.setAttribute('alt', 'upload')
            img.className = 'delete-icon';
            img.setAttribute('data-id', '2')

            li.append(video, p, img);
            video_list.append(li);

            img.addEventListener('click', (event)=> {
                event.preventDefault();

                fetch(`http://localhost:8000/delete_video/${vid.videoId}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token
                    })
                }).then(data => data.json())
                .then(info => {
                    if(info.stutus == "token"){
                        location.href = "./login.html"
                    }
                    if(info.status == "ok"){
                        location.href;
                        // alert('video deleted');

                    }
                })
            })

            p.addEventListener('blur', (event)=>{
                event.preventDefault();
                let title = p.innerHTML;
                fetch(`http://localhost:8000/update_video/${vid.videoId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                        title
                    })
                }).then(data => data.json())
                .then(info => {
                    if(info.stutus == "token"){
                        location.href = "./login.html"
                    }
                    if(info.status == "ok"){
                        location.href;
                        // alert('video deleted');

                    }
                })
            })
            
        }

    }
})


let upload_form = document.querySelector('.site-form');
upload_form.addEventListener('submit', (event)=>{
    event.preventDefault();

    let {title} = event.target;

    let uploadFile = document.querySelector('#uploadInput')
    let file = uploadFile.files[0]
    if(!title.value){
        return alert('Please input title')
    }
    if(!file){
        return alert('Please choose file')
    }
    if(file && !(file.type == 'video/mp4' || file.type == 'video/mov' || file.type == 'video/wmv' || file.type == 'video/flv' || file.type == 'video/mkv' || file.type == 'video/webm')){
        return alert('Please upload correct video format')
    }

    const formData = new FormData();
    formData.append("title", title.value)
    formData.append("userinfo", token)
    formData.append("video", file)

    fetch("http://localhost:8000/upload_video", {
        method: "POST",
        body: formData
    }).then(data => data.json())
    .then(info => {
        if(info.status == "token"){
            location.href = './login.html'
        }
        if(info.status == 'ok'){
            location.href = "./admin.html"
        }
        
        return;
    
    })
})



function createElement(...restData) {
    let store = [];
    for(let el of restData){
        store.push(document.createElement(el))
    }
    return store;
}