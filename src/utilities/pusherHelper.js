import { Pusher } from "@pusher/pusher-websocket-react-native";
import store from "../Redux/store";
import { setPusher } from "../Redux/authSlice";

export const pusherConnect=async()=>{

    const pusher=Pusher.getInstance();
    await pusher.init({
        apiKey: '8e67f2f0bc2ab4dd3e1e',
        cluster: 'eu'
      });
      
      await pusher.connect().then((val)=>{
        console.log('Connected')
      });
      return pusher;
    
}