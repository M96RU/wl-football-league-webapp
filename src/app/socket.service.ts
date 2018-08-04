import {Injectable} from '@angular/core';
import * as wsc from 'webstomp-client';
import {Client} from 'webstomp-client';
import {Subject} from 'rxjs';
import {deserialize} from 'class-transformer';
import {Game} from './model/game';
import {UserSeason} from './model/user-season';

@Injectable()
export class SocketService {

  public gameUpdated: Subject<Game> = new Subject<Game>();
  public userSeasonUpdated: Subject<UserSeason> = new Subject<UserSeason>();

  private client: Client;
  private wsUri: string;
  private heartbeatTimer;

  constructor() {
    const loc = window.location;
    const scheme = loc.protocol === 'https:' ? 'wss' : 'ws';
    this.wsUri = `${scheme}://${loc.host}/api/ws`;

    this.connect();
  }

  connect() {
    const ws = new WebSocket(this.wsUri);
    this.client = wsc.over(ws);
    this.client.connect('', '', (frame) => {
      this.client.subscribe('/topic/game', message => this.gameUpdated.next(deserialize(Game, message.body)));
      this.client.subscribe('/topic/userSeason', message => this.userSeasonUpdated.next(deserialize(UserSeason, message.body)));
      this.heartbeatTimer = setInterval(() => {
        this.client.send('/topic/heartbeat', 'ping');
      }, 50000);
    }, () => {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
      setTimeout(() => {
        console.log('Attempt websocket automatic reconnect');
        this.connect();
      }, 2000);
    });
  }

}
