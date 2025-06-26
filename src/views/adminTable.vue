<!--eslint-disable -->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 后台用户
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
                            name="管理员信息.xls"
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

                <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
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
                <el-table-column label="管理员Id" align="center">
                    <template slot-scope="scope">{{scope.row.suId}}</template>
                </el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                                style="width: 52px; height: 52px"
                                :src="scope.row.avatarUrl"
                                fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" align="center">
                    <template slot-scope="scope">{{scope.row.nickName}}</template>
                </el-table-column>
                <el-table-column label="用户名" align="center">
                    <template slot-scope="scope">{{scope.row.uesrName}}</template>
                </el-table-column>
                <el-table-column label="密码" align="center">
                    <template slot-scope="scope">
                        {{scope.row.password}}
                    </template>
                </el-table-column>
                <el-table-column label=类型 align="center">
                    <template slot-scope="scope">
                        {{scope.row.type=="superAdmin" ? "超级管理员" :"普通管理员"}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.state == 'true' ? 'success' : 'warning'">{{scope.row.state =="true" ?
                            "正常" : "限制登录"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-warning-outline"
                                class="red"
                                @click="handlePermissions(scope.$index, scope.row)"
                        >{{scope.row.state =="true" ? "禁用" : "启用"}}
                        </el-button>
                        <el-button
                                v-if="scope.row.type=='superAdmin'?false : true"
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
        <el-dialog title="添加" :visible.sync="addVisible" width="40%" center>
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.uesrName"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="form.nickName"></el-input>
                </el-form-item>
                <el-form-item label="身份">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload
                            ref="upload"
                            action=""
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-change="UploadImage"
                            :limit="1"
                            :file-list="fileList"
                            :auto-upload="false"
                    >
                        <i class="el-icon-plus"></i>
                        <template #tip>
                            <div style="font-size: 12px;color: #919191;">
                                单次限制上传一张图片,必须为jpg/png且大小小于5m
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" style="line-height: 0;">
            <div style="display: flex;align-items: center;justify-content: center">
                <el-image style="width: 80%;height: 80%" :src="dialogImageUrl" alt=""/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        uploadImg,
        getAdminALl,
        addAdmin,
        deleteAdmin,
        deleteAdmins,
        permissionsAdmins,
    } from "@/api/api";

    export default {
        name: 'Admintable',
        data() {
            return {
                query: {
                    time: null
                },
                addVisible: false,
                tableData: [],
                rightsList: [],//所需分页数据
                searchList:[],//数据缓存
                totalPageData: [],//分页数据
                multipleSelection: [],
                pageSize: 10, // 每页显示数量
                currentPage: 1, // 当前显示页码
                total: 0,// 总共多少条数据
                //图片上传
                fileList: [],
                dialogImageUrl: '',
                imgSrc: '',
                dialogVisible: false,
                hideUploadEdit: true, //是否隐藏上传按钮
                form: {},
                options: [
                    {
                        value: 'superAdmin',
                        label: '超级管理员'
                    }, {
                        value: 'admin',
                        label: '普通管理员'
                    },
                ],
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
                excelTitle: "管理员信息",
                json_fields: {
                    "管理员ID": "suId",
                    "用户名": "uesrname",
                    "昵称":"nickName",
                    "密码": "password",
                    "状态": "state",
                    "头像": "avatarUrl",
                    "创建时间": "createTime",
                },
            };
        },
        created() {
            this.getAdmin();
        },
        Mount: {},
        methods: {
            //获取数据
            getAdmin() {
                getAdminALl().then(res => {
                    if (res.code === 0) {
                        if (res.data !== null) {
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
            //图片上传
            UploadImage(file, filelist) {
                const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
                const isLt5M = file.size / 1024 / 1024 < 20;
                if (!isJPG) {
                    this.$message.error('图片必须为jpg/png格式')
                    filelist = []
                }
                if (!isLt5M) {
                    this.$message.error('图片大小必须小于20m')
                }
                if (isJPG && isLt5M === true) {
                    let fd = new FormData()
                    fd.append('imgFile', file.raw)
                    uploadImg(fd).then(res => {
                        if (res.code === 0) {
                            this.$message.success(res.message)
                            this.form.imgUrl = res.data
                            this.dialogImageUrl = res.data
                            console.log("res", res.data)
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            },
            //移除图片功能
            handleRemove(file, fileList) {
                console.log(file, fileList)
            },
            //预览图片功能
            handlePictureCardPreview(file) {
                this.dialogVisible = true
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
                    this.getAdmin()
                }
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
                        permissionsAdmins(data).then(res => {
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteAdmins(this.multipleSelection).then(res => {
                            if (res.code === 0) {
                                this.$message.success(res.message)
                                this.multipleSelection = [];
                                this.getAdmin()
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
            handleAdd() {
                this.addVisible = true;
            },

            saveAdd() {
                this.addVisible = false;
                let data = Object.assign({}, this.form);
                addAdmin(data).then(res => {
                    if (res.code === 0) {
                        this.$message.success(res.message)
                        this.getAdmin()
                        this.form = {}
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        deleteAdmin(row).then(res => {
                            if (res.code === 0) {
                                this.$message.success(res.message)
                                this.getAdmin()
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
