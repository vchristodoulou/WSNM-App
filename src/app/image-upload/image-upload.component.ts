import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';

import { Subscription } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';

import { UsersApiService } from '../_services/users-api.service';
import { NodetypesApiService } from '../_services/nodetypes-api.service';
import { UserAuth } from '../_models/userAuth';
import { NodeType } from '../_models/nodeType';
import { API_URL } from '../env';


@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  @Output() canceled = new EventEmitter<boolean>();
  @Output() uploaded = new EventEmitter<{image: string, nodetype: string}>();
  @ViewChild('fileInput', {static: false}) fileInput: any;
  currentUser: UserAuth;
  nodetypesSub: Subscription;
  nodetypes: NodeType[];
  selectedNodetype = '';
  uploader: FileUploader;
  uploadURL = API_URL + '/images/';
  imageName = '';
  uploadStatus = '';

  constructor(private usersApi: UsersApiService,
              private nodetypesApi: NodetypesApiService) {}

  ngOnInit() {
    this.currentUser = this.usersApi.currentUserValue;
    this.nodetypesSub = this.nodetypesApi.retrieve()
      .subscribe(
        res => {
          console.log(res);
          this.nodetypes = res.nodetypes;
        },
        err => {
          console.log(err);
        });

    if (this.currentUser && this.currentUser.token) {
      this.uploader = new FileUploader({url: this.uploadURL, itemAlias: 'binary', authToken: `Bearer ${this.currentUser.token}`});
    } else {
      this.uploader = new FileUploader({url: this.uploadURL, itemAlias: 'binary'});
    }

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = this.uploadURL + item.file.name;
      this.uploader.options.additionalParameter = {
        nodetype_id: this.selectedNodetype,
      };
    };
    this.uploader.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessImageUpload(item, response, status, headers);
    this.uploader.onErrorItem = (item, response, status, headers) =>
      this.onErrorImageUpload(item, response, status, headers);
  }

  onUpload() {
    this.uploader.uploadAll();
    this.fileInput.nativeElement.value = '';
  }

  onCancel() {
    this.canceled.emit(true);
  }

  onSuccessImageUpload(item, response, status, headers) {
    console.log(item, response, status, headers);
    this.uploaded.emit({ image: item.file.name, nodetype: this.selectedNodetype });
    this.selectedNodetype = '';
    this.imageName = item.file.name;
    this.uploadStatus = 'SUCCESS';
    setTimeout(() => {
      this.imageName = '';
      this.uploadStatus = '';
    }, 4000);
  }

  onErrorImageUpload(item, response, status, headers) {
    console.log(item, response, status, headers);
    this.selectedNodetype = '';
    this.imageName = item.file.name;
    this.uploadStatus = 'ERROR';
    setTimeout(() => {
      this.imageName = '';
      this.uploadStatus = '';
    }, 3000);
  }

}
