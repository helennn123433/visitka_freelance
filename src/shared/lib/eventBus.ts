import mitt from 'mitt';

type Events = {
  'section-loaded': void;
};

export const emitter = mitt<Events>();
