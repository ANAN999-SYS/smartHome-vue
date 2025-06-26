<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="mr10">
                    <download-excel
                            class="download-excel"
                            :data="rightsList"
                            :fields="json_fields"
                            :header="excelTitle"
                            name="设备信息.xls"
                    >
                        <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
                        <el-button type="primary" icon="el-icon-download">导出excel</el-button>
                    </download-excel>
                </div>
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
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
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column label="编号" align="center" type="index" :index="hIndex" :width="50">
                </el-table-column>
                <el-table-column label="设备Id" align="center">
                    <template slot-scope="scope">{{scope.row.deId}}</template>
                </el-table-column>
                <el-table-column label="设备名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="图标" align="center">
                    <template slot-scope="scope">
                        <img class="image" :src="require(`../assets/device/${scope.row.iconId}.png` )"/>
                    </template>
                </el-table-column>
                <el-table-column label="所属房间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.roomName}}
                    </template>
                </el-table-column>
                <el-table-column label="订阅主题" align="center">
                    <template slot-scope="scope">
                        {{scope.row.topic}}
                    </template>
                </el-table-column>
                <el-table-column label="作者" align="center">
                    <template slot-scope="scope">
                        {{scope.row.nickName}}
                    </template>
                </el-table-column>
                <el-table-column label="同步状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state == 'true' ? 'success' : 'warning'">{{scope.row.state =="true" ?
                            "已同步" : "未同步"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.updateTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
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
    import {getDevicesAll, deleteDevice, deleteDevices} from "@/api/api";

    export default {
        name: 'deviceTable',
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
                total: 1,// 总共多少条数据
                //excel配置
                excelTitle: "设备信息",
                json_fields: {
                    "设备ID": "deId",
                    "设备名称": "name",
                    "设备类型": "iconId",
                    "所属房间": "roomName",
                    "订阅主题": "topic",
                    "作者ID": "author",
                    "作者": "nickName",
                    "同步状态": "state",
                    "创建时间": "createTime",
                    "更新时间": "updateTime"
                },
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
            };
        },
        created() {
            this.getDevice();
        },
        Mount: {},
        methods: {
            getDevice() {
                getDevicesAll().then(res => {
                    console.log(res)
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
                });
            },
            hIndex(index) {
                return index + 1 + (this.currentPage - 1) * this.pageSize
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
                    this.getDevice()
                }
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                this.$confirm('确定要删除所选数据吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteDevices(this.multipleSelection).then(res => {
                            if (res.code === 0) {
                                this.$message.success(res.message)
                                this.multipleSelection = [];
                                this.getDevice()
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch(error=>{
                            console.log(error)
                        })
                    })
                    .catch(error=>{
                        console.log(error)
                    })
            },
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteDevice(row).then(res => {
                            if (res.code === 0) {
                                this.$message.success(res.message)
                                this.getDevice()
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch(error=>{
                            console.log(error)
                        })
                    }).catch(error=>{
                    console.log(error)
                })
            },
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

    .download-excel {
        display: inline-block;
        margin-right: 15px;
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

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .image {
        width: 48px;
        height: 48px;
    }
</style>
