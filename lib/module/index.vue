<template>
    <div v-if="selected!=null" class="main">
        <h2 class="name" @click="handleSelect">
            {{selected.name}}卦 第{{selected.index|toChinesNum}}
        </h2>
        <div class="text">{{selected.hexagram}}</div>
        <div class="hexagram">
            <div v-for="(v,k) of value" @click="handleChange(k)" :key="k" :class="{item: true, no: v=='0'}"></div>
        </div>
        <ul class="trigram">
            <li v-for="(item, index) of selected.trigrams" :key="index">{{item}}</li>
        </ul>
        <DetailDialog v-if="isDetail" @close="isDetail=false" />
        <SelectDialog 
            v-if="isSelect" 
            :lists="lists" 
            @select="setData" 
            @close="isSelect=false" 
            :selected="selected.value"
        />
    </div>
</template>

<script>

export default {
    components: {
        DetailDialog: component("@/detail.vue"),
        SelectDialog: component("@/select.vue")
    },
    data: function(){
        return {
            lists: [],
            selected: null,
            value: [],
            isDetail: false,
            isSelect: false
        }
    },
    created: function(){
        util.getJson('./data/export/basic.json').then(res=>{
            let value=localStorage.getItem('last_hexagram')||res[0].value;
            this.lists=res;
            this.setData(value);
        });
    },
    filters: {
        toChinesNum: function(num){
            return util.toChinesNum(num);
        }
    },
    methods: {
        setData(value){
            this.value=value.split('');
            this.selected=this.lists.find(e=>e.value==value);
            localStorage.setItem('last_hexagram', value);
        },
        handleChange(index){
            let value=this.value;
            value[index]=value[index]=='1' ? '0' : '1';
            this.setData(value.join(''));
        },
        handleSelect(){
            this.isSelect=true;
        }
    }
}
</script>
