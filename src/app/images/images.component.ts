import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  defaultView = true;
  uploadView = false;
  deleteView = false;

  constructor() {}

  ngOnInit() {}

  change_view_to_upload() {
   this.defaultView = false;
   this.uploadView = true;
  }

  change_view_to_delete() {
    this.defaultView = false;
    this.deleteView = true;
  }

  onUploadCanceled() {
    this.uploadView = false;
    this.defaultView = true;
  }

  onDeleteCanceled() {
    this.deleteView = false;
    this.defaultView = true;
  }

}
