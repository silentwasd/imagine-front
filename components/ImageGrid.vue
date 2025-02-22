<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

const props = defineProps<{
    images: ImageResource[],
    currentId?: number,
    tags: number[]
}>();
</script>

<template>
    <div class="relative flex justify-center items-start p-2 transition-opacity">
        <div class="grid gap-2 overflow-clip"
             :class="{'grid-cols-4': currentId, 'grid-cols-8': !currentId}">
            <ImageGridItem v-for="image in images"
                           :image="image"
                           :tags="tags"
                           :is-active="currentId == image.id"/>
        </div>
    </div>
</template>

<style scoped>

</style>