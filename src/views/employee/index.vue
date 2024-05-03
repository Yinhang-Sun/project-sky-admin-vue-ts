<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px"> Employee Name: </label>
        <el-input
          v-model="name"
          placeholder="Please enter employee name"
          style="width: 15%"
        />
        <el-button type="primary" style="margin-left: 25px" @click="pageQuery()"
          >Query</el-button
        >
        <el-button type="primary" style="float: right">+Add Employee</el-button>
      </div>
      <el-table :data="records" stripe style="width: 100%">
        <el-table-column prop="name" label="Employee Name" width="180">
        </el-table-column>
        <el-table-column prop="username" label="Account" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="Phone"> </el-table-column>
        <el-table-column prop="status" label="Status">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? 'Disable' : 'Enable' }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="Last Operation">
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button type="text">Edit</el-button>
            <el-button type="text">{{
              scope.row.status === 1 ? 'Disable' : 'Enable'
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { getEmployeeList } from '@/api/employee'

export default {
  //model data
  data() {
    return {
      name: '',
      page: 1,
      pageSize: 10,
      total: 0,
      records: [],
    }
  },
  created() {
    this.pageQuery()
  },
  methods: {
    //pagination query
    pageQuery() {
      //prepare request parameters
      const params = {
        name: this.name,
        page: this.page,
        pageSize: this.pageSize,
      }
      //send Ajax request to query backend service, getting the pagination data
      getEmployeeList(params)
        .then((res) => {
          if (res.data.code === 1) {
            this.total = res.data.data.total
            this.records = res.data.data.records
          }
        })
        .catch((err) => {
          this.$message.error('Rquest error: ' + err.message)
        })
    },
    //handle pageSize change
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageQuery()
    },
    //handle page change
    handleCurrentChange(page) {
      this.page = page
      this.pageQuery()
    },
  },
}
</script>

<style lang="scss" scoped>
.disabled-text {
  color: #bac0cd !important;
}
</style>
