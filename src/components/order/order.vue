<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
          </el-col>
        </el-row>
        <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="70px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="70px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="180px">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- tooltip设置按钮鼠标衣服提示框，placement位置，enterable是否可以移入 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                v-model="scope.row.data"
                @click="showEditVisible(scope.row.id)"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressVisible"
              ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页效果 -->
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
    <!-- 修改地址 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item placeholder="请选择" label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="{expandTrigger: 'hover'}"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editOrder">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 物流地址 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
      
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
       queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示数据个数
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      editDialogVisible: false,
      progressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {required: true,message:'请选择省市区/县',trigger: 'blur'},
        ],
        address2: [
          {required: true,message:'请填写详细地址',trigger: 'blur'},
        ]
      },
      cityData,
      progressInfo: [],
      reverse: false,
        activities: [{
          content: '快递已签收,风里来雨里去,顺丰小哥最迅速,感谢使用顺丰快递,',
          timestamp: '2018-04-15'
        }, {
          content: '快递已到达双流配送站,准备配送',
          timestamp: '2018-04-14'
        },
        {
          content: '快递到达成都航空部',
          timestamp: '2018-04-13'
        }, {
          content: '快递已揽件,准备发往深圳转运中心',
          timestamp: '2018-04-11'
        }]

    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderlist = res.data.goods
      console.log(this.orderlist)
      this.total = res.data.total
    },
   
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
        //用新标准重新获取
        this.getOrderList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
        //用新标准重新获取
        this.getOrderList()
    },
    showEditVisible() {
      this.editDialogVisible = true
    },
    editOrder() {

    },
    editDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressVisible() {
      // const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      // if(res.meta.status !==200) return this.$message.error(res.meta.msg)
      // this.progressInfo = res.data
      this.progressDialogVisible = true
    }
  }

}
</script>

<style lang="less" scoped>
.el-cascader{
  width:100%;
}
</style>