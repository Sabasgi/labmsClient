import {defineStore } from 'pinia'
import axios from 'axios'
export const AuthStore = defineStore(('AuthStore'),{
    state: () => {
        return {
            // user:null
        }
    },
    actions: {
        // GetRoles(){
        //     return new Promise((resolve, reject) => {
        //     axios.get('o/role/getall')
        //     .then((res)=>{
        //         // console.log("res",res)
        //         resolve(res.data)
        //     })
        //     .catch((err)=>{
        //         reject(err)
        //     })
        // });
        // },
        // GetRolewiseMenus(role){
        //     return new Promise((resolve, reject) => {
        //         axios.post('o/role/menus',role)
        //         .then((res)=>{
        //             // console.log("res",res)
        //             resolve(res.data)
        //         })
        //         .catch((err)=>{
        //             reject(err)
        //         })
        //     })
        // },
        UpdatePermissions(perms){
            return new Promise((resolve,reject)=>{
                axios.post('o/menus/update',perms)
                .then((res)=>{
                    // console.log("res",res)
                    resolve(res.data)
                })
                .catch((err)=>{
                    reject(err)
                })
            })
        },
        // Login(user){
        //     console.log("login ",user)
        //     return new Promise((resolve, reject) => {
        //     axios.post('o/user/login',user)
        //     .then((res)=>{
        //         console.log("res--------------------",res)
        //         user = res.data
        //         console.log("User store-----------------",user)
        //         sessionStorage.setItem("auth",res.headers['authorization'])
        //         resolve(res.data)
        //     })
        //     .catch((err)=>{
        //         reject(err)
        //     })
        // });
        // }
    },
    persist: {
        storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
    },


})