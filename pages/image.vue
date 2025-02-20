<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";

const route   = useRoute();
const imageId = computed<number>(() => parseInt(route.query.id as string));

const imageRepo     = new ImageRepository();
const {data: image} = await imageRepo.show(`image.${imageId.value}`, imageId.value);

const previewSrc = ref<string>(fileUrl(image.value?.data.preview_path ?? ''));
const imageSrc   = ref<string>(fileUrl(image.value?.data.path ?? ''));
const loading    = ref<boolean>(true);

watch(imageId, async (id) => {
    loading.value = true;

    previewSrc.value = '';
    imageSrc.value   = '';

    image.value = await imageRepo.get(id);

    previewSrc.value = fileUrl(image.value?.data.preview_path ?? '');
    imageSrc.value   = fileUrl(image.value?.data.path ?? '');
});

onMounted(() => {
    loading.value = false;
});
</script>

<template>
    <div class="flex">
        <div v-if="image"
             class="w-1/2 h-dvh shrink-0 bg-cover bg-center bg-no-repeat"
             :style="`background-image: url(${previewSrc});`">
            <div class="relative flex items-center justify-center w-full h-full backdrop-blur">
                <img :src="imageSrc"
                     @load="loading = false"
                     class="max-h-dvh"/>

                <div class="absolute w-full h-full flex items-center justify-center transition-opacity"
                     :class="{'opacity-0': !loading, 'opacity-100': loading}">
                    <UIcon class="animate-spin text-8xl text-gray-50/90"
                           name="i-heroicons-arrow-path-20-solid"/>
                </div>
            </div>
        </div>

        <ClientOnly>
            <ImageGrid class="grow w-0 overflow-auto h-dvh"/>
        </ClientOnly>
    </div>
</template>

<style scoped>

</style>