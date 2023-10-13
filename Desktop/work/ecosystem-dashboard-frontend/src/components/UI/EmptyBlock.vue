<template>
  <div class="empty-block">
    <svg
        data-src="/img/icons/empty-folder.svg"
        class="empty-block__icon"
    />

    <h2 class="empty-block__title">{{ $t('common.noData') }}</h2>
  </div>
</template>

<style lang="scss">
.empty-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 68px 15px;
  background: #fff;
  border-radius: 0 0 8px 8px;

  &__icon {
    width: 64px;
    height: 53px;
    margin-bottom: 20px;
  }

  &__title {
    color: $black-color;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>