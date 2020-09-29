import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DebugApiService } from '../_services/debug-api.service';


@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('dataChannel', { static: false }) channel: ElementRef;
  @Input() slotId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public debugFlag = false;
  debugLog = '';
  public channelData = '';
  debugSub: Subscription;
  debugDataSub: Subscription;
  downloadRes = '';
  clearRes = '';

  constructor(private router: Router,
              private debugApi: DebugApiService) {}

  ngOnInit() {}

  onDebugStart() {
    const slotId = {slot_id: this.slotId};
    this.debugSub = this.debugApi.startDebugChannel(slotId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          console.log(data);
          this.debugFlag = true;
          this.debugDataSub = this.debugApi.dataSub
            .subscribe(
              res => {
                console.log(res);
                if (!('message' in res)) {
                  if (this.channelData === '') {
                    this.channelData += res.data.join('|');
                  } else {
                    this.channelData += '\n' + res.data.join(' | ');
                  }
                } else {
                  if (res.message === 'STOP DEBUG') {
                    this.channelData += '\n' + res.data.join(' | ');
                  } else if (res.message === 'INVALID SLOT') {
                    this.router.navigate(['/slots']);
                  } else if (res.message === 'INVALID TOKEN') {
                    this.router.navigate(['/login']);
                  }
                }},
              err => {
                console.log(err);
              });
          console.log(this.debugSub);
        });
  }

  onDebugEnd() {
    const slotId = {slot_id: this.slotId};
    this.debugSub = this.debugApi.endDebugChannel(slotId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.debugDataSub.unsubscribe();
          console.log(this.debugSub);
          this.debugFlag = false;
        },
        err => {
          console.log(err);
          if (err === 'INVALID SLOT') {
            this.router.navigate(['/slots']);
          }
        });
  }

  onDownloadLog() {
    const slotId = {slot_id: this.slotId};
    this.debugSub = this.debugApi.downloadLog(slotId)
      .subscribe(
        data => {
          this.downloadFile(data);
        },
        err => {
          console.log(err);
          if (err === 'INVALID SLOT') {
            this.router.navigate(['/slots']);
          }
          this.downloadRes = 'ERROR';
          setTimeout(() => {
            this.downloadRes = '';
          }, 3000);
        });
  }

  downloadFile(data) {
    console.log(data);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = this.slotId + '.log';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onClearLog() {
    const slotId = {slot_id: this.slotId};
    this.debugSub = this.debugApi.clearLog(slotId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.clearRes = 'SUCCESS';
          setTimeout(() => {
            this.clearRes = '';
          }, 3000);
        },
        err => {
          console.log(err);
          if (err === 'INVALID SLOT') {
            this.router.navigate(['/slots']);
          }
          this.clearRes = 'ERROR';
          setTimeout(() => {
            this.clearRes = '';
          }, 3000);
        });
  }

  onClearView() {
    this.channelData = '';
  }

  ngAfterViewChecked() {
    this.autoScroll();
  }

  autoScroll() {
    this.channel.nativeElement.scrollTop = this.channel.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
