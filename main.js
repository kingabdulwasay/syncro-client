 const firebaseConfig = {
    apiKey: "AIzaSyAFsU9NPbup1CQjAF5p9OyyDaEh2enjgX4",
    authDomain: "genniai.firebaseapp.com",
    projectId: "genniai",
    storageBucket: "genniai.appspot.com",
    messagingSenderId: "453741408957",
    appId: "1:453741408957:web:dae8454811ac18c8fcbdd4"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth()
  const provider = new firebase.auth.GoogleAuthProvider()
  async function authenticate() {
       const result = await auth.signInWithPopup(provider)
       const user = result.user
       localStorage.setItem('user', JSON.stringify({username: user.displayName, email:  user.email, photo: user.photoURL , isHost: false, room:""}))

    window.location.reload()
  }
  document.addEventListener('DOMContentLoaded', () =>{
    let roomName = document.getElementById('room-id')
    let loggedIn = JSON.parse(localStorage.getItem('user'))
    if (!loggedIn) {
        authenticate()
    }
                
    document.getElementById('user-profile').innerHTML = `<div class="profile-header">
                    <div class="profile-avatar" id="avatar">
                        <img src=${loggedIn.photo} alt="">
                    </div>
                    <div class="profile-info">
                        <h2 id="username-display">${loggedIn.username}</h2>
                        <div class="profile-status">Online</div>
                    </div>
                </div>` 

    document.getElementById('create-room-btn').addEventListener('click', ()=>{
        loggedIn.isHost = true
        loggedIn.room = roomName.value.trim()
        localStorage.setItem('user', JSON.stringify(loggedIn))
        roomName.value = ''
        window.location.replace('video.html')

    })
    document.getElementById('join-room-btn').addEventListener('click', () => {
        loggedIn.isHost = false
        loggedIn.room =  roomName.value.trim()
        localStorage.setItem('user', JSON.stringify(loggedIn))
        roomName.value = ''
        window.location.replace('video.html')

    })
})
