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
        },
        GetAllStates() {
            return new Promise((resolve, reject) => {
                axios.get('o/state/getall')
                    .then((res) => {
                        console.log("States fetched successfully", res);
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.error("Error fetching states", err);
                        reject(err);
                    });
            });
        },
        GetCitiesByStateId(stateId) {
            return new Promise((resolve, reject) => {
                axios.get("o/state/cities/"+stateId)
                    .then((res) => {
                        console.log(`Cities for state ID ${stateId} fetched successfully`, res);
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.error(`Error fetching cities for state ID ${stateId}`, err);
                        reject(err);
                    });
            });
        }
    },
    persist: {
        storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
    },
})