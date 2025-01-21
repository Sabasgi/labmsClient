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
const hStore = HospitalStore()
const hospitals = ref(null);
const roleDialog = ref(false);
const role = ref({});
const IsEdit = ref(false)
const roles = ref([]);
const labs = ref([]);
const route = useRoute();

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
      //   labs.value=data
        if (code && data) {
          data.forEach((e)=>{
             if ( e.lab_code == code ){
               // console.log("e eee   eee",e)
               labs.value.push(e)
               // console.log("labsss",labs.value)
               // user.lab_id = e.lab_id
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
const addAdminCalled=(data)=>{
   console.log("addAdminCalled",data)
}
onBeforeMount(() => {
    initFilters();

});
// onUnmounted(() => {
//       emitter.off('addAdmin', addAdminCalled); // Cleanup
//     });
onMounted(() => {
   // const labCode = route.query.id;
   // console.log("labbbbb code - ",labId)
   // getRoles();
   // getLaboratories(labCode);
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
   role.value = {};
    submitted.value = false;
    roleDialog.value = true;
};

const hideDialog = () => {
   roleDialog.value = false;
    submitted.value = false;
};

const saveRole = () => {
    console.log("ssave cklick")
    submitted.value = true;
   //  if (role.value.username){

      console.log("User to updateeee ",role.value)
        uStore.AddRole(role.value)
        .then((data)=>{
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            roleDialog.value = false;
            user.value = {};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"Hospital Update Error",detail:"Hospital Details are not updated",life:3000})
        })
   //  }
};
const updateUser = () => {
    console.log("ssave cklick")
    submitted.value = true;
    if (hospital.value.hospital_Name && hospital.value.hospital_Name.trim() && branch.value.branch_name.trim() && branch.value.branch_name){
        console.log("hospital to updateeee ",hospital.value)
        var ReqData = {
            "hospital" :hospital.value,
            "branch":branch.value
        }
          hStore.UpdateHospital(ReqData)
        .then((data)=>{
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            roleDialog.value = false;
            user.value = {};
            branch.value ={};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"Hospital Update Error",detail:"Hospital Details are not updated",life:3000})
        })
    }
    IsEdit.value=false
};
const editHospital = (h) => {
    // console.log("hospital ",hospital)
    user.value = {...h} ;
    roleDialog.value = true;
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

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
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
                    :value="hospitals"
                    v-model:selection="selectedhospital"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Hospitals</h5>
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
                            {{ slotProps.data.hcode }}
                        </template>
                    </Column>
                    <Column field="name" header="Name"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.hospital_Name }}
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
                            <span class="p-column-title">Description</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column field="category" header="City" headerStyle="width:5%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">City</span>
                            {{ slotProps.data.city }}
                        </template>
                    </Column>

                     <Column field="category" header="State" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">State</span>
                            {{ slotProps.data.state }}
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
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editHospital(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="roleDialog" :style="{ width: '90%' }" header="Role Details" :modal="true" class="p-fluid">
                    <div class="col-12">

                        <div class="card">
                           <div class="p-fluid formgrid grid">
                           <!-- First Name -->
                           <div class="field col-4 md:col-6">
                              <label for="firstName">Role Name</label>
                              <InputText id="firstName" v-model.trim="role.role_name" required="true" :invalid="submitted && !role.role_name" />
                              <small class="p-invalid" v-if="submitted && !role.role_namee">Role name is required.</small>
                           </div>

                           <!-- Descrption -->
                           <div class="field col-4 md:col-6">
                              <label for="address">Description</label>
                              <Textarea id="address" v-model.trim="role.description" rows="3" required="true" :invalid="submitted && !role.description" />
                              <small class="p-invalid" v-if="submitted && !role.description">description is required.</small>
                           </div>
                        </div>
                     </div>
                   </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" class="mt-2"/>
                        <Button label="Save" icon="pi pi-check" text="" v-if ="IsEdit" @click="updateUser" class="mt-2" />
                        <Button label="Save" icon="pi pi-check" text="" v-else @click="saveRole" class="mt-2" />

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
