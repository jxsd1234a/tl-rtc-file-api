import { ConfigEnum } from '@/config';
import { useFetch, useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import io from 'socket.io-client';

export const useFetchData = () => {
  const useTurn = useLocalStorage(ConfigEnum.useRelay, true);

  const { data } = useFetch(() => `/api/comm/initData?turn=${useTurn.value}`)
    .get()
    .json();

  return { data };
};

export const useInitData = () => {
  const { data } = useFetchData();
  const initData = ref({
    langMode: 'zh', // 默认中文
  });

  watch(
    () => data.value,
    (v) => {
      if (v) {
        const { wsHost, logo, version, rtcConfig, options } = v;
        initData.value = Object.assign({}, initData.value, {
          socket: wsHost ? io(wsHost) : null,
          logo,
          version,
          options,
          config: rtcConfig,
        });
      }
    }
  );

  return {
    initData,
  };
};
