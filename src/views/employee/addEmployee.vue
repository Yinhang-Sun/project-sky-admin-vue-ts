<template>
  <div class="addBrand-container">
    <div class="container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Employee Name" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="Sex" prop="sex">
            <el-radio v-model="ruleForm.sex" label="1">Male</el-radio>
            <el-radio v-model="ruleForm.sex" label="2">Female</el-radio>
        </el-form-item>
        <el-form-item label="Id Number" prop="idNumber">
          <el-input v-model="ruleForm.idNumber"></el-input>
        </el-form-item>
        <div class="subBox">
          <el-button type="primary" @click="submitForm('ruleForm',false)">Save</el-button>
          <el-button 
            v-if="this.optType === 'add'" 
            type="primary" 
            @click="submitForm('ruleForm',true)">Save And Continue
          </el-button>
          <el-button @click="() => this.$router.push('/employee')">Return</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {addEmployee} from '@/api/employee'

export default {
  data() {
    return {
      optType: 'add', 
      ruleForm: {
        name: '', 
        username: '', 
        sex: '1', 
        phone: '', 
        idNumber: ''
      }, 
      rules: {
        name: [
            { required: true, message: 'Please enter employee name', trigger: 'blur' }
        ],
        username: [
            { required: true, message: 'Please enter employee username', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if(value === '' || (!/^1(3|4|5|6|7|8)\d{9}$/.test(value))){
              callback(new Error('Please enter a correct phone number!'))
            } else {
              callback()
            }
          }}
        ], 
        idNumber: [
          { required: true, trigger: 'blur', validator: (rule, value, callback) => {
            if(value === '' || (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(x|X)$)/.test(value))){
              callback(new Error('Please enter a correct id number!'))
            } else {
              callback()
            }
          }}
        ]
      }
    }
  }, 
  methods: {
    submitForm(formName, isContinue) {
      //check the form valid or not 
      this.$refs[formName].validate((valid) => {
        if(valid) {
          //send ajax request to submit data to backend 
          addEmployee(this.ruleForm).then((res) => {
            if(res.data.code === 1) {
              this.$message.success('Added Employee Successfully!')
              if(isContinue) {
                this.ruleForm = {
                  name: '', 
                  username: '', 
                  sex: '1', 
                  phone: '', 
                  idNumber: ''
                }
              } else {
                this.$router.push('/employee')
              }
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 30px;
    .HeadLable {
      background-color: transparent;
      margin-bottom: 0px;
      padding-left: 0px;
    }
    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }
    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
  }
}
</style>
