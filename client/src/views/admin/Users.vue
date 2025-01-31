<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
//stores
import { HospitalStore} from './../../store/hospital/hospital'
import { userStore } from "./../../store/user/user";
import { useAuthUserStore } from "./../../store/AuthStore/Auth";
import { LabStore} from './../../store/lab/lab'
import emitter from './../../main';
import { useRoute } from 'vue-router';

const toast = useToast();
const userDialog = ref(false);
const user = ref({});
const IsEdit = ref(false)
const roles = ref([]);
const labs = ref([]);
const route = useRoute();
const users = ref([]);
const labsUsers = ref([]);
const expandedRows = ref({});
const selectedUser=ref({});

//stores
const uStore = userStore();
const authstore = useAuthUserStore();
const labstore = LabStore()


const getRoles = () => {
  authstore
    .GetRoles()
    .then((data) => {
      // console.log("Roles", data);
      roles.value = data;
    })
    .catch((err) => {
      console.log("ERR", err);
    });
};
const getLaboratories = (code)=>{
    labstore.GetLabs()
    .then((data)=>{
        if (code && data) {
          data.forEach((e)=>{
             if ( e.lab_code == code ){
               labs.value.push(e)
               user.value = {};
               submitted.value = false;
               userDialog.value = true;
            }
          })
      }else{
        labs.value=data
      }
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

const getBadgeSeverity = (role) => {
    switch (role.toLowerCase()) {
        case 'admin':
            return 'success';
        // case 'user':
            // return 'warning';
        // case 'outofstock':
            // return 'danger';
        // default:
            // return 'info';
    }
};
// onUnmounted(() => {
//       emitter.off('addAdmin', addAdminCalled); // Cleanup
//     });
onMounted(() => {
    console.log("labs.value,labs.value",labs.value)
   const labCode = route.query.id;
   if (labCode){
    getRoles();
    getLaboratories(labCode);
   }
   else
   {
    console.log("Before mount user details ",authstore.user.role)
    if (authstore.user.role=="superadmin"){
        uStore.GetLabsUsers()
        .then((users)=>{
            labsUsers.value = users
            console.log("Uers recieved : ",labsUsers)
        })
        .catch((err)=>{
            console.log("labs Uers ERRROR  : ",err)
        })

    }else{
        //get lab details and all the users of that lab
        uStore.GetAllUsers()
        .then((u)=>{
            users.value = u
            console.log("Uers recieved : ",labsUsers)
        })
        .catch((err)=>{
            console.log("Uers ERRROR  : ",err)
        })

        console.log("IT IS NOT ROLE SUPERADMIN")
    }
   }
   // console.log("labbbbb code - ",labId)
   // emitter.on('addAdmin', (payload) => {
   //      console.log('Event received with payload:', payload);
   //  });
   // // );

    // productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
    getLaboratories()
    getRoles()

};

const hideDialog = () => {
   userDialog.value = false;
    submitted.value = false;
};

const saveUser = () => {
    console.log("ssave cklick")
    submitted.value = true;
    if (user.value.username){
      user.value.name = user.value.firstName+" "+user.value.middleName+" "+user.value.lastName
      user.value.role = user.value.role_name
      console.log("User to updateeee ",user.value)
        uStore.AddUser(user.value)
        .then((data)=>{
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            userDialog.value = false;
            user.value = {};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"Hospital Update Error",detail:"Hospital Details are not updated",life:3000})
        })
    }
};
const updateUser = () => {
    console.log("update user cklick")
    submitted.value = true;
    if (user.value.username){
        console.log("user to updateeee ",user.value)
        uStore.UpdateUser(user.value)
        .then((data)=>{
            console.log("daaat update user",data)
            toast.add({severity:"success",summary:"User Updated",detail:"User Details are updated",life:3000})
            userDialog.value = false;
            user.value = {};
            branch.value ={};
        })
        .catch((err)=>{
            console.log("user to updateeee ",err)

            toast.add({severity:"error",summary:"User Update Error",detail:"User Details are not updated",life:3000})
        })
    }
    IsEdit.value=false
};
const editUser = (h) => {
    // console.log("hospital ",hospital)
    user.value = {...h} ;
    userDialog.value = true;
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

// const initFilters = () => {
//     filters.value = {
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS }
//     };
// };
const onRowExpand = (event) => {
    conole.log("onRowExpand   evebnt ",event)
    toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
    conole.log(" onRowExpand Event ",event)
    toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
};
const expandAll = () => {
    labsUsers.value = labsUsers.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
};
const collapseAll = () => {
    labsUsers.value = null;
};
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
                <!-- users data  -->
                <DataTable
                    ref="dt"
                    :value="users"
                    v-model:selection="selectedUser"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    v-if="users.length"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Users</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="code" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.user_id }}
                        </template>
                    </Column>
                    <Column field="name" header="Name"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.user_name }}
                        </template>
                    </Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="'/demo/images/hospital/' + slotProps.data.hospital_Logo" :alt="slotProps.data.hospital_Logo" class="shadow-2" width="80" />
                        </template>
                    </Column>
                    <!-- <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column> -->
                    <Column field="category" header="Description" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Role</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.role)">{{ slotProps.data.role }}</Tag>
                           </template>
                    </Column>
                    <Column field="category" header="City" headerStyle="width:5%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Username</span>
                            {{ slotProps.data.username }}
                        </template>
                    </Column>
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
                     <!-- <Column field="category" header="State" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">State</span>
                            {{ slotProps.data.state }}
                        </template>
                    </Column> -->
                    <!-- <Column field="inventoryStatus" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column> -->
                    <Column headerStyle="min-width:10rem;"  header="Operations">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editUser(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <!-- super admin users data -->
                <DataTable
                :value="labsUsers"
                v-model:expandedRows="labsUsers.users"

                dataKey="lab_id"
                @rowExpand="onRowExpand"
                selectionMode="single"
                @rowCollapse="onRowCollapse"
                tableStyle="min-width: 60rem; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;"
                >
                <template #header>
                    <div class="flex flex-wrap justify-end gap-2 p-2 bg-gray-100">
                    <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                    </div>
                </template>

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

                <Column field="validity_date" header="Validity Date">
                    <template #body="slotProps">
                    <span>{{ slotProps.data.validity_date || 'N/A' }}</span>
                    </template>
                </Column>

                <template #expansion="slotProps">
                    <div class="p-4 bg-gray-50 rounded-md">
                    <h5 class="font-bold mb-3">Users of {{ slotProps.data.lab_name }}</h5>
                    <DataTable :value="slotProps.data.users || []" tableStyle="min-width: 40rem;">
                        <Column field="user_id" header="User ID" sortable></Column>
                        <Column field="username" header="Username" sortable></Column>
                        <Column field="email" header="Email" sortable></Column>
                        <Column field="role" header="Role" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Role</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.role)">{{ slotProps.data.role }}</Tag>
                        </template>
                    </Column>
                        <!-- <Column field="role" header="Role" sortable></Column> -->
                        <Column field="phone_number" header="Phone Number" sortable></Column>
                        <Column headerStyle="width:4rem">
                        <template #body>
                            <Button icon="pi pi-search" class="p-button-text" />
                        </template>
                        </Column>
                    </DataTable>
                    <p v-if="!slotProps.data.users || slotProps.data.users.length === 0" class="text-gray-500 mt-3">No users available for this lab.</p>
                    </div>
                </template>
                </DataTable>

                <Dialog v-model:visible="userDialog" :style="{ width: '90%' }" header="Hospital Details" :modal="true" class="p-fluid">
                    <div class="col-12">
                       <!-- <div class="card">
                            <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6">
                                    <label for="name">User Name</label>
                                    <InputText id="name" v-model.trim="hospital.hospital_Name" required="true" autofocus :invalid="submitted && !hospital.hospital_Name" />
                                    <small class="p-invalid" v-if="submitted && !hospital.hospital_Name">Name is required.</small>
                                </div>
                                <div class="field col-5 md:col-6">
                                    <label for="description">Description</label>
                                    <InputText id="name" v-model.trim="hospital.description" required="true" autofocus :invalid="submitted && !hospital.description" />
                                     <Textarea id="description" v-model="hospital.description" required="true" rows="3" cols="20" />
                                    <small class="p-invalid" v-if="submitted && !hospital.description">Description is required.</small>
                                </div>
                               <div class="field col-3 md:col-6">
                                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" :auto="true" chooseLabel="Browse" />
                                </div> -->
                                <!-- <div class="field col-12 md:col-6">
                                    <label for="lastname2">Lastname</label>
                                    <InputText id="lastname2" type="text" />
                                </div>
                                <div class="field col-12">
                                    <label for="address">Address</label>
                                    <Textarea id="address" rows="4" />
                                </div> -->
                                <!-- <div class="field col-12 md:col-6">
                                    <label for="city">City</label>
                                    <InputText id="name" v-model.trim="hospital.city" required="true" autofocus :invalid="submitted && !hospital.city" />
                                    <small class="p-invalid" v-if="submitted && !hospital.city">City is required.</small>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="state">State</label>
                                    <InputText id="name" v-model.trim="hospital.state" required="true" autofocus :invalid="submitted && !hospital.status" />
                                   <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown> -->
                               <!-- </div>
                                <div class="field col-12 md:col-3">
                                    <label for="zip">Zip</label>
                                    <InputText id="name" v-model.trim="hospital.pinpcode" required="true" autofocus :invalid="submitted && !hospital.pinpcode" />
                                    <small class="p-invalid" v-if="submitted && !hospital.pinpcode">Pincode is required.</small>
                                </div>
                            </div>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-6">
                                    <label for="city">Branch Name</label>
                                    <InputText id="name" v-model.trim="branch.branch_name" required="true" autofocus :invalid="submitted && !branch.branch_name" />
                                    <small class="p-invalid" v-if="submitted && !branch.branch_name">Branch name is required.</small>
                                </div>
                                 <div class="field col-12">
                                    <label for="address">Branch Address</label>
                                    <Textarea id="address" v-model="branch.address" required="true" rows="3" cols="20" />
                                </div>
                                 <div class="field col-12 md:col-6">
                                    <label for="city">City</label>
                                    <InputText id="name" v-model.trim="branch.city" required="true" autofocus :invalid="submitted && !branch.city" />
                                    <small class="p-invalid" v-if="submitted && !branch.city">City is required.</small>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="state">State</label>
                                    <InputText id="name" v-model.trim="branch.state" required="true" autofocus :invalid="submitted && !branch.state" />
                                     <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown>
                                </div>
                                 <div class="field col-12 md:col-3">
                                    <label for="zip">Zip</label>
                                    <InputText id="name" v-model.trim="branch.pinpcode" required="true" autofocus :invalid="submitted && !branch.pinpcode" />
                                    <small class="p-invalid" v-if="submitted && !branch.pinpcode">Pincode is required.</small>
                                </div>
                            </div>
                        </div> -->
                        <div class="card">
                           <div class="p-fluid formgrid grid">
                           <!-- First Name -->
                           <div class="field col-4 md:col-6">
                              <label for="firstName">First Name</label>
                              <InputText id="firstName" v-model.trim="user.firstName" required="true" :invalid="submitted && !user.firstName" />
                              <small class="p-invalid" v-if="submitted && !user.firstName">First name is required.</small>
                           </div>
                           <!-- Middle Name -->
                           <div class="field col-4 md:col-6">
                              <label for="middleName">Middle Name</label>
                              <InputText id="middleName" v-model.trim="user.middleName" />
                           </div>
                           <!-- Last Name -->
                           <div class="field col-4 md:col-6">
                              <label for="lastName">Last Name</label>
                              <InputText id="lastName" v-model.trim="user.lastName" required="true" :invalid="submitted && !user.lastName" />
                              <small class="p-invalid" v-if="submitted && !user.lastName">Last name is required.</small>
                           </div>
                           <div class="field col-4 md:col-6">
                              <label for="role">for Lab </label>
                              <Dropdown id="role" v-model="user.lab_id" :options="labs" optionLabel="lab_name" optionValue="lab_id" placeholder="Select Lab" required="true" :invalid="submitted && !user.lab_id" />
                              <small class="p-invalid" v-if="submitted && !user.lab_id">lab is required.</small>
                           </div>
                           <!-- Age -->
                           <div class="field col-4 md:col-6">
                              <label for="age">Age</label>
                              <InputNumber id="age" v-model="user.age" :min="1" :invalid="submitted && !user.age" />
                              <small class="p-invalid" v-if="submitted && !user.age">Age is required.</small>
                           </div>
                           <!-- Email -->
                           <div class="field col-4 md:col-6">
                              <label for="email">Email</label>
                              <InputText id="email" type="email" v-model.trim="user.email" required="true" :invalid="submitted && !user.email" />
                              <small class="p-invalid" v-if="submitted && !user.email">Valid email is required.</small>
                           </div>
                           <!-- Role -->
                           <div class="field col-4 md:col-6">
                              <label for="role">Role</label>
                              <Dropdown id="role" v-model="user.role_name" :options="roles" optionLabel="role_name" optionValue="role_name" placeholder="Select Role" required="true" :invalid="submitted && !user.role" />
                              <small class="p-invalid" v-if="submitted && !user.role">Role is required.</small>
                           </div>
                           <!-- Phone Number -->
                           <div class="field col-4 md:col-6">
                              <label for="phoneNumber">Phone Number</label>
                              <InputText id="phoneNumber" v-model.trim="user.phone_number" required="true" :invalid="submitted && !user.phoneNumber" />
                              <small class="p-invalid" v-if="submitted && !user.phoneNumber">Phone number is required.</small>
                           </div>
                           <!-- UserName -->
                           <div class="field col-4 md:col-6">
                           <label for="username">Username</label>
                              <InputText id="username" v-model.trim="user.username" required="true" autofocus :invalid="submitted && !user.username" />
                              <small class="p-invalid" v-if="submitted && !user.username">Username is required.</small>
                           </div>
                           <!-- Password -->
                           <div class="field col-4 md:col-6">
                              <label for="password">Password</label>
                              <Password id="password" v-model.trim="user.password" required="true" :feedback="false" :invalid="submitted && !user.password" />
                              <small class="p-invalid" v-if="submitted && !user.password">Password is required.</small>
                           </div>
                           <!-- Address -->
                           <div class="field col-4 md:col-6">
                              <label for="address">Address</label>
                              <Textarea id="address" v-model.trim="user.address" rows="3" required="true" :invalid="submitted && !user.address" />
                              <small class="p-invalid" v-if="submitted && !user.address">Address is required.</small>
                           </div>
                           <!-- City -->
                           <div class="field col-4 md:col-6">
                              <label for="city">City</label>
                              <InputText id="city" v-model.trim="user.city" required="true" :invalid="submitted && !user.city" />
                              <small class="p-invalid" v-if="submitted && !user.city">City is required.</small>
                           </div>

                           <!-- State -->
                           <div class="field col-4 md:col-6">
                              <label for="state">State</label>
                              <InputText id="state" v-model.trim="user.state" required="true" :invalid="submitted && !user.state" />
                              <small class="p-invalid" v-if="submitted && !user.state">State is required.</small>
                           </div>
                           <div class="field col-4 md:col-6">
                              <label for="state">Pincode</label>
                              <InputText id="state" v-model.trim="user.pincode" required="true" :invalid="submitted && !user.pincode" />
                              <small class="p-invalid" v-if="submitted && !user.pincode">State is required.</small>
                           </div>
                        </div>
                     </div>
                   </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" class="mt-2"/>
                        <Button label="Save" icon="pi pi-check" text="" v-if ="IsEdit" @click="updateUser" class="mt-2" />
                        <Button label="Save" icon="pi pi-check" text="" v-else @click="saveUser" class="mt-2" />

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
