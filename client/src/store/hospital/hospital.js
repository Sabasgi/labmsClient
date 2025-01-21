import {defineStore } from 'pinia'
import axios from 'axios'
export const HospitalStore = defineStore(('HospitalStore'),{
    state: () => {
        return {

        }
    },
    actions: {
        // get the list of hospitals
        GetAllHospitals(){
            return new Promise((resolve, reject) => {
            axios.get('o/hospital/getall')
            .then((res)=>{
                // console.log("hospitalres",res)
                resolve(res.data)
            })
            .catch((err)=>{
                reject(err)
            })
        });
        },
        UpdateHospital(hospital){
            console.log("update store ",hospital);
            return new Promise((resolve, reject) => {
            axios.post('o/hospital/update',hospital)
            .then((res)=>{
                // console.log("hospitalres",res)
                resolve(res.data)
            })
            .catch((err)=>{
                reject(err)
            })
        });
        },
        AddHospital(hospital){
            console.log("update store ",hospital);
            return new Promise((resolve, reject) => {
            axios.post('o/hospital/create',hospital)
            .then((res)=>{
                // console.log("hospitalres",res)
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