<template>
    <div class="draggable-box" :style="{ top: posY + 'px', left: posX + 'px' }" @mousedown="startDrag">
        <div class="btn-box" v-for="item in bList" :key="item.url">
            <el-tooltip class="item" effect="dark" :content="item.title" placement="left-start">
                <el-button style="width: 50px;height: 50px;" type="primary" :icon="item.icon" circle @click="toUrl(item.url)"></el-button>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    import {saveUserInfo} from "@/api/api";

    export default {
        name:"DraggableBox",
        props: {
            initialX: {
                type: Number,
                default:()=> 0,
            },
            initialY: {
                type: Number,
                default: ()=>0,
            },
            bList:{
                type:Array,
                default:()=>[],
            }
        },
        data() {
            return {
                dragging: false, // 是否处于拖拽状态
                posX: 0, // 盒子的横坐标
                posY: 0, // 盒子的纵坐标
                startX: 0, // 鼠标按下时的横坐标
                startY: 0, // 鼠标按下时的纵坐标
                btnList:[],
            };
        },
        created() {
            this.posX = this.initialX; // 设置盒子的初始横坐标为props传递的值
            this.posY = this.initialY; // 设置盒子的初始纵坐标为props传递的值
            this.btnList=this.bList;
        },
        inject:["reload"],
        methods: {
            startDrag(event) {
                event.preventDefault();
                this.dragging = true;
                this.startX = event.clientX; // 记录鼠标按下时的横坐标
                this.startY = event.clientY; // 记录鼠标按下时的纵坐标
                document.addEventListener("mousemove", this.handleDrag);
                document.addEventListener("mouseup", this.stopDrag);
            },
            handleDrag(event) {
                if (this.dragging) {
                    const offsetX = event.clientX - this.startX; // 计算鼠标移动的横向距离
                    const offsetY = event.clientY - this.startY; // 计算鼠标移动的纵向距离
                    this.posX += offsetX; // 更新盒子的横坐标
                    this.posY += offsetY; // 更新盒子的纵坐标
                    this.startX = event.clientX; // 更新鼠标按下时的横坐标
                    this.startY = event.clientY; // 更新鼠标按下时的纵坐标
                }
            },
            stopDrag() {
                this.dragging = false;
                document.removeEventListener("mousemove", this.handleDrag);
                document.removeEventListener("mouseup", this.stopDrag);
            },
            toUrl(url){
               if (url){
                   console.log(url)
                   saveUserInfo().then(res=>{
                       console.log(res)
                   })
                   if(this.$route.path !== url){
                       this.$router.push(url);
                   }else{
                       this.reload();
                   }
               }
            }
        },
    };
</script>

<style scoped>
    .draggable-box {
        position: absolute;
        cursor: move;
    }
    .btn-box{
        margin-bottom: 10px;
    }
</style>
