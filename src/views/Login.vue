<template>
       <body id="poster">
       <div class="LoginBox">
           <div class="LoginBoxLeft"></div>
           <div class="LoginBoxcenter">
               <div class="logoTitle">欢迎进入</div>
               <div class="logoTip">HelloWorld智能家居后台管理系统</div>
               <div class="logoBox">
                   <img class="logo" src="../assets/logo.png" alt="Logo">
               </div>
           </div>
           <div class="LoginBoxRight">
              <div class="loginBox">
                  <el-form :model="loginForm" class="login-container" label-position="left" label-width="0px" ref="loginForm"
                           :rules="loginRules">
                      <h2 class="login_title">登录</h2>
                      <el-form-item prop="uesrName">
                          <el-input prefix-icon="el-icon-user" type="text" v-model="loginForm.uesrName" auto-complete="off"
                                    placeholder="账号"></el-input>
                      </el-form-item>
                      <el-form-item prop="password">
                          <el-input prefix-icon="el-icon-unlock" type="password" v-model="loginForm.password" auto-complete="off"
                                    placeholder="密码" show-password></el-input>
                      </el-form-item>
                      <el-form-item style="width: 100%">
                          <el-button type="primary" style="width: 100%;border: none" @click="login('loginForm')">登录</el-button>
                      </el-form-item>
                  </el-form>
              </div>
           </div>
       </div>
       </body>
</template>

<script>
    import {userLogin} from "@/api/api";
    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    uesrName: '',
                    password: ''
                },
                loginRules: {
                    uesrName: [
                        {required: true, message: "请输入用户名", trigger: 'blur'},

                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
            login(loginForm) {
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {
                        userLogin(this.loginForm).then(res=>{
                            if (res.code===0) {
                                this.$notify({
                                    title: '登录成功',
                                    type: 'success'
                                });
                                localStorage.setItem("Token",res.data.token)
                                localStorage.setItem("UserInfo",JSON.stringify(res.data.admin))
                                this.$router.push({
                                    path: '/dashboard'
                                })
                            } else {
                                this.$notify.error({
                                    title: '登录失败',
                                    message:res.message,
                                });
                            }
                        })
                    } else {
                        this.$notify({
                            title: '请填写完整信息',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    #poster {
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
        /*background-image:linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);*/
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../assets/test.jpg');
    }

    body {
        margin: 0px;
        padding: 0;
    }
    .LoginBox{
        width: 50vw;
        height: 65vh;
        background-clip: content-box;
        margin:auto;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
    }
    .LoginBoxLeft{
        flex: 0.4;
        background-color: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(1.5px);
        -webkit-backdrop-filter: blur(1.5px);
        border: 0.8px solid rgba(255, 255, 255, 0.18);
        box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
        -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
        color: rgba(255, 255, 255, 0.6);
    }
    .LoginBoxcenter{
        flex: 2.5;
        /*background: #409eff;*/
        background: linear-gradient(to bottom, #56ccf2, #2f80ed);
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .logoTitle{
        font-size: 26px;
        color: white;
        margin-top: 80px;
        margin-bottom: 20px;
    }
    .logoTip{
        font-size: 18px;
        color: white;
        margin-bottom: 40px;
    }
    .logoBox{
        height: 96px;
        width: 96px;
        border-radius: 50%;
        overflow: hidden;
        background: #ffffff;
    }
    .logo{
        height: 96px;
        width: 96px;
    }
    .LoginBoxRight{
        flex: 3;
        background-color: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(1.5px);
        -webkit-backdrop-filter: blur(1.5px);
        border: 0.8px solid rgba(255, 255, 255, 0.18);
        box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
        -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
        color: rgba(255, 255, 255, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .loginBox{
        width: 370px;
    }
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 90px auto;
        padding: 35px 35px 15px 35px;
    }

    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #2f80ed;
    }


</style>
