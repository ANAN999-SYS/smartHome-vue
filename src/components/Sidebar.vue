<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#ffffff"
                text-color="#666666"
                active-text-color="#409eff"
                active-color="#56ccf2"
                unique-opened
                router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                    v-if="subItem.subs"
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.subs"
                                        :key="i"
                                        :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" >
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import { Icon } from 'tdesign-icons-vue';
    export default {
        components: {
            Icon,
        },
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-pie-chart',
                        index: 'dashboard',
                        title: ' 数据总览',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'deviceTable',
                        title: ' 设备信息',
                    },
                    {
                        icon: 'el-icon-help',
                        index: 'scensTable',
                        title: ' 情景信息',
                    },
                    {
                        icon: 'el-icon-office-building',
                        index: 'roomTable',
                        title: ' 房间信息',
                    },
                    {
                        icon: 'el-icon-edit-outline',
                        index: 'recordTable',
                        title: ' 操作记录',
                    },
                    {
                        icon: 'el-icon-notebook-2',
                        index: 'feedbackTable',
                        title: ' 用户反馈',
                    },
                    {
                        icon: 'el-icon-user',
                        index: 'userTable',
                        title: ' 微信用户',
                    },
                ]
            };
        },
        created() {
            this.isSuperAdmin()
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        methods:{
            isSuperAdmin(){
                let userInfo=JSON.parse(localStorage.getItem("UserInfo"))
                if (userInfo.type == "superAdmin"){
                    this.items.push( {
                        icon: 'el-icon-user',
                        index: 'adminTable',
                        title: ' 后台用户',
                    },)
                }
            }
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
        z-index: 3;
    }
    .sidebar::-webkit-scrollbar {
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
        font-weight: bold;
    }
    .sidebar > ul {
        height: 100%;
    }
</style>
