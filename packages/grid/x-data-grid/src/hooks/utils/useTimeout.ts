import * as React from 'react';
import { useLazyRef } from './useLazyRef';

class Timeout {
  static create() {
    return new Timeout();
  }

  currentId: number = 0;

  start(delay: number, fn: Function) {
    this.clear();
    this.currentId = setTimeout(fn, delay);
  }

  clear = () => {
    if (this.currentId !== 0) {
      clearTimeout(this.currentId);
      this.currentId = 0;
    }
  };

  disposeEffect = () => {
    return this.clear;
  };
}

const EMPTY = [] as any[];

export function useTimeout() {
  const timeout = useLazyRef(Timeout.create).current;

  React.useEffect(timeout.disposeEffect, EMPTY);

  return timeout;
}
