// src/polyfills.ts
import { Buffer } from 'buffer';
import process from 'process';

// Установка глобальных полифиллов
if (typeof window !== 'undefined') {
  // Глобальные объекты
  (window as any).global = window.global || window;
  (window as any).process = process;
  (window as any).Buffer = Buffer;
  
  // Полифилл для require
  if (typeof (window as any).require === 'undefined') {
    (window as any).require = (module: string) => {
      switch(module) {
        case 'buffer': return Buffer;
        case 'process': return process;
        case 'crypto': return window.crypto || (window as any).msCrypto;
        case 'stream': return { 
          Stream: function() {},
          Readable: function() {},
          Writable: function() {},
          Duplex: function() {},
          Transform: function() {},
          PassThrough: function() {}
        };
        default: 
          console.warn(`Module ${module} not polyfilled`);
          return {};
      }
    };
  }
  
  // Полифилл для Node.js модулей в браузере
  (window as any).global.process = process;
  (window as any).global.Buffer = Buffer;
  
  // Полифилл для EventSource (используется TonConnect)
  if (typeof window.EventSource === 'undefined') {
    (window as any).EventSource = class EventSource {
      constructor(url: string) {
        console.log('EventSource polyfill for:', url);
      }
    };
  }
}

export default {};