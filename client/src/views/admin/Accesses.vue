<script setup>
import { ref, onBeforeMount, reactive, onMounted } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { CustomerService } from "@/service/CustomerService";
import { ProductService } from "@/service/ProductService";
import { useAuthUserStore } from "./../../store/AuthStore/Auth";
// import { useAuthUserStore } from './../../../store/AuthStore/Auth';

import { useToast } from "primevue/usetoast";
const toast = useToast();
const authstore = useAuthUserStore();
const roles = ref(null);
const display = ref(false);
const nodes = ref([]);
const selectedKey = ref({});
const selectedNodes = ref([]);
const getRoles = () => {
  authstore
    .GetRoles()
    .then((data) => {
      console.log("Roles", data);
      roles.value = data;
    })
    .catch((err) => {
      console.log("ERR", err);
    });
};
const getRolesWiseMenu = (role) => {
  authstore
    .GetRolewiseMenus(role)
    .then((data) => {
      let menu = data;
      // let menu = data.Menus;
      for (let index = 0; index < menu.length; index++) {
        const element = menu[index];
        // console.log("element",element);
        var nodetemp = {};
        nodetemp.key = index;
        nodetemp.label = element.label;
        nodetemp.icon = element.icon;
        nodetemp.menu_id = element.menu_id;
        nodetemp.checked = element.allowed;
        // console.log("key :", nodetemp.key, " element.allowed ", element.allowed);
        if (element.allowed) {
          selectedKey.value[nodetemp.key] = {
            checked: element.allowed,
            partialChecked: false,
          };
        }
        nodetemp.role_id = data.role_id;
        if (element.items) {
          nodetemp.children = [];
          var partialcheckflg = false;
          for (let i = 0; i < element.items.length; i++) {
            var t = element.items[i];
            var temp = {};
            temp.key = index + "_" + i;
            temp.label = t.label;
            temp.icon = t.icon;
            temp.menu_id = t.menu_id;
            temp.checked = t.allowed;
            if (temp.checked) {
              selectedKey.value[temp.key] = {
                checked: temp.checked,
                partialChecked: false,
              };
            }
            // console.log("slectedKey    check uncheck ", selectedKey);
            if (temp.checked) {
              partialcheckflg = true;
            } else {
              partialcheckflg = false;
            }
            temp.role_id = data.role_id;
            temp.parent_menu_id = t.parent_menu_id;
            nodetemp.children.push(temp);
          }
          selectedKey.value[nodetemp] = { partialChecked: !partialcheckflg };
          // console.log("items are presents",nodetemp.children)
        }
        nodes.value.push(nodetemp);
      }
      // console.log("dataaaaa res",nodes.value)
      // nodes.value=data.Menus
    })
    .catch((ee) => {
      console.log("?eee", ee);
    });
};
onMounted(() => {
  getRoles();
});
const open = (data) => {
  display.value = !display.value;
  console.log("Data", data);
  nodes.value.splice(0);
  getRolesWiseMenu(data);
};

const close = () => {
  display.value = false;
};
const onNodeSelect = (node) => {
  // selectedNodes.value.push(node)
  // console.log("node selected",selectedNodes)
  toast.add({
    severity: "success",
    summary: "Node Selected",
    detail: node.label,
    life: 3000,
  });
};

const onNodeUnselect = (node) => {
  // selectedNodes.value.filter((i,temp)=>{

  // if (temp.key==node.key){
  // }
  // })
  toast.add({
    severity: "success",
    summary: "Node Unselected",
    detail: node.label,
    life: 3000,
  });
};
const onNodeExpand = (node) => {
  toast.add({
    severity: "info",
    summary: "Node Expanded",
    detail: node.label,
    life: 3000,
  });
};
const nodesaveclicked = (e) => {
  for (let index = 0; index < nodes.value.length; index++) {
    const el = nodes.value[index];
    // console.log("el.key",el.key,"obj",selectedKey.value[el.key],"selectedKey.value[el.key].checked",selectedKey.value[el.key])
    if (selectedKey.value[el.key]) {
      nodes.value[index].allowed = selectedKey.value[el.key].checked;
    } else {
      nodes.value[index].allowed = false;
    }
    if (el.children) {
      if (selectedKey.value[el.key]) {
        if (
          selectedKey.value[el.key].partialChecked == true &&
          selectedKey.value[el.key].checked == false
        ) {
          nodes.value[index].allowed = true;
        }
        nodes.value[index].items = nodes.value[index].children;
        el.items.forEach((element, i) => {
          console.log("forech i ,element", i, element);
          if (selectedKey.value[element.key]) {
            nodes.value[index].items[i].allowed = selectedKey.value[element.key].checked;
          } else {
            nodes.value[index].items[i].allowed = false;
          }
        });
      }else{
            nodes.value[index].allowed = false
            nodes.value[index].items =  nodes.value[index].children
            nodes.value[index].items.forEach((element,i) => {
            // console.log("forech i ,element",i,element)
                if (selectedKey.value[element.key]){
                    nodes.value[index].items[i].allowed = selectedKey.value[element.key].checked
                }else{
                    nodes.value[index].items[i].allowed = false
                }
            });
      }

      // nodes.value[index].children = {}
    }
  }
  console.log(" nodes ", nodes.value);
  updatePerms(nodes.value);
};
const updatePerms = (perms) => {
  authstore
    .UpdatePermissions(perms)
    .then((data) => {
    //   console.log("update permds res", data);
      toast.add({
        severity: "success",
        summary: "Updated Permissions ",
        detail: "Permissions for selected roles are updated",
        life: 5000,
      });
      display.value = !display.value;

    })
    .catch((err) => {
      console.log("update permds err", err);
      toast.add({
        severity: "error",
        summary: "Node Unselected",
        detail: "Failed to update Permissions of the selected role",
        life: 3000,
      });
    });
};
// const showDialog=()=>{
//     isShowDialog=true
//     console.log("show",isShowDialog)
// }
const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive([
  "unqualified",
  "qualified",
  "new",
  "negotiation",
  "renewal",
  "proposal",
]);
const representatives = reactive([
  { name: "Amy Elsner", image: "amyelsner.png" },
  { name: "Anna Fali", image: "annafali.png" },
  { name: "Asiya Javayant", image: "asiyajavayant.png" },
  { name: "Bernardo Dominic", image: "bernardodominic.png" },
  { name: "Elwin Sharvill", image: "elwinsharvill.png" },
  { name: "Ioni Bowcher", image: "ionibowcher.png" },
  { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
  { name: "Onyama Limba", image: "onyamalimba.png" },
  { name: "Stephen Shaw", image: "stephenshaw.png" },
  { name: "XuXue Feng", image: "xuxuefeng.png" },
]);

const customerService = new CustomerService();
const productService = new ProductService();

const getBadgeSeverity = (inventoryStatus) => {
  switch (inventoryStatus.toLowerCase()) {
    case "instock":
      return "success";
    case "lowstock":
      return "warning";
    case "outofstock":
      return "danger";
    default:
      return "info";
  }
};
const getSeverity = (status) => {
  switch (status) {
    case "unqualified":
      return "danger";

    case "qualified":
      return "success";

    case "new":
      return "info";

    case "negotiation":
      return "warning";

    case "renewal":
      return null;
  }
};

onBeforeMount(() => {
  productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
  customerService.getCustomersLarge().then((data) => {
    customer1.value = data;
    loading1.value = false;
    customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
  });
  customerService.getCustomersLarge().then((data) => (customer2.value = data));
  customerService.getCustomersMedium().then((data) => (customer3.value = data));
  loading2.value = false;

  initFilters1();
});

const initFilters1 = () => {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  };
};

const clearFilter1 = () => {
  initFilters1();
};
const expandAll = () => {
  expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
};
const collapseAll = () => {
  expandedRows.value = null;
};
const formatCurrency = (value) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const formatDate = (value) => {
  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
const calculateCustomerTotal = (name) => {
  let total = 0;
  if (customer3.value) {
    for (let customer of customer3.value) {
      if (customer.representative.name === name) {
        total++;
      }
    }
  }

  return total;
};
const toggleDataTable = (event) => {
  op2.value.toggle(event);
  console.log("toggele", event);
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Filter Menu</h5>
        <DataTable
          :value="roles"
          :rows="10"
          dataKey="id"
          :rowHover="true"
          :loading="loading1"
        >
          <!-- <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter1()" />
                            <IconField iconPosition="left">
                                <InputIcon class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </IconField>
                        </div>
                    </template> -->
          <template #empty> No Roles found. </template>
          <template #loading> Loading Roles data. Please wait. </template>
          <Column field="role_id" header="Role Id" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.role_id }}
            </template>
            <!-- <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template> -->
          </Column>
          <Column field="role_name" header="Role Name" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.role_name }}
            </template>
            <!-- <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template> -->
          </Column>
          <Column field="" header="Permissions" style="min-width: 12rem">
            <template #body="{ data }">
              <div>
                <Dialog
                  header="Dialog"
                  v-model:visible="display"
                  :breakpoints="{ '960px': '75vw' }"
                  :style="{ width: '30vw' }"
                  :modal="true"
                >
                  <p class="line-height-3 m-0">Select Menu</p>
                  <div class="card flex justify-content-center">
                    <Toast />
                    <Tree
                      v-model:selectionKeys="selectedKey"
                      :value="nodes"
                      selectionMode="checkbox"
                      class="w-full md:w-30rem"
                      @nodeSelect="onNodeSelect"
                      @nodeUnselect="onNodeUnselect"
                      @nodeExpand="onNodeExpand"
                    ></Tree>
                  </div>
                  <template #footer>
                    <div class="flex justify-content-end gap-2">
                      <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="display = false"
                      ></Button>
                      <Button
                        type="button"
                        label="Save"
                        @click="nodesaveclicked"
                      ></Button>
                    </div>
                  </template>
                </Dialog>
                <Button
                  icon="pi pi-check"
                  rounded
                  outlined
                  class="mb-2 mr-2"
                  @click="open(data)"
                />
              </div>
            </template>
            <!-- <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template> -->
          </Column>
          <!-- <Column header="Country" filterField="country.name" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img alt="flag" src="/demo/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                                <span>{{ data.country.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />
                        </template>
                        <template #filterclear="{ filterCallback }">
                            <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                        </template>
                        <template #filterapply="{ filterCallback }">
                            <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                        </template>
                    </Column> -->
          <!-- <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                                <span>{{ data.representative.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Agent Picker</div>
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any" class="p-column-filter">
                                <template #option="slotProps">
                                    <div class="p-multiselect-representative-option">
                                        <img :alt="slotProps.option.name" :src="'/demo/images/avatar/' + slotProps.option.image" width="32" style="vertical-align: middle" />
                                        <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Tag :severity="getSeverity(data.status)">{{ data.status.toUpperCase() }}</Tag>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <Tag :severity="getSeverity(slotProps.value)" v-if="slotProps.value">{{ slotProps.value }} </Tag>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Tag :severity="getSeverity(slotProps.option)">{{ slotProps.option.toUpperCase() }}</Tag>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                            <div class="flex align-items-center justify-content-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <TriStateCheckbox v-model="filterModel.value" />
                        </template>
                    </Column> -->
        </DataTable>
        <!-- <DataTable
                    :value="customer1"
                    :paginator="true"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters1"
                    filterDisplay="menu"
                    :loading="loading1"
                    :filters="filters1"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
                    showGridlines
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter1()" />
                            <IconField iconPosition="left">
                                <InputIcon class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="Country" filterField="country.name" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img alt="flag" src="/demo/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                                <span>{{ data.country.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />
                        </template>
                        <template #filterclear="{ filterCallback }">
                            <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                        </template>
                        <template #filterapply="{ filterCallback }">
                            <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                        </template>
                    </Column>
                    <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                                <span>{{ data.representative.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Agent Picker</div>
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any" class="p-column-filter">
                                <template #option="slotProps">
                                    <div class="p-multiselect-representative-option">
                                        <img :alt="slotProps.option.name" :src="'/demo/images/avatar/' + slotProps.option.image" width="32" style="vertical-align: middle" />
                                        <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Tag :severity="getSeverity(data.status)">{{ data.status.toUpperCase() }}</Tag>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <Tag :severity="getSeverity(slotProps.value)" v-if="slotProps.value">{{ slotProps.value }} </Tag>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Tag :severity="getSeverity(slotProps.option)">{{ slotProps.option.toUpperCase() }}</Tag>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                            <div class="flex align-items-center justify-content-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <TriStateCheckbox v-model="filterModel.value" />
                        </template>
                    </Column>
                </DataTable> -->
      </div>
    </div>

    <!-- <div class="col-12">
            <div class="card">
                <h5>Frozen Columns</h5>
                <ToggleButton v-model="idFrozen" onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Unfreeze Id" offLabel="Freeze Id" style="width: 10rem" />

                <DataTable :value="customer2" :scrollable="true" scrollHeight="400px" :loading="loading2" scrollDirection="both" class="mt-3">
                    <Column field="name" header="Name" style="min-width: 200px" frozen></Column>
                    <Column field="id" header="Id" style="min-width: 100px" :frozen="idFrozen"></Column>
                    <Column field="country.name" header="Country" :style="{ width: '200px' }">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img alt="flag" src="/demo/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                                <span>{{ data.country.name }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="date" header="Date" style="min-width: 200px"></Column>
                    <Column field="company" header="Company" style="min-width: 200px"></Column>
                    <Column field="status" header="Status" style="min-width: 200px">
                        <template #body="{ data }">
                            <Tag :severity="getSeverity(data.status)">{{ data.status.toUpperCase() }}</Tag>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" style="min-width: 200px"></Column>
                    <Column field="representative.name" header="Representative" style="min-width: 200px">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                                <span>{{ data.representative.name }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="balance" header="Balance" style="min-width: 200px" frozen alignFrozen="right">
                        <template #body="{ data }">
                            <span class="text-bold">{{ formatCurrency(data.balance) }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Row Expand</h5>
                <DataTable :value="products" v-model:expandedRows="expandedRows" dataKey="id" tableStyle="min-width: 60rem">
                    <template #header>
                        <div>
                            <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2 mb-2" />
                            <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" class="mb-2" />
                        </div>
                    </template>
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image">
                        <template #body="slotProps">
                            <img :src="'/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.category) }}
                        </template></Column
                    >
                    <Column field="rating" header="Reviews" :sortable="true">
                        <template #body="slotProps">
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <h5>Orders for {{ slotProps.data.name }}</h5>
                            <DataTable :value="slotProps.data.orders">
                                <Column field="id" header="Id" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.id }}
                                    </template>
                                </Column>
                                <Column field="customer" header="Customer" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.customer }}
                                    </template>
                                </Column>
                                <Column field="date" header="Date" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date }}
                                    </template>
                                </Column>
                                <Column field="amount" header="Amount" :sortable="true">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.amount) }}
                                    </template>
                                </Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="'order-badge order-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                                    </template>
                                </Column>
                                <Column headerStyle="width:4rem">
                                    <template #body>
                                        <Button icon="pi pi-search" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <h5>Subheader Grouping</h5>
                <DataTable :value="customer3" rowGroupMode="subheader" groupRowsBy="representative.name" sortMode="single" sortField="representative.name" :sortOrder="1" scrollable scrollHeight="400px">
                    <Column field="representative.name" header="Representative"></Column>
                    <Column field="name" header="Name" style="min-width: 200px"></Column>
                    <Column field="country" header="Country" style="min-width: 200px">
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <img alt="flag" src="/demo/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                                <span>{{ data.country.name }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="company" header="Company" style="min-width: 200px"></Column>
                    <Column field="status" header="Status" style="min-width: 200px">
                        <template #body="slotProps">
                            <Tag :severity="getSeverity(slotProps.data.status)">{{ slotProps.data.status.toUpperCase() }}</Tag>
                        </template>
                    </Column>
                    <Column field="date" header="Date" style="min-width: 200px"></Column>
                    <template #groupheader="slotProps">
                        <div class="flex align-items-center gap-2">
                            <img :alt="slotProps.data.representative.name" :src="'/demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" />
                            <span>{{ slotProps.data.representative.name }}</span>
                        </div>
                    </template>
                    <template #groupfooter="slotProps">
                        <td style="text-align: right" class="text-bold pr-6">Total Customers: {{ calculateCustomerTotal(slotProps.data.representative.name) }}</td>
                    </template>
                </DataTable>
            </div>
        </div> -->
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
