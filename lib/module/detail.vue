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
                <p v-for="(item, index) of analysis" :key="index"><b>分析{{analysis.length>1?index+1:''}}：</b>{{item}}</p>
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
        if(!this.isShow){
            this.$emit('close');
        }
    },
    computed: {
        isShow: function(){
            return this.anno.length>0 || this.trans.length>0 || this.analysis.length>0
        },
        anno: function(){
            const index=this.index;
            const content=index==-1 ?  this.detail.anno : 
                    (typeof(this.detail.trigrams[index])!='undefined' ?
                        this.detail.trigrams[index].anno : '');
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
            const content=index==-1 ? this.detail.trans : 
                (typeof(this.detail.trigrams[index])!='undefined' ? 
                    this.detail.trigrams[index].trans : '');
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
            const content=index==-1 ? this.detail.analysis : 
                (typeof(this.detail.trigrams[index])!='undefined' ? 
                    this.detail.trigrams[index].analysis: '');
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
