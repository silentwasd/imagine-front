<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type Resource from "~/types/api/Resource";
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    item: any
}>();

const thumbnail = computed(() => {
    if (['upload-queue', 'uploading'].includes(props.item.state)) {
        return URL.createObjectURL(props.item.file);
    }

    if (['uploaded'].includes(props.item.state)) {
        return fileUrl(props.item.preview_path);
    }
});

const imageRepo               = new ImageRepository();
const {send, progress, abort} = imageRepo.upload();

watch(() => props.item.state, (state) => {
    if (state == 'uploading') {
        send(props.item.file)
            .then((e) => JSON.parse(e.response))
            .then((resource: Resource<ImageResource>) => {
                props.item.id           = resource.data.id;
                props.item.state        = 'uploaded';
                props.item.path         = resource.data.path;
                props.item.preview_path = resource.data.preview_path;
                props.item.created_at   = resource.data.created_at;
            })
            .catch(() => props.item.state = 'failed');
    }
}, {deep: true, immediate: true});

function doAbort() {
    abort();
    props.item.state = 'failed';
}
</script>

<template>
    <div class="relative scale-90 hover:scale-100 group">
        <img :src="thumbnail"
             class="w-full h-full object-cover pointer-events-none"
             loading="lazy"/>

        <template v-if="item.state == 'uploading'">
            <UProgress class="absolute bottom-0"
                       :ui="{progress: {rounded: 'rounded-none [&::-webkit-progress-bar]:rounded-none', bar: '[&::-webkit-progress-value]:rounded-none [&::-moz-progress-bar]:rounded-none'}}"
                       :value="progress"/>

            <div
                class="opacity-0 group-hover:opacity-100 flex items-center justify-center w-full h-full absolute top-0 transition-opacity">
                <UButton :ui="{rounded: 'rounded-full'}"
                         icon="i-heroicons-x-mark"
                         size="xl"
                         color="red"
                         variant="soft"
                         @click="doAbort"/>
            </div>
        </template>
    </div>
</template>

<style scoped>

</style>