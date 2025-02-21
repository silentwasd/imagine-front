<script setup lang="ts">
import type ImageResource from "~/resources/ImageResource";

defineProps<{
    images: ImageResource[],
    currentId: number
}>();
</script>

<template>
    <div class="flex justify-center p-2">
        <div class="grid grid-cols-4 gap-2">
            <ImageGridItem v-for="image in images"
                           :image="image"
                           :is-active="currentId == image.id"/>
        </div>
    </div>
</template>

<style scoped>

</style>