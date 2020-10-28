<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="95px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column  width="70px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column  width="160px" label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column  width="130px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary"  icon="el-icon-edit" size="mini"
              v-model="scope.row.data" ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="deleteGoodsById(scope.row.goods_id)" ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
</div>
  
</template>

<script>
export default {
 data() {
    return{
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0,
      editForm: {

      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格(元)', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1到10个字符',type:Number, trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1到10个字符',type:Number, trigger: 'blur' }
        ],
        add_time: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      },


    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
   
    async deleteGoodsById(id) {
       const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败')
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
        //用新标准重新获取
        this.getGoodsList()
    },
    handleCurrentChange(newpage) {
       this.queryInfo.pagenum = newpage
        this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
 }

}
</script>

<style lang="less" scoped>
.el-table{
  font-size: 13px;
}
</style>