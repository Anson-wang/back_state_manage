<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="">
      </div>
      <!-- 登录表单区域 :rules绑定表单的验证规则,ref获取表单实例对象-->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <!-- prefix-icon放前面，suffix-icon放后面 -->
          <el-input v-model="loginForm.username" prefix-icon='iconfont icon-user'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon='iconfont icon-mima' type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //表单验证规则
      loginFormRules: {
        username: [
          //必选项，提示信息，触发方式
          { required: true, message: "请输入用户名", trigger: "blur"},
          {min: 3, max: 10, message:"长度在3到10个字符", trigger: "blur"}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 15, message:"长度在6到15个字符", trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      //console.log(this)
      //$refs拿到实例对象，调用resetFields重置表单
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        //{data: res} 解构等号后面的对象，取出data属性值重命名为res
        const {data : res} = await this.$http.post('login',this.loginForm)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg);
        // sessionStorage用来存token，用于保存用户的登录状态
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push('/home')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height:300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  //左上角
  left: 50%;
  top: 50%;
  //自身50%
  transform: translate(-50%, -50%);
  
}
.avatar_box{
  height: 130px;
  width: 130px;
  border-radius: 50%;
  text-align: center;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform: translate(-50%, -50%);
  background-color: rgb(18, 160, 153);
  img{
    width: 100%;
    height: 100%;
    border-radius:50%;
  }
}
.login_form{
  position:absolute;
  bottom:0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}

</style>