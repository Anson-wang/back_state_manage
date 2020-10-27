<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择商品分类的级联 -->
          <el-cascader
            v-model="selectedKeys"
            :options="catelist"
            :props="cateProps"
            @change="cateChange"
            ref="cateRef"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- <el-button :disabled="isBtnDisabled" type="primary" size="mini">添加参数</el-button> -->
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- <el-button :disabled="isBtnDisabled" type="primary" size="mini">添加属性</el-button> -->
        </el-tab-pane>
      </el-tabs>
      <el-row>
        <el-col>
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="showAddDialog"
            >{{ dataBind.btnName }}</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="dataBind.data" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-col closable>
              <span v-if="isStart(scope.row.attr_vals) == 1">
                <el-tag
                  class="vlas_tag"
                  v-for="(item, value) in scope.row.attr_vals.split(/ |\,/)"
                  :key="value"
                  closable
                  @close="removeVals(item, scope.row, value)"
                >
                  {{ item }}
                </el-tag>
              </span>
              <el-input
                class="input-new-tag"
                v-if="inputVisible == scope.row.attr_id"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
               
                @blur="handleInputConfirm(scope.row)"
                @keyup.enter.native="$event.target.blur"
              >
                <!-- @keyup.enter.native="handleInputConfirm(scope.row)" -->
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row.attr_id)"
                >+ New Tag</el-button
              >
            </el-col>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          :label="dataBind.label"
          prop="attr_name"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.attr_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteAttr(scope.row.attr_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加参数/属性对话框 -->
    <el-dialog
      :title="dataBind.btnName"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        label-width="100px"
        :rules="addFormRules"
      >
        <el-form-item :label="dataBind.label" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框 -->
    <el-dialog
      :title="dataBind.btnName"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="100px"
        :rules="addFormRules"
      >
        <el-form-item :label="dataBind.label" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '此项不能为空', trigger: 'blur' }
        ]
      },
      inputVisible: 0,
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //按钮禁用
    isBtnDisabled() {
      if (this.selectedKeys.length === 0) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedKeys.length === 0) return null
      return this.selectedKeys[this.selectedKeys.length - 1]
    },
    dataBind() {
      if (this.activeName === 'many') {
        return {
          data: this.manyTableData,
          label: '参数名称',
          btnName: '添加参数'
        }
      } else {
        return {
          data: this.onlyTableData,
          label: '属性名称',
          btnName: '添加属性'
        }
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catelist = res.data
    },
    isStart(str) {
      if (str.match(/^[ ]*$/)) {
        return 0
      }
      return 1
    },

    async cateChange() {
      this.getParamsData()
    },
    // tab页签点击
    handleTabClick() {
      if (this.selectedKeys.length !== 0) {
        this.getParamsData()
      }
    },
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm = {}
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    addAttr() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: ''
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
      })
    },
    editAttr() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: ''
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async deleteAttr(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    getResult(res) {
      // console.log(res)
    },
    showInput(id) {
      this.inputVisible = id
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    async handleInputConfirm(cate) {
      let inputValue = this.inputValue
      inputValue = inputValue.replace(/ /g,'')
      if (this.isStart(inputValue) == 1) {
        let vals = cate.attr_vals
        if (this.isStart(vals) == 1) {
          vals = vals + ' ' + inputValue
        } else {
          vals += inputValue
        }

        const { data: res } = await this.$http.put(
          `categories/${cate.cat_id}/attributes/${cate.attr_id}`,
          {
            attr_name: cate.attr_name,
            attr_sel: this.activeName,
            attr_vals: vals
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)

        cate.attr_vals = res.data.attr_vals
        this.inputVisible = 0
        this.inputValue = ''
      }
      else {
        this.inputValue = ''
        this.inputVisible = 0
      }
    },
    async removeVals(del, all, num) {
      let vals = all.attr_vals
      vals = vals.replace(',', ' ')
      if (num === 0) {
        if (all.attr_vals == del) {
          vals = vals.replace(del, '')
        } else {
          vals = vals.replace(del + ' ', '')
        }
      } else {
        vals = vals.replace(' ' + del, '')
      }
      // vals = vals.replace(/ /g,',')

      const { data: res } = await this.$http.put(
        `categories/${all.cat_id}/attributes/${all.attr_id}`,
        {
          attr_name: all.attr_name,
          attr_sel: this.activeName,
          attr_vals: vals
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)

      all.attr_vals = res.data.attr_vals
      // this.getParamsData()
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 250px;
}
.vlas_tag {
  margin-right: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>