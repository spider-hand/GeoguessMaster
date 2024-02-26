<template>
  <div
    :class="[
      isGameReady
        ? $style['room-number-dialog--animated']
        : $style['room-number-dialog'],
    ]"
  >
    <div :class="$style['room-number-dialog__label']">
      Room Number
    </div>
    <div :class="$style['room-number-dialog__text']">
      {{ roomNumber }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  roomNumber: {
    type: String,
    required: true,
  },
  isGameReady: {
    type: Boolean,
    required: true,
  },
});
</script>

<style module lang="scss">
.room-number-dialog {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: var(--color-brand-gradient);
  border-radius: 12px;
  transition: transform 1s;

  &--animated {
    transform: translateY(-200px);
  }
}

.room-number-dialog__label {
  @include label;

  width: 100%;
  color: white;
}

.room-number-dialog__text {
  @include main-text;

  width: 100%;
  color: white;
}
</style>
