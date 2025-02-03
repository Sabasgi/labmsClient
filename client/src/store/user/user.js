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
     UpdateUser(u){
      console.log("User in Update User",u)
      return new Promise((resolve, reject) => {
         axios.post("o/user/update",u)
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
           });
       },
       //superadmin call to get labs and their users
       GetLabsUsers(){
         console.log("get all labs users o all lab ")
         return new Promise((resolve, reject) => {
            axios.get("c/labs/users/getall")
            .then((res)=>{
              console.log("Response of GetLabsUsers role ",res)
              resolve(res.data)
            })
            .catch((err)=>{
              console.log("ERR of GetLabsUsers user ",err)
              reject(err)
            })
           });
       },
       // admin call to get all users
       GetAllUsers(){
        console.log("get all labs users o all lab ")
        return new Promise((resolve, reject) => {
           axios.get("c/user/getall")
           .then((res)=>{
             console.log("Response of GetLabsUsers role ",res)
             resolve(res.data)
           })
           .catch((err)=>{
             console.log("ERR of GetLabsUsers user ",err)
             reject(err)
           })
        });
      }
   }

})