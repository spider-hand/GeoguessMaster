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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 5;
  transition: transform 1s;
  box-sizing: border-box;
  position: absolute;
  padding: 12px 24px;
  top: 12px;
  right: 12px;
  border-radius: 12px;
  background: var(--color-brand-gradient);

  &--animated {
    @extend .room-number-dialog;
    transform: translateY(-200px);
  }
}

.room-number-dialog__label {
  @include label;
  width: 100%;
  color: white;
}

.room-number-dialog__text {
  @include mainText;
  width: 100%;
  color: white;
}
</style>
