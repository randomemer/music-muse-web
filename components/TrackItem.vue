<template>
  <div class="track-item">
    <div class="track-image">
      <img :src="trackImage" :alt="`${track.album.name} album cover`" />
    </div>
    <div class="track-details">
      <span class="text-body-1">{{ track.name }}</span>
      <ul class="track-artists text-body-2">
        <li :key="artist.id" v-for="artist in track.artists">
          <NuxtLink :href="artist.external_urls.spotify" target="_blank">
            {{ artist.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TrackItemProps {
  track: SpotifyApi.TrackObjectFull;
}

const props = defineProps<TrackItemProps>();

const trackImage = computed(() => props.track.album.images.at(-1)?.url);
</script>

<style scoped lang="scss">
.track-item {
  display: flex;
  gap: 1rem;
}

.track-image {
  border-radius: 999px;
  overflow: clip;

  img {
    $size: 3rem;
    width: $size;
    height: $size;
    object-fit: cover;
  }
}

.track-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  line-height: 1.5;
}

.track-artists {
  display: flex;
  list-style: none;
  color: var(--text-secondary);

  li + li::before {
    content: ", ";
  }
}
</style>
