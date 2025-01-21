<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { HospitalStore} from './../../store/hospital/hospital'
const toast = useToast();
const hStore = HospitalStore()
const hospitals = ref(null);
const hospitalDialog = ref(false);
const hospital = ref({});
const IsEdit = ref(false)
const branch = ref({});

const getHospitals = ()=>{
    hStore.GetAllHospitals()
    .then((data)=>{
        console.log("res",data)
        hospitals.value=data
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
   getHospitals()
    // productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    hospital.value = {};
    submitted.value = false;
    hospitalDialog.value = true;
};

const hideDialog = () => {
    hospitalDialog.value = false;
    submitted.value = false;
};

const saveHospital = () => {
    console.log("ssave cklick")
    submitted.value = true;
    if (hospital.value.hospital_Name && hospital.value.hospital_Name.trim() && branch.value.branch_name.trim() && branch.value.branch_name){
        console.log("hospital to updateeee ",hospital.value)
        var ReqData = {
            "hospital" :hospital.value,
            "branch":branch.value
        }
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
        hStore.AddHospital(ReqData)
        .then((data)=>{
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            hospitalDialog.value = false;
            hospital.value = {};
            branch.value ={};
        })
        .catch((err)=>{
            toast.add({severity:"error",summary:"Hospital Update Error",detail:"Hospital Details are not updated",life:3000})
        })
    }
};
const updateHospital = () => {
    console.log("ssave cklick")
    submitted.value = true;
    if (hospital.value.hospital_Name && hospital.value.hospital_Name.trim() && branch.value.branch_name.trim() && branch.value.branch_name){
        console.log("hospital to updateeee ",hospital.value)
        var ReqData = {
            "hospital" :hospital.value,
            "branch":branch.value
        }
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
        hStore.UpdateHospital(ReqData)
        .then((data)=>{
            toast.add({severity:"success",summary:"Hospital Updated",detail:"Hospital Details are updated",life:3000})
            hospitalDialog.value = false;
            hospital.value = {};
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
    hospital.value = {...h} ;
    hospitalDialog.value = true;
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

                <Dialog v-model:visible="hospitalDialog" :style="{ width: '90%' }" header="Hospital Details" :modal="true" class="p-fluid">
                    <div class="col-12">
                        <div class="card">
                            <div class="p-fluid formgrid grid">
                                <div class="field col-4 md:col-6">
                                    <label for="name">Hospital Name</label>
                                    <InputText id="name" v-model.trim="hospital.hospital_Name" required="true" autofocus :invalid="submitted && !hospital.hospital_Name" />
                                    <small class="p-invalid" v-if="submitted && !hospital.hospital_Name">Name is required.</small>
                                </div>
                                <div class="field col-5 md:col-6">
                                    <label for="description">Description</label>
                                    <InputText id="name" v-model.trim="hospital.description" required="true" autofocus :invalid="submitted && !hospital.description" />
                                    <!-- <Textarea id="description" v-model="hospital.description" required="true" rows="3" cols="20" /> -->
                                    <small class="p-invalid" v-if="submitted && !hospital.description">Description is required.</small>
                                </div>
                                 <!-- <div class="field col-3 md:col-6">
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
                                </div> -->
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
                                    <!-- <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One"></Dropdown> -->
                                </div>
                                <!-- <div class="field col-12 md:col-3">
                                    <label for="zip">Zip</label>
                                    <InputText id="name" v-model.trim="branch.pinpcode" required="true" autofocus :invalid="submitted && !branch.pinpcode" />
                                    <small class="p-invalid" v-if="submitted && !branch.pinpcode">Pincode is required.</small>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" class="mt-2"/>
                        <Button label="Save" icon="pi pi-check" text="" v-if ="IsEdit" @click="updateHospital" class="mt-2" />
                        <Button label="Save" icon="pi pi-check" text="" v-else @click="saveHospital " class="mt-2" />

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
