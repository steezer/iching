<template>
    <div class="dialog" @click="$emit('close')">
        <div class="body detail">
            <div v-if="trans.length" class="trans">
                <p v-for="(item, index) of trans" :key="index"><b>译文：</b>{{item}}</p>
            </div>
            <div v-if="anno.length" class="anno">
                <p v-for="(item, index) of anno" :key="index"><b>注释：</b>{{item}}</p>
            </div>
            <div v-if="analysis.length" class="analysis">
                <p v-for="(item, index) of analysis" :key="index"><b>分析{{index+1}}：</b>{{item}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['index', 'detail'],
    data: function(){
        return {
            name: ''
        };
    },
    created: function(){
        console.log(this.anno);
    },
    computed: {
        anno: function(){
            const index=this.index;
            const content=index==-1 ? this.detail.anno : this.detail.trigrams[index].anno;
            if(content instanceof Array){
                return content;
            }
            if(content!==''){
                return [content];
            }
            return [];
        },
        trans: function(){
            const index=this.index;
            const content=index==-1 ? this.detail.trans : this.detail.trigrams[index].trans;
            if(content instanceof Array){
                return content;
            }
            if(content!==''){
                return [content];
            }
            return [];
        },
        analysis: function(){
            const index=this.index;
            const content=index==-1 ? this.detail.analysis : this.detail.trigrams[index].analysis;
            if(content instanceof Array){
                return content;
            }
            if(content!==''){
                return [content];
            }
            return [];
        }
    }
}
</script>
