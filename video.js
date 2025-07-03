
document.addEventListener('DOMContentLoaded', ()=>{
    const socket = io('syncro-server-production.up.railway.app')
    const peer = new Peer()
    let currentConnection = null
    let localStream = null
    let currentCall = null
    const user = JSON.parse(localStorage.getItem('user'))
    peer.on('open', id => {
        socket.emit('send:peer', {username: user.username, host:user.isHost, room: user.room, id})
    })
    socket.on('get:peer', ({remoteUserName, remoteHost,  remoteId}) =>{
        const connection = peer.connect(remoteId)
        currentConnection = connection
        connection.on('open', () =>{
            console.log('Connection Send to', remoteUserName)
            navigator.mediaDevices.getUserMedia({video:true,audio:true})
            .then(data=>{
                localStream = data
                document.getElementById('self-video').srcObject = localStream
                 if (remoteHost) {
                if (currentCall) {
                    currentCall.close()
                }
                const newCall = peer.call(remoteId, localStream)
                currentCall = newCall
                newCall.on('stream', stream=>{
                    document.getElementById('client-video').srcObject = stream
                })
                newCall.on('close', ()=>{
                    document.getElementById('client-video').srcObject = null
                })
            }
            }).catch(err=>{
                alert(err)
            })
           
        })
 
        
           
    })

    peer.on('connection', conn => {
        currentConnection = conn
        conn.on('open', ()=>{
        console.log('Connnection Received')
            navigator.mediaDevices.getUserMedia({video:true,audio:true})
            .then(data=>{
                localStream = data
                document.getElementById('self-video').srcObject = localStream

            }).catch(err=>{
                alert(err)
            })
            if (user.isHost) {
                if (currentCall) {
                    currentCall.close()
                }
                const newCall = peer.call(conn.peer, localStream)
                currentCall = newCall
                newCall.on('stream', stream=>{
                    document.getElementById('client-video').srcObject = stream
                })
                newCall.on('close', ()=>{
                    document.getElementById('client-video').srcObject = null
                })
            }
          
        })
      
        
        
    })

   

   peer.on('call', call => {
                if (currentCall) {
                    currentCall.close()
                }
                call.answer(localStream)
                currentCall = call
                call.on('stream', stream=>{
                    document.getElementById('client-video').srcObject = stream
                })
                call.on('close', ()=>{
                    document.getElementById('client-video').srcObject = null
                })
            })
  

    socket.on('updateUsersList', ({users})=>{
        const participants = document.getElementById('participants')
        participants.innerHTML = ''
        for (let index = 0; index < users.length; index++) {
            if (users[index] !== null) {
                const participant = document.createElement('div')
                participant.classList.add('participant')
                participant.innerHTML = ` <div class="participant-avatar">${users[index].slice(0,1)}</div>
                    <span class="participant-name">${users[index]}</span>`
                
                        participants.appendChild(participant)
            }
            
        }
    })


})