import {
  animate,
  useTransform,
  type MotionValue,
  useMotionValue,
} from 'framer-motion';
import { useEffect } from 'react';

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';
const activeShadow = '5px 5px 10px rgba(0,0,0,0.3)';

export function useShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  const shadowValue = useTransform(value, (latest) => (latest !== 0 ? 1 : 0));

  useEffect(() => {
    return shadowValue.on('change', (latest) => {
      void animate(boxShadow, latest === 1 ? activeShadow : inactiveShadow);
    });
  }, [shadowValue, boxShadow]);

  return boxShadow;
}
