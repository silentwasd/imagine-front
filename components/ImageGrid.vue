<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type TagResource from "~/resources/TagResource";
import type PaginatedCollection from "~/types/api/PaginatedCollection";
import type ImageResource from "~/resources/ImageResource";

const tags = ref<TagResource[]>([]);

const imageRepo      = new ImageRepository();
const {data: images} = await imageRepo.lazyList<PaginatedCollection<ImageResource>>(() => ({
    tags: tags.value.map(tag => tag.id)
}));
</script>

<template>
    <div class="flex justify-center p-2">
        <div class="grid grid-cols-4 gap-2">
            <NuxtLink v-for="image in images?.data ?? []"
                      class="w-full"
                      :to="`/image?id=${image.id}`">
                <img :src="fileUrl(image.preview_path)"
                     loading="lazy"/>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>

</style>