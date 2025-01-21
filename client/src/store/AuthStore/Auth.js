import { defineStore } from "pinia";
import axios from "axios";
export const useAuthUserStore = defineStore("AuthUserStore", {
  state: () => {
    return {
        user:null
    }},
    actions: {
        GetRoles(){
            return new Promise((resolve, reject) => {
            axios.get('o/role/getall')
            .then((res)=>{
                // console.log("res",res)
                resolve(res.data)
            })
            .catch((err)=>{
                reject(err)
            })
            });
        },
        GetRolewiseMenus(role){
            return new Promise((resolve, reject) => {
                axios.post('o/role/menus',role)
                .then((res)=>{
                    // console.log("res",res)
                    resolve(res.data)
                })
                .catch((err)=>{
                    reject(err)
                })
            })
        },
        UpdatePermissions(perms){
            axios.post('o/menus/update',perms)
            .then((res)=>{
                // console.log("res",res)
                resolve(res.data)
            })
            .catch((err)=>{
                reject(err)
            })
        },
        Login(u){
            console.log("login   in AUth.js ",u)
            return new Promise((resolve, reject) => {
            axios.post('o/user/login',u)
            .then((res)=>{
                console.log("res     gggggggggggoooottttt ",res)
                this.user = res.data
                // console.log("User store",user)
                sessionStorage.setItem("auth",res.headers['authorization'])
                sessionStorage.setItem("t",res.data.token)
                resolve(res.data)
            })
            .catch((err)=>{
                reject(err)
            })
        });
        }
    },
    persist: {
        storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
    },
})