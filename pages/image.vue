<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type PaginatedCollection from "~/types/api/PaginatedCollection";
import type ImageResource from "~/resources/ImageResource";

const route   = useRoute();
const imageId = computed<number | undefined>(() => route.query.id ? parseInt(route.query.id as string) : undefined);

const imageRepo = new ImageRepository();

const {data: images} = await imageRepo.list<PaginatedCollection<ImageResource>>('images');

function prevImage(count: number = 1) {
    if (!imageId.value)
        return;

    const index  = images.value?.data.findIndex(image => image.id == imageId.value) ?? 0;
    const prevId = images.value?.data[index - count]?.id ?? imageId.value;
    navigateTo(`/image?id=${prevId}`);
}

function nextImage(count: number = 1) {
    if (!imageId.value)
        return;

    const index  = images.value?.data.findIndex(image => image.id == imageId.value) ?? 0;
    const nextId = images.value?.data[index + count]?.id ?? imageId.value;
    navigateTo(`/image?id=${nextId}`);
}

defineShortcuts({
    arrowleft : {
        usingInput: true,
        handler   : () => prevImage()
    },
    arrowright: {
        usingInput: true,
        handler   : () => nextImage()
    },
    arrowup   : {
        usingInput: true,
        handler   : () => prevImage(4)
    },
    arrowdown : {
        usingInput: true,
        handler   : () => nextImage(4)
    }
});
</script>

<template>
    <div class="flex select-none">
        <ImagePanel v-if="imageId"
                    :image-id="imageId"
                    :images="images?.data ?? []"/>

        <ImageGrid class="grow w-0 h-dvh"
                   :current-id="imageId"
                   :images="images?.data ?? []"/>
    </div>
</template>

<style scoped>

</style>