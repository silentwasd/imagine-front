<script setup lang="ts">
import type TagResource from "~/resources/TagResource";

const props = defineProps<{
    tag: TagResource
}>();

const tags = defineModel<TagResource[]>({default: () => []});

const hasTag = computed<boolean>(() => !!tags.value.find(tag => props.tag.id == tag.id));

function tagClick() {
    if (tags.value.find(tag => props.tag.id == tag.id))
        tags.value = tags.value.filter(tag => props.tag.id != tag.id);
    else
        tags.value.push(props.tag);
}
</script>

<template>
    <UButton :label="tag.name"
             :color="hasTag ? 'primary' : 'gray'"
             @click="tagClick"/>
</template>

<style scoped>

</style>