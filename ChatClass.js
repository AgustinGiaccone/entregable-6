const fs = require('fs').promises
 
class historialChat{
   constructor(route){
       this.route= './chats.json'
       this.message= [];
   }
 
   async saveMessage(data){
       try{
           const newMessage = {
               email: data.email,
               mensate: data.mensate,
               fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
           }
           const loadedMessage = await this.loadMessage()
           loadedMessage.push(newMessage)
           await fs.writeFile(this.route, JSON.stringify(loadedMessage ,null, 2))
       }catch(e){
            throw new Error(e.message)
           }
       }
 
   async loadMessage(){
       try{
           const messageHistory = await fs.readFile(this.route)
           if(messageHistory.toString() != ''){
               this.message = JSON.parse(messageHistory)
           }
           return this.message
       }catch(e){
           if( e.code == "ENOENT"){
                fs.writeFile(this.route,'')
                return []
            }
            throw new Error(e.message)
        }
   }
}
 
module.exports = historialChat