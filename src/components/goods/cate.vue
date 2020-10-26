<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        stripe
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color: red" class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            ref="cascaderHandle"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editCateForm"
        ref="editCateFormRef"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        //父级分类id
        cat_pid: 0,
        cat_level: 0
      },
      editCateForm: {
        cat_name: '',
        cat_id: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //父级分类列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      option: {},
      //选中的父级分类的ID数组
      selectedKeys: [],
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          //模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          //模板名称
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          //模板名称
          template: 'opt'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  mounted () {
//第二种js方法：点击文字时自动选中radio标签
  setInterval(function () {
    document.querySelectorAll('.el-cascader-node__label').forEach(el => {
      el.onclick = function () {
        if (this.previousElementSibling) this.previousElementSibling.click()
      }
    })
  }, 1000)
},
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //要先查看一下res的内容,明确要取的数据部分
      this.catelist = res.data.result
      this.total = res.data.total
    },
    //监听pagesize和pagenum改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showAddCateDialog() {
      //先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        parmas: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败')
      this.parentCateList = res.data

    },
    //级联选择器选项变化触发
    parentCateChange(){
      
      this.$refs.cascaderHandle.dropDownVisible = false;
      //如果selectedKeys数组中的length大于-,证明选中的父级分类,反之就说明没有选中
      if(this.selectedKeys.length > 0) {
        //父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
        }
        else{
          //父级分类的ID
          this.addCateForm.cat_pid = 0
          //为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
        
      },
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if(!valid) return
          const { data: res } = await this.$http.post('categories',this.addCateForm)
          if (res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.getCateList()
          
       })
       this.addCateDialogVisible = false
      },
      async showEditCateDialog(id) {
        const { data: res } = await this.$http.get('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editCateForm = res.data
        console.log(this.editCateForm)
        this.editCateDialogVisible = true
      },
      editCate() {
        this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name,
          })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editCateDialogVisible = false
        this.getCateList()
        this.$message.success(res.meta.msg)
      })
      },
      editCateDialogClosed() {
        this.$refs.editCateFormRef.resetFields()
        this.editCateForm = ''
      },
      async deleteCateById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')

        const { data:res } = await this.$http.delete('categories/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getCateList()
      },
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}



</style>
