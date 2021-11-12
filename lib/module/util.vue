<template>
    <ul class="util">
        <li @click="handleRandom"><img src="images/random.png"/></li>
        <li @click="handleSwitch"><img src="images/switch.png"/></li>
        <li @click="handleReverse"><img src="images/reverse.png"/></li>
        <li @click="handleUp"><img src="images/up.png"/></li>
        <li @click="handleDown"><img src="images/down.png"/></li>
    </ul>
</template>

<script>
export default {
    props: ['value'],
    data: function(){
        return {
            select: this.value
        }
    },
    watch: {
        value(val){
            this.select=val;
        }
    },
    methods: {
        setValue(value){
            this.select=value;
            this.$emit('change', value);
        },
        handleRandom(){
            const date=new Date();
            let random=date.getMilliseconds()%63;
            let values=[];
            for (let i = 0; i < 6; i++) {
                values.unshift((random&(1<<i))?'1':'0');
            }
            this.setValue(values.join(''));
        },
        handleSwitch(){
           let value1=this.select.substr(0,3);
           let value2=this.select.substr(3,3);
           this.setValue(value2+value1);
        },
        handleReverse(){
            let values=this.select.split('');
            let nValue=values.map(e=>e=='1'?'0':'1');
            this.setValue(nValue.join(''));
        },
        handleUp(){
            let values=this.select.split('');
            let nValue=values.map((e,i)=>(i+1<6 ? values[i+1] : values[0]));
            this.setValue(nValue.join(''));
        },
        handleDown(){
            let values=this.select.split('');
            let nValue=values.map((e,i)=>(i-1>=0 ? values[i-1] : values[5]));
            this.setValue(nValue.join(''));
        }
    }
}
</script>