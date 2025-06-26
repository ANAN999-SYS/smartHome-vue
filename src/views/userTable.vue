<!--eslint-disable -->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 微信用户
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box"
            >
                <div class="mr10">
                    <download-excel
                            class="download-excel"
                            :data="rightsList"
                            :fields="json_fields"
                            :header="excelTitle"
                            name="用户信息.xls"
                    >
                        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
                        <el-button type="primary" icon="el-icon-download">导出excel</el-button>
                    </download-excel>
                </div>
                <el-date-picker
                        style="margin-right: 15px;margin-left: 10px"
                        v-model="query.time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="timestamp"
                        @change="Search"
                >
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column label="编号" align="center" type="index" :index="hIndex" :width="50">
                </el-table-column>
                <el-table-column label="用户Id" align="center">
                    <template slot-scope="scope">{{scope.row.openId}}</template>
                </el-table-column>
                <el-table-column label="昵称" align="center">
                    <template slot-scope="scope">{{scope.row.nickName}}</template>
                </el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                                style="width: 52px; height: 52px"
                                :src="scope.row.avatarUrl"
                                fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="设备密钥" align="center">
                    <template slot-scope="scope">{{scope.row.secretKey}}</template>
                </el-table-column>

                <el-table-column label="用户状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state == 'true' ? 'success' : 'warning'">{{scope.row.state =="true" ? "正常" : "限制登录"}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="巴法云密钥" align="center">
                    <template slot-scope="scope">
                        {{scope.row.bafaKey}}
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-warning-outline"
                                :class="scope.row.state =='true' ? 'red' : 'blue'"
                                @click="handlePermissions(scope.$index, scope.row)"
                        >{{scope.row.state =="true" ? "禁用" : "启用"}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 25, 30]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getUserAll, editPermissions
    } from "@/api/api";

    export default {
        name: 'userTable',
        data() {
            return {
                query: {
                    time: null
                },
                tableData: [],
                rightsList: [],//所需分页数据
                searchList:[],//数据缓存
                totalPageData: [],//分页数据
                multipleSelection: [],
                pageSize: 10, // 每页显示数量
                currentPage: 1, // 当前显示页码
                total: 0,// 总共多少条数据
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                //excel配置
                excelTitle: "用户信息",
                json_fields: {
                    "用户Id":"openId",
                    "用户昵称":"nickName" ,
                    "设备密钥":"secretKey",
                    "用户状态":"state",
                    "巴法云密钥":"bafaKey",
                    "注册时间":"createTime"
                },
            };
        },
        created() {
            this.getUser();
        },
        Mount: {},
        methods: {
            //获取数据
            getUser() {
                getUserAll().then(res => {
                    if (res.code === 0) {
                        if (res.data !== null&&res.data.length!==0) {
                            this.rightsList = res.data;
                            this.searchList = res.data;
                            this.total = res.data.length
                            this.calcPageData()
                        }
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            hIndex(index) {
                return index + 1 + (this.currentPage - 1) * this.pageSize
            },
            handlePermissions(index,row){
                let data={...row}
                let tips=''
                if(data.state==='true'){
                    tips='确定要限制该用户登录？'
                    data.state='false'
                }
                else if(data.state==='false'){
                    tips='确定要解除该用户登录限制？'
                    data.state='true'
                }
                this.$confirm(tips, '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        editPermissions(data).then(res => {
                            if (res.code === 0) {
                                this.$message.success(res.message)
                                this.getUser()
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch(error=>{
                            console.log(error)
                        })
                    })
                    .catch(() => {
                    });
            },
            // 触发搜索按钮
            handleSearch() {
                if (this.query.time !== null) {
                    let start = this.query.time[0]
                    let end = this.query.time[1]
                    this.rightsList = this.searchList.map(obj => {
                        let createTime = new Date(obj.createTime).getTime()
                        if (createTime >= start && createTime <= end) {
                            return obj
                        } else return null
                    }).filter(obj => obj !== null);
                    this.calcPageData()
                } else {
                    this.$message.error("请选择时间")
                }
            },
            Search() {
                if (!this.query.time) {
                    this.getUser()
                }
            },
            //分页
            handleSizeChange(newPageSize) {
                this.pageSize = newPageSize;
                // 重新计算页数并分组
                this.calcPageData();
            },
            // 当前页码发生变化
            handleCurrentChange(newPageNum) {
                this.currentPage = newPageNum;
                this.tableData = this.totalPageData[newPageNum - 1];
            },
            //数据分页
            calcPageData() {
                // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
                if (this.rightsList.length >= 1) {
                    this.pageNum = Math.ceil(this.rightsList.length / this.pageSize) || 1;
                }
                // 数据分组
                for (let i = 0; i < this.pageNum; i++) {
                    // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
                    // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
                    this.totalPageData[i] = this.rightsList.slice(this.pageSize * i, this.pageSize * (i + 1));
                }
                // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
                this.tableData = this.totalPageData[this.currentPage - 1];
            },
        },

    };
</script>

<style>
    .handle-box {
        margin-bottom: 20px;
        display: flex;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }


</style>
