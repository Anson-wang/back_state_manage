<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/hua.jpg" alt="" />
        <span>老王后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 unique-opened为只允许一个栏打开，collapse为折叠,router开启路由模式-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 menulist中获取菜单信息动态绑定，index只能传入字符串，所以item.id加一个空字符串转为字符串-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + children.path"
              v-for="children in item.children"
              :key="children.id"
              @click="saveNavState('/' + children.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ children.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-yonghuguanli',
        '103': 'iconfont icon-permission',
        '101': 'iconfont icon-shangpingouwudai',
        '102': 'iconfont icon-icon-',
        '145': 'iconfont icon-xitongguanli'
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: ''
    }
  },
  //创建时调用
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.menulist = res.data
    },
    //菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
    
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  width: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 22px;
  div {
    height: 60px;
    display: flex;
    align-items: center;
    img {
      height: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 20px;
      font-weight: bold;
    }
  }
}
.el-aside {
  background-color: #333744;
  transition: width 0.5s;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  font-size: 20px;
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  // 鼠标移入变成小手形状
  cursor: pointer;
}
</style>
