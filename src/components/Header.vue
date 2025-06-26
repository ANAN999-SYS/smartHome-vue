<template>
    <div class="header">
        <div class="logo">
            <img class="logoImg" src="../assets/logo.png">
            <div>HelloWorld智能家居</div>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="avatarUrl" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                username: 'test',
                avatarUrl:'../assets/mine.png',
                message: 2
            };
        },
        computed: {
            // username() {
            //     let username=JSON.parse(localStorage.getItem("UserInfo")).uesrName;
            //     return username ? username : this.name;
            // },
            // avatarUrl() {
            //     let avatarUrl=JSON.parse(localStorage.getItem("UserInfo")).avatarUrl;
            //     return avatarUrl ? avatarUrl : this.imageUrl;
            // }
        },
        created() {
            let UserInfo=JSON.parse(localStorage.getItem("UserInfo"))
            this.username=UserInfo.nickName
            this.avatarUrl=UserInfo.avatarUrl
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command === 'loginout') {
                    localStorage.removeItem('Token');
                    this.$router.push('/');
                }
            },

        },
        mounted() {

        }
    };
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
        background: linear-gradient(to bottom, #56ccf2, #2f80ed);
    }
    .header .logo {
        margin-left: 20px;
        float: left;
        width: 550px;
        max-height: 70px;
        display: flex;
        align-items: center;
    }
    .header-right {
        float: right;
        padding-right: 50px;
    }
    .header-user-con {
        display: flex;
        height: 70px;
        align-items: center;
    }
    .user-name {
        margin-left: 10px;
    }
    .user-avator {
        margin-left: 20px;
    }
    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }
    .logoImg{
        width: 42px;
        height: 42px;
        margin-right: 10px;
    }
</style>
