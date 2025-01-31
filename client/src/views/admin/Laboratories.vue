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
const labsbranches = ref([]);
const labDialog = ref(false);
const lab = ref({});
const IsEdit = ref(false)
const branch = ref({});
const router = useRouter()
const states = ref([]);
const cities = ref([]);
const authstore = useAuthUserStore();

const getLaboratories = ()=>{
    labstore.GetLabs()
    .then((data)=>{
        labs.value=data
    })
    .catch((er)=>{
        console.log("Error ",er)
    })
}
const getLabsBranches = ()=>{
    labstore.GetLabsBranches()
    .then((data)=>{
        labsbranches.value=data
    })
    .catch((er)=>{
        console.log("Error ",er)
    })
}
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
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);
const productService = new ProductService();

const getBadgeSeverity = (inventoryStatus) => {
    switch (inventoryStatus.toLowerCase()) {
        case 'instock':
            return 'success';
        case 'lowstock':
            return 'warning';
        case 'outofstock':
            return 'danger';
        default:
            return 'info';
    }
};

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
   getLaboratories()
   getLabsBranches()

    // productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

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
      //   var ReqData = {
      //       "hospital" :hospital.value,
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
const editLab = (l) => {
    // console.log("hospital ",hospital)
    lab.value = {...l} ;
    labDialog.value = true;
    IsEdit.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < products.value.length; i++) {
//         if (products.value[i].id === id) {
//             index = i;
//             break;
//         }
//     }
//     return index;
// };

// const createId = () => {
//     let id = '';
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < 5; i++) {
//         id += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return id;
// };

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
   // console.log("Admin clicked - ", d)
   router.push({ path: '/users', query: { id: d.lab_code } });
   // emitter.emit("addAdmin", d); // Emit the event
}
const createBranchClicked=(d) =>{
    lab.value.lab_name = d.lab_name
    lab.value.lab_code = d.lab_code
    lab.value.lab_id = d.lab_id
    labDialog.value = true;
    IsEdit.value = true;
    console.log("createBranchClicked clicked - ", d)
    branch.value.lab_id = d.lab_id
    getStates()


//    router.push({ path: '/users', query: { id: d.lab_code } });
   // emitter.emit("addAdmin", d); // Emit the event
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="labs"
                    v-model:selection="selectedlab"
                    dataKey="lab_id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Labs</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="code" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.lab_code }}
                        </template>
                    </Column>
                    <Column field="name" header="Name"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.lab_name }}
                        </template>
                    </Column>
                    <!-- <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="'/demo/images/hospital/' + slotProps.data.hospital_Logo" :alt="slotProps.data.hospital_Logo" class="shadow-2" width="80" />
                        </template>
                    </Column> -->
                    <!-- <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column> -->
                   <!-- <Column field="category" header="Description" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Description</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column field="category" header="City" headerStyle="width:5%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">City</span>
                            {{ slotProps.data.city }}
                        </template>
                    </Column> -->
                    <!-- <Column field="category" header="Address" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Address</span>
                            {{ slotProps.data.address }}
                        </template>
                    </Column> -->
                    <!-- <Column field="rating" header="City" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">City</span>
                            <Rating :modelValue="slotProps.data.city" :readonly="true" :cancel="false" />
                        </template>
                    </Column> -->
                     <Column field="category" header="State" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">State</span>
                            {{ slotProps.data.state }}punre
                        </template>
                    </Column>
                    <!-- <Column field="inventoryStatus" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column> -->
                    <Column headerStyle="min-width:10rem;"  header="Operations">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editLab(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;"  header="Operations">
                        <template #body="slotProps">
                            <Button icon="pi pi-user-plus" class="mt-2" severity="warning" label ="Admin" rounded @click="addAdminClicked(slotProps.data)" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;"  header="Branch">
                        <template #body="slotProps">
                            <Button icon="pi pi-user-plus" class="mt-2" severity="warning" label ="Admin" rounded @click="createBranchClicked(slotProps.data)" />
                        </template>
                    </Column>

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
