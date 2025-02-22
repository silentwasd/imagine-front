<script setup lang="ts">
import ImageRepository from "~/repositories/ImageRepository";
import type PaginatedCollection from "~/types/api/PaginatedCollection";
import type ImageResource from "~/resources/ImageResource";

const route   = useRoute();
const imageId = computed<number | undefined>(() => route.query.id ? parseInt(route.query.id as string) : undefined);
const tags    = computed<number[]>(() => route.query.tags ? (route.query.tags as string).split(',').map(tag => parseInt(tag)) : []);

const firstImageId = imageId.value ? parseInt(imageId.value.toString()) : undefined;

const imageRepo = new ImageRepository();

const seed = useCookie<string | undefined>('seed');

const pages          = ref<number[]>([1]);
const lastLoadedPage = computed<number>(() => pages.value.toSorted((a, b) => b - a)[0]);

const loadingNextPage = ref<boolean>(false);

async function loadNextPage() {
    loadingNextPage.value = true;

    try {
        const collection = await imageRepo.fetchList({
            tags: tags.value,
            seed: seed.value,
            page: lastLoadedPage.value + 1
        });

        images.value?.data.push(...collection.data);
        pages.value.push(lastLoadedPage.value + 1);
    } finally {
        loadingNextPage.value = false;
    }
}

const {data: images} = await imageRepo.lazyList<PaginatedCollection<ImageResource>>(() => ({
    tags: tags.value,
    ...seed.value ? {seed: seed.value} : {},
    ...firstImageId ? {image_id: firstImageId} : {}
}));

const tagObjects = computed(() => {
    const flat = images.value?.data.map(image => image.tags).flat() ?? [];
    return tags.value.map(id => flat.find(tag => tag.id == id));
});

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

onMounted(() => {
    seed.value = images.value?.seed.toString();
});
</script>

<template>
    <div class="flex select-none">
        <ImagePanel v-if="imageId"
                    :image-id="imageId"
                    :images="images?.data ?? []"
                    :tags="tags"/>

        <div class="flex flex-col grow w-0 h-dvh">
            <div v-if="tags.length > 0"
                 class="flex flex-wrap gap-2.5 shrink-0 p-2.5 border-b dark:border-gray-700">
                <NuxtLink v-for="tag in tagObjects"
                          class="leading-5"
                          :class="{'text-primary-400': tags.find(id => id == tag.id)}"
                          :to="imageId ? `/image?id=${imageId}&tags=${tags.filter(id => id != tag.id).join(',')}` : `/image?tags=${tags.filter(id => id != tag.id).join(',')}`">
                    #{{ tag.name }}
                </NuxtLink>
            </div>

            <div class="grow overflow-auto h-0">
                <ImageGrid :current-id="imageId"
                           :images="images?.data ?? []"
                           :tags="tags"/>

                <div v-if="lastLoadedPage < (images?.meta.last_page ?? 1)"
                     class="shrink-0 px-2 pb-2.5">
                    <UButton label="Загрузить еще"
                             size="xl"
                             icon="i-heroicons-arrow-down-solid"
                             class="w-full justify-center"
                             :ui="{rounded: 'rounded-none'}"
                             :loading="loadingNextPage"
                             @click="loadNextPage"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>