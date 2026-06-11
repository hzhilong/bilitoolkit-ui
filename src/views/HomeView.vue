<script setup lang="ts">
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<style lang="scss">
body {
  background: var(--app-bg-color-page) !important;
  padding: 100px !important;
}
.options {
  position: absolute;
  right: 0;
  top: 0;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  > i {
    width: 28px;
    height: 28px;
    padding: 5px 4px 3px 4px;
    font-size: 20px;
    cursor: pointer;
    box-sizing: border-box;
    transition: background 0.3s ease;

    &:hover {
      background: var(--app-color-primary-transparent-15);
    }
  }
}
</style>
