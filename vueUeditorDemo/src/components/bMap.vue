<template>
    <div id="containerLoc">
        
    </div>
</template>

<script>
import BMap from 'BMap';
export default {
    name:"bMap",
    props:{
        longitude:{
            require:false,
            type:Number,
            default:116.404
        },
        latitude:{
            require:false,
            type:Number,
            default:39.915
        },
        scale:{
            require:false,
            type:Number,
            default:13
        }
    },
    data(){
        return {

        }
    },
    computed:{

    },
    methods:{
        initMap () {
            const map = new BMap.Map('containerLoc')    // 创建Map实例
            let point = new BMap.Point(this.longitude, this.latitude) // 初始化地图
            map.centerAndZoom(point, this.scale)    //设置中心点和缩放级别
            let myIcon = new BMap.Icon(require("../assets/map_center.png"), new BMap.Size(300,300),{anchor: new BMap.Size(4, 2)});//自定义图标
            let marker = new BMap.Marker(point,{icon:myIcon})  // 创建标注
            map.addOverlay(marker)              // 将标注添加到地图中
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            let circle = new BMap.Circle(point,1200,{fillColor:"#004CC8",fillOpacity:"0.2",strokeColor:"#004CC8", strokeWeight:"1", strokeOpacity:"0.2"});
            map.addOverlay(circle);            //增加圆
            let geoc = new BMap.Geocoder();     //创建地址解析实例
            let positionImg = require("../assets/map_position.png");
            geoc.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                var sContent = '<div class="map-tip-wrp">'+
                            '<div class="map-left">'+
                            '<img src="'+positionImg+'" alt="mapimg" id="imgDemo">'+
                            '</div>'+
                            '<div class="map-middle">'+
                            '<p>'+addComp.city+'</p>'+
                            '<p>'+addComp.district+addComp.street+addComp.streetNumber+'</p>'+
                            '</div>'+
                            '<div class="map-right">地域</div>'+
                            '</div>';
                var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                marker.openInfoWindow(infoWindow);
            });  
        }
    },
    created(){

    },
    mounted(){
        this.initMap();
    }
}
</script>

<style scoped>
    #containerLoc{
        width:100%;
        height:100%;
        background-color: cadetblue;
    }
    
</style>

    

