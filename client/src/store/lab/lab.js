import { defineStore } from "pinia";
import axios from 'axios'
export const LabStore = defineStore(('LabStore'),{
   state:()=>{
      return{

      }
   },
   actions:{
      CreateLab(lab,branch){
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
          axios.get('c/lab/getall')
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
      GetLab(l){
        return new Promise((resolve, reject) => {
        axios.post("c/lab/getone",l)
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
      CreateBranch(branch){
        console.log("in store branch ",branch)
        return new Promise((resolve, reject) => {
          axios.post("o/branch/create",branch)
            .then((res)=>{
              console.log("Response of create branch ",res)
              resolve(res.data)
            })
            .catch((err)=>{
              console.log("ERR of create branch ",err)
              reject(err)
            })
           });
      },
      GetLabsBranches(){
        console.log("get all GetLabsBranches branches o all lab ")
        return new Promise((resolve, reject) => {
           axios.get("c/labs/branches/getall")
           .then((res)=>{
             console.log("Response of GetLabsBranches role ",res)
             resolve(res.data)
           })
           .catch((err)=>{
             console.log("ERR of GetLabsBranches user ",err)
             reject(err)
           })
          });
      },
   },
   persist: {
      storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },

})