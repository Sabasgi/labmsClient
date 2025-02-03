<script setup>
import { ref,onMounted } from 'vue';
import { LabStore} from './../../store/lab/lab';
import { useToast } from 'primevue/usetoast';
import { useAuthUserStore } from "./../../store/AuthStore/Auth";

// stores
const labstore = LabStore()
const toast = useToast();
const authstore = useAuthUserStore();


const branches = ref([]);
const expandedRows = ref([]);
const addDeptDialog=ref(true);
const department=ref({});
const IsEdit = ref(false);


const addDepartment=()=>{
   labstore.CreateDepartment(dept)
    .then((data)=>{
        console.log("branchessss ",data)
        branches.value=data
    })
    .catch((er)=>{
        console.log("Error ",er)
    })
}
const getBranches = ()=>{
   labstore.GetBranches()
    .then((data)=>{
        console.log("branchessss ",data)
        branches.value=data
    })
    .catch((er)=>{
        console.log("Error ",er)
    })
}
const onRowExpand = (event) => {
   //  lab.value.lab_name = event.data.lab_name
   //  lab.value.lab_code = event.data.lab_code
   //  lab.value.lab_id = event.data.lab_id
   //  console.log("event row expanded ",lab.value)
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
onMounted(()=>{
   getBranches()
})
</script>
<template>
<div class="grid">
      <div class="col-12">
         <div class="card">
            <DataTable
                    :value="branches"
                    v-model:expandedRows="expandedRows"
                    v-if="branches && branches.length > 0"
                    dataKey="branch_id"
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
                    <template #empty> No Branches found. </template>
                    <template #loading> Loading users data. Please wait. </template>
                    <Column expander style="width: 5rem; text-align: center;" />
                    <Column field="branch_id" header="Branch ID">
                        <template #body="slotProps">
                            <strong>{{ slotProps.data.branch_id }}</strong>
                        </template>
                    </Column>

                    <Column field="branch_name" header="Branch Name">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.branch_name }}</span>
                        </template>
                    </Column>

                    <Column field="branch_code" header="Branch Code">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.branch_code }}</span>
                        </template>
                    </Column>
                    <Column field="address" header="Address Id">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.address }}</span>
                        </template>
                    </Column>
                    <Column field="lab_id" header="Lab Id">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.lab_id }}</span>
                        </template>
                    </Column>
                     <Column field="admin Add" header="Add admin">
                        <template #body="slotProps">
                        <Button label="add admin" outlined class="mb-2 mr-2" @click="addDepartment(slotProps.data)"/>
                        </template>
                    </Column>
                    <!-- <Column field="add Branch" header="add Branch">
                        <template #body="slotProps">
                        <Button label="create branch" outlined class="mb-2 mr-2" @click="createBranchClicked(slotProps.data)"/>
                        </template>
                    </Column> -->
                    <template #expansion="slotProps">
                        <div v-if="slotProps.data.departments && slotProps.data.branches.length >0">
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
         </div>
   </div>
   <Dialog v-model:visible="addDeptDialog" :style="{ width: '70%' }" header="Confirm" :modal="true">
      <div class="card">
         <h2 class="text-2xl font-bold mb-4">Add Department</h2>
         <form @submit.prevent="submitForm">
            <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
               <label for="departmentId" class="font-bold">Department ID</label>
               <InputNumber
                  id="departmentId"
                  v-model="department.departmentId"
                  :useGrouping="false"
                  required
                  class="w-full"
                  hidden
               />
            </div>
            <!-- <div class="field col-12 md:col-6">
               <label for="branchId" class="font-bold">Branch ID</label>
               <InputNumber
                  id="branchId"
                  v-model="department.branchId"
                  :useGrouping="false"
                  required
                  class="w-full"
               />
            </div> -->
            <div class="field col-4 md:col-6">
               <label for="departmentName" > Department Name </label>
               <InputText id="departmentName" v-model.trim="department.departmentName" required="true"
                        :disabled="IsEdit" :invalid="submitted && !branch.branch_code" />
               <small class="p-invalid" v-if="submitted && !department.departmentName">departmentName  is required.</small>
            </div>
            <div class="field col-4 md:col-6">
               <label for="description">Description</label>
               <Textarea id="address" v-model.trim="department.description" rows="3" required="true" :invalid="submitted && !department.description" />
               <small class="p-invalid" v-if="submitted && !department.description">description is required.</small>
            </div>


            <!-- <div class="field col-12 md:col-6">
               <label for="labId" class="font-bold">Lab ID</label>
               <InputNumber
                  id="labId"
                  v-model="department.labId"
                  :useGrouping="false"
                  class="w-full"
               />
            </div> -->
            </div>

            <Button
            type="submit"
            label="Add Department"
            icon="pi pi-check"
            class="mt-4"
            :disabled="!isFormValid"
            />
         </form>
      </div>
         <template #footer>
            <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" class="mt-2"/>
            <Button label="Save" icon="pi pi-check" text="" v-if ="IsEdit" @click="updateUser" class="mt-2" />
            <Button label="Save" icon="pi pi-check" text="" v-else @click="saveUser" class="mt-2" />

         </template>
   </Dialog>

</div>

</template>