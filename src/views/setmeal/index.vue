<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <label style="margin-right: 5px"> Setmeal Name: </label>
        <el-input
          v-model="name"
          placeholder="Please enter setmeal name"
          style="width: 15%"
        />

        <label style="margin-right: 5px"> Setmeal Category: </label>
        <el-select v-model="categoryId" placeholder="Please choose">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <label style="margin-right: 5px"> Sale Status: </label>
        <el-select v-model="status" placeholder="Please choose">
          <el-option
            v-for="item in statusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-button type="primary" style="margin-left: 25px" @click="pageQuery()"
          >Query</el-button
        >
        <div style="float: right">
          <el-button type="danger" @click="handleDelete('b')"
            >Delete In Batches</el-button
          >
          <el-button type="info">+Add Setmeal</el-button>
        </div>
      </div>
    </div>
    <el-table
      :data="records"
      stripe
      class="tableBox"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="25" />
      <el-table-column prop="name" label="Setmeal Name" />
      <el-table-column label="Image">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 40px; border: none"
            :src="scope.row.image"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="Category" />
      <el-table-column prop="price" label="Price" />
      <el-table-column label="Status">
        <template slot-scope="scope">
          <div
            class="tableColumn-status"
            :class="{ 'stop-use': scope.row.status === 0 }"
          >
            {{ scope.row.status === 0 ? 'Off-Sale' : 'On-Sale' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="Last Operation" />
      <el-table-column label="Operation" align="center" width="250px">
        <template slot-scope="scope">
          <el-button type="text" size="small"> Edit </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleStartOrStop(scope.row)"
          >
            {{ scope.row.status == '1' ? 'Stop' : 'Start' }}
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleDelete('S', scope.row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageList"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { getCategoryByType } from '@/api/category'
import {
  getSetmealPage,
  enableOrDisableSetmeal,
  deleteSetmeal,
} from '@/api/setMeal'
import { ElSelect } from 'element-ui/types/select'

export default {
  //model data
  data() {
    return {
      name: '', //setmeal name,
      page: 1,
      pageSize: 10,
      total: 0,
      records: [],
      options: [],
      categoryId: '',
      statusArr: [
        {
          value: '0',
          label: 'Off-Sale',
        },
        {
          value: '1',
          label: 'On-Sale',
        },
      ],
      status: '', //sale status
      multipleSelection: '', //multiple elements selected in current form
    }
  },
  created() {
    getCategoryByType({ type: 2 }).then((res) => {
      if (res.data.code === 1) {
        this.options = res.data.data
      }
    })

    this.pageQuery()
  },
  methods: {
    //pagination query
    pageQuery() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.name,
        status: this.status,
        categoryId: this.categoryId,
      }
      getSetmealPage(params).then((res) => {
        if (res.data.code === 1) {
          this.total = res.data.data.total
          this.records = res.data.data.records
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageQuery()
    },
    handleCurrentChange(page) {
      this.page = page
      this.pageQuery()
    },
    handleStartOrStop(row) {
      const p = {
        id: row.id,
        status: !row.status ? 1 : 0,
      }

      this.$confirm(
        'Confirm to adjust the sales status of the current setmeal, do you want to continue?',
        'Prompt',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        enableOrDisableSetmeal(p).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('Modified the sale status successfully!')
            this.pageQuery()
          }
        })
      })
    },
    handleDelete(type: string, id: string) {
      this.$confirm(
        'Confirm to delete current setmeal, do you want to continue?',
        'Prompt',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        let param = ''
        if (type === 'b') {
          //delete in batches
          const arr = new Array()
          this.multipleSelection.forEach((element) => {
            //1, 2, 3
            arr.push(element.id)
          })
          param = arr.join(',')
        } else {
          //single delete
          param = id
        }
        deleteSetmeal(param).then((res) => {
          if (res.data.code === 1) {
            this.$message.success('Deleted Successfully!')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  },
}
</script>
<style lang="scss">
.el-table-column--selection .cell {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .container {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 30px 28px;
      border-radius: 4px;

      .tableBar {
        margin-bottom: 20px;
        .tableLab {
          float: right;
          span {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            padding: 0 20px;
            color: $gray-2;
          }
        }
      }

      .tableBox {
        width: 100%;
        border: 1px solid $gray-5;
        border-bottom: 0;
      }

      .pageList {
        text-align: center;
        margin-top: 30px;
      }
      //查询黑色按钮样式
      .normal-btn {
        background: #333333;
        color: white;
        margin-left: 20px;
      }
    }
  }
}
</style>
