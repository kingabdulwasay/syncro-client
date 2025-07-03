document.addEventListener('DOMContentLoaded', ()=>{
    const socket = io('syncro-server-production.up.railway.app')
    const peer = new Peer()
    let currentConnection = null
    const user = JSON.parse(localStorage.getItem('user'))
    peer.on('open', id => {
        socket.emit('send:peer', {username: user.username, host:user.isHost, room: user.room, id})
    })
    socket.on('get:peer', ({remoteUserName,   remoteId}) =>{
        const connection = peer.connect(remoteId)
        currentConnection = connection
        connection.on('open', () =>{
            console.log('Connection Send to', remoteUserName)
        })
     connection.on('data', data => {
            console.log('Received from ', data.username, ': ', data.chat)
            addMessage(data.username, data.chat, false)
        })
        
           
    })

    peer.on('connection', conn => {
        currentConnection = conn
        conn.on('open', ()=>{
        console.log('Connnection Received')
        })
 conn.on('data', data => {
            console.log('Received from ', data.username, ': ', data.chat)
            addMessage(data.username, data.chat, false)
        })
     
        
    })

    // Function to add a message to the chat
    function addMessage(sender, message, isSent) {
        const messagesContainer = document.getElementById('messages')
        const messageElement = document.createElement('div')
        messageElement.className = `message ${isSent ? 'sent' : 'received'}`
        messageElement.textContent = isSent ? message : `${sender}: ${message}`
        messagesContainer.appendChild(messageElement)
        messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    // Handle sending messages
    document.getElementById('submit').addEventListener('click', ()=>{
        const chatInput = document.getElementById('chatInput')
        const chat = chatInput.value.trim()
        
        if (chat && currentConnection) {
            currentConnection.send({username: user.username, chat})
            console.log('Send', {username: user.username, chat})
            addMessage(user.username, chat, true)
            chatInput.value = ''
        }
    })

    // Handle Enter key press
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('submit').click()
        }
    })

    socket.on('updateUsersList', ({users})=>{
        const sidebar = document.getElementById('sidebar')
        sidebar.innerHTML = ''
        for (let index = 0; index < users.length; index++) {
            if (users[index] !== null) {
                const user = document.createElement('div')
                user.classList.add('user-profile')
                user.innerHTML = `<h2 id="username-display">${users[index]}</h2>
                        <div class="user-status">Online</div>`
                
                        sidebar.appendChild(user)
            }
            
        }
    })
})