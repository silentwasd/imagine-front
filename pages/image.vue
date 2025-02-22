<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type PaginatedCollection from "~/types/api/PaginatedCollection";
import type ImageResource from "~/resources/ImageResource";

const route   = useRoute();
const imageId = computed<number>(() => parseInt(route.query.id as string));

const imageRepo     = new ImageRepository();
const {data: image} = await imageRepo.show(`image.${imageId.value}`, imageId.value);

const images = ref<PaginatedCollection<ImageResource>>();

const previewSrc = ref<string>(fileUrl(image.value?.data.preview_path ?? ''));
const imageSrc   = ref<string>(fileUrl(image.value?.data.path ?? ''));
const loading    = ref<boolean>(true);
const imageKey   = ref<number>(1);

watch(imageId, async (id) => {
    loading.value = true;
    imageKey.value++;

    previewSrc.value = '';
    imageSrc.value   = '';

    image.value = (images.value?.data ?? []).filter(_image => _image.id == id).map(_image => ({data: _image}))[0] ?? await imageRepo.get(id);

    previewSrc.value = fileUrl(image.value?.data.preview_path ?? '');
    imageSrc.value   = fileUrl(image.value?.data.path ?? '');
});

function onLoad() {
    setTimeout(() => loading.value = false, 10);
}

function prevImage() {
    const index  = images.value?.data.findIndex(image => image.id == imageId.value) ?? 0;
    const prevId = images.value?.data[index - 1]?.id ?? imageId.value;
    navigateTo(`/image?id=${prevId}`);
}

function nextImage() {
    const index  = images.value?.data.findIndex(image => image.id == imageId.value) ?? 0;
    const nextId = images.value?.data[index + 1]?.id ?? imageId.value;
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
    }
});

onMounted(async () => {
    loading.value = false;

    images.value = await imageRepo.fetchList();
});
</script>

<template>
    <div class="flex">
        <div v-if="image"
             class="w-1/2 h-dvh shrink-0 bg-cover bg-center bg-no-repeat"
             :style="`background-image: url(${previewSrc});`">
            <div class="relative flex items-center justify-center w-full h-full overflow-clip">
                <img :key="`image-${imageKey}`"
                     :src="imageSrc"
                     @load="onLoad"
                     class="absolute max-h-dvh z-10 transition-all"
                     :class="{'opacity-0 scale-125': loading, 'opacity-100 scale-100': !loading}"/>

                <div class="absolute w-full h-full backdrop-blur"></div>

                <div class="absolute w-full h-full flex items-center justify-center transition-opacity z-10"
                     :class="{'opacity-0': !loading, 'opacity-100': loading}">
                    <UIcon class="animate-spin text-8xl text-gray-50/90"
                           name="i-heroicons-arrow-path-20-solid"/>
                </div>
            </div>
        </div>

        <ImageGrid class="grow w-0 h-dvh"
                   :current-id="imageId"
                   :images="images?.data ?? []"/>
    </div>
</template>

<style scoped>

</style>