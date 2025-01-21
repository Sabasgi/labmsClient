import { defineStore } from "pinia";
import axios from 'axios'
export const LabStore = defineStore(('LabStore'),{
   state:()=>{
      return{

      }
   },
   actions:{
      CreateLab(lab){
         console.log("Labbb requ  -",lab)
         return new Promise((resolve, reject) => {
          axios.post("o/lab/create",lab)
          .then((res)=>{
            console.log("Response of create lab ",res)
            resolve(res.data)

          })
          .catch((err)=>{
            console.log("ERR of create lab ",err)
            reject(err)
          })
         });
      },
      UpdateLab(lab){
         console.log("Labbb req to update   -",lab)
         return new Promise((resolve, reject) => {
          axios.post("o/lab/service/update",lab)
          .then((res)=>{
            console.log("Response of create lab ",res)
            resolve(res.data)
          })
          .catch((err)=>{
            console.log("ERR of create lab ",err)
            reject(err)

          })
         });
      },
      GetLabs(){
         return new Promise((resolve, reject) => {
          axios.get('o/lab/getall')
          .then((res)=>{
            console.log("Response of create lab ",res)
            resolve(res.data)
          })
          .catch((err)=>{
            console.log("ERR of create lab ",err)
          })
         });
      }
   },
   persist: {
      storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },

})