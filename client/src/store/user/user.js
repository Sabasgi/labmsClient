import { defineStore } from "pinia";
import axios from "axios";
export const userStore = defineStore("userStore",{
   state:()=>{
      return{

      }
   },
   actions:{
     AddUser(u){
      console.log("User in create User",u)
      return new Promise((resolve, reject) => {
         axios.post("c/user/create",u)
         .then((res)=>{
           console.log("Response of create user ",res)
           resolve(res.data)

         })
         .catch((err)=>{
           console.log("ERR of create user ",err)
           reject(err)
         })
        });
      },
        AddRole(r){
         console.log("role in create role ",r)
         return new Promise((resolve, reject) => {
            axios.post("c/role/create",r)
            .then((res)=>{
              console.log("Response of create role ",res)
              resolve(res.data)
            })
            .catch((err)=>{
              console.log("ERR of create user ",err)
              reject(err)
            })
           });   }
   }

})