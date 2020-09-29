import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, interval, timer } from 'rxjs';
import { startWith, switchMap, takeUntil, takeWhile, finalize } from 'rxjs/operators';

import { NodesApiService } from '../_services/nodes-api.service';
import { NodetypesApiService } from '../_services/nodetypes-api.service';
import { StatusApiService } from '../_services/status-api.service';
import { Node } from '../_models/node';
import { NodeType } from '../_models/nodeType';


@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  @Input() slotId: string;
  @Input() flashImage: string;
  @Output() flashed = new EventEmitter<void>();
  nodesSub: Subscription;
  nodes: Node[] = [];
  nodetypesSub: Subscription;
  nodetypes: NodeType[];
  checkedNodesForm: Array<any> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private nodesApi: NodesApiService,
              private nodetypesApi: NodetypesApiService,
              private statusApi: StatusApiService) {}

  ngOnInit() {
    this.slotId = (this.route.snapshot.paramMap.get('id'));

    this.nodesSub = this.nodesApi.retrieve()
      .subscribe(res => {
        console.log(res);
        this.nodes = res.nodes.map(node => ({...node, status: '', checked: false, spinner: false}));
        console.log(this.nodes);
      });

    this.nodetypesSub = this.nodetypesApi.retrieve()
      .subscribe(
        res => {
          console.log(res);
          this.nodetypes = res.nodetypes;
        },
        err => {
          console.log(err);
        });
  }

  onChange(node) {
    const temp: any = {};
    if (node.checked === false) {
      node.checked = true;
      temp.node_uid = node._id;
      this.checkedNodesForm.push(temp);
    } else {
      const pos = this.checkedNodesForm.map(obj => obj.node_uid ).indexOf(node._id);
      this.checkedNodesForm.splice(pos, 1);
    }
  }

  enableSpinning(nodeUids) {
    console.log(nodeUids);
    for (const nodeUid of nodeUids) {
      for (const node of this.nodes) {
        if (nodeUid === node._id) {
          node.spinner = true;
        }
      }
    }
  }

  disableSpinningAndUncheck(nodeUids) {
    console.log(nodeUids);
    for (const nodeUid of nodeUids) {
      for (const node of this.nodes) {
        if (nodeUid === node._id) {
          node.spinner = false;
          node.checked = false;
        }
      }
    }
  }

  onFlash() {
    const nodesReq: any = {};
    nodesReq.node_uids = this.checkedNodesForm.map(node => node.node_uid);
    nodesReq.image_name = this.flashImage;
    nodesReq.slot_id = this.slotId;

    this.enableSpinning(nodesReq.node_uids);
    this.checkedNodesForm = [];

    this.nodesSub = this.nodesApi.flash(nodesReq)
      .subscribe(resFlash => {
        console.log(resFlash);
        // console.log(resFlash.task_id);
        interval(500)
          .pipe(
            startWith(0),
            switchMap(() => this.statusApi.task_status('flash', resFlash.task_id)),
            takeWhile((x) => x.state === 'PROGRESS' , true),
            takeUntil(timer(200000)),
            finalize(() => this.disableSpinningAndUncheck(nodesReq.node_uids))
          )
          .subscribe(res => {
              console.log(res);
              if (res.state === 'SUCCESS') {
                const result = res.result;
                if (!('message' in result)) {
                  for (const nodeRes of res.result) {
                    for (const node of this.nodes) {
                      if (nodeRes._id === node._id) {
                        if (nodeRes.status === 'FLASHED') {
                          node.flashed = 'FINISHED';
                          node.image_name = nodesReq.image_name;
                          node.status = 'SUCCESS';
                          setTimeout(() => {
                            node.status = '';
                          }, 3000);
                        } else if (nodeRes.status === 'ERROR') {
                          const nodePrevFlashed = node.flashed;
                          const nodePrevImageName = node.image_name;
                          node.flashed = 'ERROR';
                          node.image_name = '';
                          node.status = 'ERROR';
                          setTimeout(() => {
                            node.flashed = nodePrevFlashed;
                            node.image_name = nodePrevImageName;
                            node.status = '';
                          }, 3000);
                        }
                      }
                    }
                  }
                  this.flashed.emit();
                } else {
                  console.log(result);
                  if (result.message === 'INVALID SLOT') {
                    this.router.navigate(['/slots']);
                  } else if (result.message === 'INVALID TOKEN') {
                    this.router.navigate(['/login']);
                  }
                }
                console.log(this.nodes);
                console.log(this.checkedNodesForm.length);
              }
            }, err => {
              console.log(err);
            }
          );
      });
  }

  onErase() {
    const nodesReq: any = {};
    nodesReq.node_uids = this.checkedNodesForm.map(node => node.node_uid);
    nodesReq.slot_id = this.slotId;

    this.enableSpinning(nodesReq.node_uids);
    this.checkedNodesForm = [];

    this.nodesSub = this.nodesApi.erase(nodesReq)
      .subscribe(resErase => {
        console.log(resErase);
        console.log(resErase.task_id);
        interval(500)
          .pipe(
            startWith(0),
            switchMap(() => this.statusApi.task_status('erase', resErase.task_id)),
            takeWhile((x) => x.state === 'PROGRESS' , true),
            takeUntil(timer(200000)),
            finalize(() => this.disableSpinningAndUncheck(nodesReq.node_uids))
          )
          .subscribe(res => {
              console.log(res);
              if (res.state === 'SUCCESS') {
                const result = res.result;
                if (!('message' in result)) {
                  for (const nodeRes of res.result) {
                    for (const node of this.nodes) {
                      if (nodeRes._id === node._id) {
                        if (nodeRes.status === 'ERASED') {
                          node.flashed = 'NOT_STARTED';
                          node.image_name = '';
                          node.status = 'SUCCESS';
                          setTimeout(() => {
                            node.status = '';
                          }, 3000);
                          break;
                        }
                      }
                    }
                  }
                } else {
                  console.log(result);
                  if (result.message === 'INVALID SLOT') {
                    this.router.navigate(['/slots']);
                  } else if (result.message === 'INVALID TOKEN') {
                    this.router.navigate(['/login']);
                  }
                }
              }
            }, err => {
              console.log(err);
            }
          );
      });
  }

  onReset() {
    const nodesReq: any = {};
    nodesReq.node_uids = this.checkedNodesForm.map(node => node.node_uid);
    nodesReq.slot_id = this.slotId;

    this.enableSpinning(nodesReq.node_uids);
    this.checkedNodesForm = [];

    this.nodesSub = this.nodesApi.reset(nodesReq)
      .pipe(
        finalize(() => this.disableSpinningAndUncheck(nodesReq.node_uids))
      )
      .subscribe(res => {
        console.log(res);
        const result = res.data;
        if (!('message' in result)) {
          for (const nodeRes of res.data) {
            for (const node of this.nodes) {
              if (nodeRes._id === node._id) {
                if (nodeRes.status === 'ERASED') {
                  node.flashed = 'NOT_STARTED';
                } else {
                  node.flashed = 'FLASHED';
                }
                node.status = 'SUCCESS';
                setTimeout(() => {
                  node.status = '';
                }, 3000);
                break;
              }
            }
          }
        } else {
          console.log(result);
          if (result.message === 'INVALID SLOT') {
            this.router.navigate(['/slots']);
          } else if (result.message === 'INVALID TOKEN') {
            this.router.navigate(['/login']);
          }
        }
        }, err => {
          console.log(err);
        }
      );
  }

  getColor(flashed) {
    if (flashed === 'NOT_STARTED') {
      return 'black';
    } else if (flashed === 'FINISHED') {
      return 'green';
    } else if (flashed === 'ERROR') {
      return 'red';
    } else {
      return 'green';
    }
  }

  isEmptyObject(obj) {
    return obj.length === 0;
  }

}
