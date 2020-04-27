<template>
    <div>
        <table>
            <tr>
                <td>编号</td>
                <td>IPv6</td>
                <td>传感器</td>
            </tr>
            <tr v-for="item in STM32s">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.ip}}</td>
            </tr>

        </table>
        {{msg}}
    </div>
</template>

<script>
    export default {
        name: "STM32s",
        data(){
            return{
                msg:'Hello Vue',
                STM32s:[]
            }
        },
        created() {
            alert("qwqwqwqw");
            const _this = this;
            axios.get('http://localhost:8181/querySTM32List').then(
                function (resp) {
                    console.log(resp);
                    _this.STM32s = resp.data;
                }
            )
        }
    }
</script>

<style scoped>

</style>