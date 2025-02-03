<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { LabStore} from './../../store/lab/lab';
import { useAuthUserStore } from "./../../store/AuthStore/Auth";

// import emitter from '../../main';
import { useRouter } from 'vue-router';

const toast = useToast();
const labstore = LabStore()
const labs = ref([]);
// const labsbranches = ref([]);
const labDialog = ref(false);
const selectedLab=ref(null);
const lab = ref({});
const IsEdit = ref(false)
const branch = ref({});
const router = useRouter()
const states = ref([]);
const cities = ref([]);
const authstore = useAuthUserStore();
const expandedRows = ref([]);
// Fetch laboratories based on role
const fetchData = async () => {
    try {
        if (authstore.user.role === "superadmin") {
            const data = await labstore.GetLabsBranches();
            labs.value = data;
        } else if (authstore.user.role === "admin") {
            // const data = await labstore.GetLabs(); //admin
            const data = await labstore.GetLabsBranches();
            labs.value = data;
        }
    } catch (error) {
        console.error("Error fetching labs:", error);
        toast.add({severity:"error",summary:"failed",detail:"could not get data"+error,life:3000})

    }
};
// const getLaboratories = ()=>{
//     labstore.GetLabs()
//     .then((data)=>{
//         // labs.value=data
//         labs.value = data;
//         // labs.value.push()
//         console.log("labssssssssss",labs.value)
//     })
//     .catch((er)=>{
//         console.log("Error ",er)
//     })
// }
// const getLabsBranches = ()=>{
//     labstore.GetLabsBranches()
//     .then((data)=>{
//         labsbranches.value=data
//     })
//     .catch((er)=>{
//         console.log("Error ",er)
//     })
// }
const getStates = ()=>{
    authstore.GetAllStates()
    .then((data)=>{
        console.log("statessssss ",data)
        states.value=data
    })
    .catch((er)=>{
        console.log("Error ",er)
    })
}

const getCities = ()=>{
    authstore.GetCitiesByStateId(branch.value.state_id)
    .then((data)=>{
        console.log("citiess ",data)
        cities.value=data
    })
    .catch((er)=>{
        console.log("Error ",er)
    })
}
const products = ref(null);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const selectedProducts = ref(null);
// const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

onMounted(() => {
    // if (authstore.user.role=="superadmin"){
    //     getLabsBranches()
    //     // uStore.GetLabsUsers()
    //     // .then((users)=>{
    //     //     labsUsers.value = users
    //     //     console.log("Uers recieved : ",labsUsers)
    //     // })
    //     // .catch((err)=>{
    //     //     console.log("labs Uers ERRROR  : ",err)
    //     // })

    // }else{
    //     console.log("IT IS NOT ROLE SUPERADMIN")
    //     getLaboratories()
    //     //get lab details and all the users of that lab
    //     // uStore.GetAllUsers()
    //     // .then((u)=>{
    //     //     users.value = u
    //     //     console.log("Uers recieved : ",labsUsers)
    //     // })
    //     // .catch((err)=>{
    //     //     console.log("Uers ERRROR  : ",err)
    //     // })

    // }
    fetchData()
});
// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

const openNew = () => {
    lab.value = {};
    submitted.value = false;
    labDialog.value = true;
};

const hideDialog = () => {
    labDialog.value = false;
    submitted.value = false;
};

const saveLab = () => {
   //  console.log("ssave cklick")
    submitted.value = true;
    if (lab.value.lab_name){
      //   console.log("lab to updateeee ",lab.value)
      //   var ReqData = {
      //       "lab_name" :hospital.value,
      //       "branch":branch.value
      //   }
        // if (hospital.value.h_Id) {
        //     // product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
        //     // products.value[findIndexById(product.value.id)] = product.value;
        //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        // } else {
        //     product.value.id = createId();
        //     product.value.code = createId();
        //     product.value.image = 'product-placeholder.svg';
        //     product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
        //     products.value.push(product.value);
        //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        // }
        labstore.CreateLab(lab.value)
        .then((data)=>{
            toast.add({severity:"success",summary:"Lab Successfull",detail:"Lab Details are updated",life:3000})
            labDialog.value = false;
            lab.value = {};
            // branch.value ={};
            getLaboratories()
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"lab Update Error",detail:"lab Details are not updated",life:3000})
        })
    }
};
const createBranch = () => {
    console.log("ssave cklick branch ",branch.value)
    submitted.value = true;
    if (branch.value.branch_name && branch.value.lab_id){
      //   console.log("lab to updateeee ",lab.value)
        labstore.CreateBranch(branch.value)
        .then((data)=>{
            console.log("data",data)
            toast.add({severity:"success",summary:"Branch Created Successfully",detail:"branch Details are updated",life:3000})
            labDialog.value = false;
            branch.value ={};
            lab.value = {};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"branch Update Error",detail:"branch Details are not updated",life:3000})
        })
    }
    IsEdit.value=false
    labDialog.value = false;
    branch.value ={};
    lab.value = {};
};
const editLab = (b) => {
    console.log("labbb ediittt ",b)
    branch.value = {...b} ;
    labDialog.value = true;
    IsEdit.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    // products.value = products.value.filter((val) => val.id !== product.value.id);
    // deleteProductDialog.value = false;
    // product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
const addAdminClicked=(d) =>{
   console.log("Admin clicked - ", d)
   router.push({ path: '/users', query: { id: d.lab_code } });
   // emitter.emit("addAdmin", d); // Emit the event
}
const createDepartment=(d) =>{
   console.log("createDepartment clicked - ", d)
   router.push({ path: '/departments', query: { b: d } });
   // emitter.emit("addAdmin", d); // Emit the event
}
const createBranchClicked=(d) =>{
    console.log("dddddddddddddddddddddddddddddd- ",d)
    lab.value.lab_name = d.lab_name
    lab.value.lab_code = d.lab_code
    lab.value.lab_id = d.lab_id
    labDialog.value = true;
    IsEdit.value = true;
    // console.log("createBranchClicked clicked - ", d)
    branch.value.lab_id = d.lab_id
    getStates()
//    router.push({ path: '/users', query: { id: d.lab_code } });
   // emitter.emit("addAdmin", d); // Emit the event
}
const onRowExpand = (event) => {
    lab.value.lab_name = event.data.lab_name
    lab.value.lab_code = event.data.lab_code
    lab.value.lab_id = event.data.lab_id
    console.log("event row expanded ",lab.value)
    toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
    toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};
const expandAll = () => {
    expandedRows.value = labs.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});

};
const collapseAll = () => {
    expandedRows.value = null;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew"  v-if="authstore.user.role==='superadmin'"/>
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" v-if="authstore.user.role==='superadmin'"/>
                        </div>
                    </template>
                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <!-- super admin view -->
                <DataTable
                    :value="labs"
                    v-model:expandedRows="expandedRows"
                    v-if="labs && labs.length > 0"
                    dataKey="lab_id"
                    @rowExpand="onRowExpand"
                    selectionMode="single"
                    @rowCollapse="onRowCollapse"
                    tableStyle="min-width: 60rem; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;"
                >
                    <template #header>
                        <div class="flex flex-wrap justify-end gap-2 p-2 bg-gray-100"
                             v-if ="authstore.user.role==='superadmin'">
                            <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                            <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                        </div>
                    </template>
                    <template #empty> No Users found. </template>
                    <template #loading> Loading users data. Please wait. </template>
                    <Column expander style="width: 5rem; text-align: center;" />
                    <Column field="lab_id" header="Lab ID">
                        <template #body="slotProps">
                            <strong>{{ slotProps.data.lab_id }}</strong>
                        </template>
                    </Column>

                    <Column field="lab_name" header="Lab Name">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.lab_name }}</span>
                        </template>
                    </Column>

                    <Column field="lab_code" header="Lab Code">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.lab_code }}</span>
                        </template>
                    </Column>
                    <Column field="admin Add" header="Validity Date">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.validity_date || 'N/A' }}</span>
                        </template>
                    </Column>
                    <Column field="admin Add" header="Add admin">
                        <template #body="slotProps">
                        <Button label="add admin" outlined class="mb-2 mr-2" @click="addAdminClicked(slotProps.data)"/>
                        </template>
                    </Column>
                    <Column field="add Branch" header="add Branch">
                        <template #body="slotProps">
                        <Button label="create branch" outlined class="mb-2 mr-2" @click="createBranchClicked(slotProps.data)"/>
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div v-if="slotProps.data.branches && slotProps.data.branches.length >0">
                            <h5 class="font-bold mb-3">Branches of {{ slotProps.data.lab_name }}</h5>
                            <DataTable :value="slotProps.data.branches || []" tableStyle="min-width: 40rem;">
                                <Column field="branch_id" header="Branch ID" sortable></Column>
                                <Column field="branch_name" header="Branch Name" sortable></Column>
                                <Column field="branch_code" header="Branch Code" sortable></Column>
                                <Column field="address" header="Address" sortable></Column>
                                <Column field="city_id" header="City ID" sortable></Column>
                                <Column field="city_id" header="City ID" sortable></Column>
                                <Column field="Operations" header="Operations" >
                                    <template #body="slotProps">
                                    <Button icon="pi pi-pencil" severity="success"  class="m-1"  rounded variant="outlined" aria-label="Search"  @click="editLab(slotProps.data)" />
                                    <Button icon="pi pi-trash" severity="success" class="m-1" rounded variant="outlined" aria-label="Search"  @click="deleteProduct(slotProps.data)" />
                                    </template>
                                </Column>
                                <Column field="Operations" header="Operations" >
                                    <template #body="slotProps">
                                    <Button icon="pi pi-pencil" severity="success"  class="m-1"  rounded variant="outlined" aria-label="Search"  @click="createDepartment(slotProps.data)" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                        <p v-if="(!slotProps.data.branches || slotProps.data.branches.length === 0)&& authstore.user.role === 'superadmin'" class="text-gray-500 mt-3">
                            No branches available for this lab.
                        </p>
                    </template>
                </DataTable>
                <Dialog v-model:visible="labDialog" :style="{ width: '90%' }" header="Lab Details" :modal="true" class="p-fluid">

                        <div class="card">
                        <!-- Lab Details Section -->
                            <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6" v-if="IsEdit">
                                    <label for="labCode">Lab Code</label>
                                    <InputText id="labCode" v-model.trim="lab.lab_code" required="true"
                                            :disabled="IsEdit" :invalid="submitted && !lab.lab_code" autofocus />
                                    <small class="p-invalid" v-if="submitted && !lab.lab_code">Lab Code is required.</small>
                                </div>
                                <div class="field col-4 md:col-6">
                                    <label for="labName">Lab Name</label>
                                    <InputText id="labName" v-model.trim="lab.lab_name" required="true"
                                            :invalid="submitted && !lab.lab_name" :disabled="IsEdit"/>
                                    <small class="p-invalid" v-if="submitted && !lab.lab_name">Lab Name is required.</small>
                                </div>
                            </div>
                            <!-- Branch Details Section -->
                             <div v-if="IsEdit">
                            <div class="p-mt-4">
                                <h4>Branch Details</h4>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6" v-if="false"> <!-- Hidden BranchID Field -->
                                    <InputText v-model.trim="branch.branch_id" hidden />
                                </div>

                                <div class="field col-4 md:col-6">
                                    <label for="branchCode">Branch Code</label>
                                    <InputText id="branchCode" v-model.trim="branch.branch_code" required="true"
                                            :disabled="IsEdit" :invalid="submitted && !branch.branch_code" />
                                    <small class="p-invalid" v-if="submitted && !branch.branch_code">Branch Code is required.</small>
                                </div>

                                <div class="field col-4 md:col-6">
                                    <label for="branchName">Branch Name</label>
                                    <InputText id="branchName" v-model.trim="branch.branch_name" required="true"
                                            :invalid="submitted && !branch.branch_name" />
                                    <small class="p-invalid" v-if="submitted && !branch.branch_name">Branch Name is required.</small>
                                </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-6">
                                    <label for="role">for State </label>
                                    <Dropdown id="role" v-model="branch.state_id" :options="states" optionLabel="state_name" optionValue="state_id" placeholder="Select State" required="true" :invalid="submitted && !branch.state_id" @change="getCities" />
                                    <small class="p-invalid" v-if="submitted && !user.lab_id">state is required.</small>
                                </div>
                                <div class="field col-4 md:col-6">
                                    <label for="role">for City </label>
                                    <Dropdown id="role" v-model="branch.city_id" :options="cities" optionLabel="city_name" optionValue="city_id" placeholder="Select city" required="true" :invalid="submitted && !branch.city_id" />
                                    <small class="p-invalid" v-if="submitted && !branch.state_id">lab is required.</small>
                               </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6">
                                    <label for="address">Address</label>
                                    <InputText id="address" v-model.trim="branch.address" required="true"
                                            :invalid="submitted && !branch.address" />
                                    <small class="p-invalid" v-if="submitted && !branch.address">Address is required.</small>
                                </div>
                            </div>
                            </div>
                        </div>
                        <template #footer>
                            <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" class="mt-2"/>
                            <Button label="Save" icon="pi pi-check" text="" v-if ="IsEdit" @click="createBranch" class="mt-2" />
                            <Button label="Save" icon="pi pi-check" text="" v-else @click="saveLab " class="mt-2" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
