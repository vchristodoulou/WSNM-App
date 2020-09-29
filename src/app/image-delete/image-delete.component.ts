import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { ImagesApiService } from '../_services/images-api.service';
import { NodetypesImages } from '../_models/nodetypesImages';


@Component({
  selector: 'app-image-delete',
  templateUrl: './image-delete.component.html',
  styleUrls: ['./image-delete.component.css']
})
export class ImageDeleteComponent implements OnInit {
  @Output() canceled = new EventEmitter<boolean>();
  imagesSub: Subscription;
  nodetypesImages: NodetypesImages[] = [];
  selectedImage = '';
  imageName = '';
  deleteStatus = '';

  constructor(private imagesApi: ImagesApiService) {}

  ngOnInit() {
    this.imagesSub = this.imagesApi.retrieve()
      .subscribe(res => {
        console.log(res);
        this.nodetypesImages = res.data;
      });
  }

  onDeleteImage() {
    this.imagesSub = this.imagesApi.delete(this.selectedImage)
      .subscribe(
        () => {
          this.filterNodetypesImages(this.selectedImage);
          this.imageName = this.selectedImage;
          this.selectedImage = '';
          this.deleteStatus = 'SUCCESS';
          setTimeout(() => {
            this.imageName = '';
            this.deleteStatus = '';
          }, 3000);
        },
        err => {
          console.log(err);
          this.imageName = this.selectedImage;
          this.selectedImage = '';
          this.deleteStatus = 'ERROR';
          setTimeout(() => {
            this.imageName = '';
            this.deleteStatus = '';
          }, 3000);
        });
  }

  filterNodetypesImages(imageName) {
    for (let i = 0; i < this.nodetypesImages.length; i++) {
      this.nodetypesImages[i].images = this.nodetypesImages[i].images.filter(image => image !== imageName);
    }
  }

  onCancel() {
    this.canceled.emit(true);
  }

}
