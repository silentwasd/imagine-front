<script setup lang="ts">
const nextId    = ref<number>(0);
const newImages = ref<any[]>([]);

const items = computed<any[]>(() => [...newImages.value]);

const sortedItems = computed(() => items.value.sort((a, b) => a.state == 'uploading' && b.state != 'uploading' ? -1 : 1));
const openedItem  = ref<any | null>(null);

const inputRef = ref<HTMLInputElement>();

function input() {
    newImages.value.unshift(
        ...([...inputRef.value?.files ?? []]).map((file: File) => ({
            innerId: -(++nextId.value),
            state  : 'upload-queue',
            file
        }))
    );
}

watch(newImages, (_items) => {
    if (_items.find(item => item.state == 'failed'))
        newImages.value = _items.filter(item => item.state != 'failed');

    if (_items.find(item => item.state == 'uploading'))
        return;

    _items.filter(item => item.state == 'upload-queue')
        .slice(0, 5)
        .forEach(item => {
            item.state = 'uploading';
        });
}, {deep: true});
</script>

<template>
    <UContainer class="flex flex-col gap-5 py-10">
        <input ref="inputRef"
               type="file"
               class="hidden"
               multiple
               @input="input"/>

        <div class="flex justify-center">
            <UButton label="Загрузить картинки"
                     icon="i-heroicons-arrow-up-tray"
                     size="xl"
                     @click="inputRef?.click()"/>
        </div>

        <div class="flex flex-col relative select-none">
            <ImageRow v-for="n in Math.ceil(items.length / 5)"
                      :items="sortedItems.slice((n - 1) * 5, n * 5)"
                      v-model="openedItem"/>
        </div>
    </UContainer>
</template>

<style scoped>
</style>