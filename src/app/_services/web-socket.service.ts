import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { WS_URL } from '../env';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket;

  constructor() {}

  connect(): Subject<MessageEvent> {
    this.socket = io(WS_URL);

    const observable = new Observable(obs => {
      this.socket.on('on_debug', (data) => {
        console.log('Received message from Websocket Server');
        obs.next(data);
      });
      return () => {
        console.log('DISCONNECT FROM WS');
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data) => {
        this.socket.emit('on_debug', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable);
  }

}
