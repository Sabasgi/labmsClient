<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { LabStore} from './../../store/lab/lab'
// import emitter from '../../main';
import { useRouter } from 'vue-router';

const toast = useToast();
const labstore = LabStore()
const labs = ref(null);
const labDialog = ref(false);
const lab = ref({});
const IsEdit = ref(false)
const branch = ref({});
const router = useRouter()

const getLaboratories = ()=>{
    labstore.GetLabs()
    .then((data)=>{
      //   console.log("res",data)
        labs.value=data
    })
    .catch((er)=>{
        console.log("Error ")
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
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            labDialog.value = false;
            hospital.value = {};
            branch.value ={};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"Hospital Update Error",detail:"Hospital Details are not updated",life:3000})
        })
    }
};
const updateLab = () => {
   //  console.log("ssave cklick")
    submitted.value = true;
    if (lab.value.lab_name){
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
        labstore.UpdateLab(lab)
        .then((data)=>{
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            labDialog.value = false;
            lab.value = {};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"Hospital Update Error",detail:"Hospital Details are not updated",life:3000})
        })
    }
    IsEdit.value=false
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
const addAdminClicked=(d) =>{
   // console.log("Admin clicked - ", d)
   router.push({ path: '/users', query: { id: d.lab_code } });
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
                </DataTable>
                <Dialog v-model:visible="labDialog" :style="{ width: '90%' }" header="Lab Details" :modal="true" class="p-fluid">
                    <div class="col-12">
                        <div class="card">
                            <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6" v-if="IsEdit">
                                    <label for="name">Lab Code</label>
                                    <InputText id="name" v-model.trim="lab.lab_code" required="true" autofocus :invalid="submitted && !lab.lab_code" disabled/>
                                    <small class="p-invalid" v-if="submitted && !lab.lab_code">Name is required.</small>
                                </div>
                              </div>
                              <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6">
                                    <label for="name">Lab Name</label>
                                    <InputText id="name" v-model.trim="lab.lab_name" required="true" autofocus :invalid="submitted && !lab.lab_name" />
                                    <small class="p-invalid" v-if="submitted && !lab.lab_name">Name is required.</small>
                                </div>
                              </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" class="mt-2"/>
                        <Button label="Save" icon="pi pi-check" text="" v-if ="IsEdit" @click="updateLab" class="mt-2" />
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
