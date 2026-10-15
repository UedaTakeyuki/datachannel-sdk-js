import { pb } from './pocketbase.js';
//import pb from '@/libs/pocketbase'

const serverURL = "wss://datachannelserver.uedasoft.com/ws-relay/browser"

const createWebSocket = async (deviceID) => {
  return new Promise(async (resolve, reject) => {
    let ticket = await claimTicket()
    const url = `${serverURL}?ticket=${ticket}&deviceid=${deviceID}`;
    console.log("url", url)

    console.log("WebSocket Connection Start")
    const ws = new WebSocket(url)

    const credential = pb.authStore.token
    console.log("credential", credential)

    ws.addEventListener('open', (event) => {
      // ハンドシェイク段階でAuthorizationヘッダーを追加
      ws.send('Authorization: Bearer ' + credential); 
    });
/*

    ws.value.addEventListener('message', (event) => {
      // 受信メッセージを処理
      console.log('Received:', event.data);
    });
*/
    ws.onerror = (error) => {
      console.error("WebSocket creation error observed:", error);
      reject(error);
    };
    ws.onclose = (event) => {
      const err = new Error(`WebSocket is closed, code: ${event.code})`)
      console.log(err);
      reject(err);
    };
    ws.onopen = (event) => {
      console.log(event)
      console.log("Grobal WebSocket is opened As:",ws)
      ws.send("しね彡⌒ミ")
      resolve(ws);
//      peerConnectionOffer(ws)
      
    };
/*
    ws.value.onmessage = async (event) => {
      console.log("Grobal WebSocket onmessage event:",event)
      let message = JSON.parse(event.data)
      console.log("Grobal WebSocket message", message)
      switch(message.type){
          case 'answerDeviceSDP':
          console.log("answerDeviceSDP", message.sdp)
          try {
              $PeerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(message.sdp))))
          } catch (e) {
              alert(e)
          }
          break
        break
      }
    }
*/
  })
}

const claimTicket = async () => {
  const resp = await pb.send("/claimticket/browser", {
    headers: { 
      "Authorization": `Bearer ${pb.authStore.token}`
    }
  }); // Sign-in required or fail.
  console.log("resp", resp)

  return resp.ticket;
}

// 💡 page と perPage を受け取れるように変更
const listDevice = async (page = 1, perPage = 3, search = '') => {
  // PocketBase用のオプションオブジェクトを用意
  const options = {}

  // 💡 ② もし検索ワードがあれば、PocketBaseのフィルター構文（name等に部分一致）を作る
  // ※ここではデバイス名のフィールドが 'name' だと仮定しています。適宜変更してください。
  if (search) {
    options.filter = `name ~ "${search}"` 
  }

  const resultList = await pb.collection('devices').getList(page, perPage, options)
  console.log("resultList", resultList) 
  return resultList
}

export {
  createWebSocket,
  listDevice
}