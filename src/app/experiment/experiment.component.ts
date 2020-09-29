import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ImagesApiService } from '../_services/images-api.service';
import { UsersApiService } from '../_services/users-api.service';
import { NodetypesImages } from '../_models/nodetypesImages';


@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {
  slotId = '';
  imagesSub: Subscription;
  nodetypesImages: NodetypesImages[] = [];
  selectedImage = '';
  imageName = '';
  uploadView = false;
  imageSelectedView = true;
  deleteStatus = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersApi: UsersApiService,
              private imagesApi: ImagesApiService) {}

  ngOnInit() {
    this.slotId = (this.route.snapshot.paramMap.get('id'));

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
            this.change_view_to_image();
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
            this.change_view_to_image();
          }, 3000);
        });
  }

  filterNodetypesImages(imageName) {
    for (let i = 0; i < this.nodetypesImages.length; i++) {
      this.nodetypesImages[i].images = this.nodetypesImages[i].images.filter(image => image !== imageName);
    }
  }

  onFlash() {
    this.selectedImage = '';
    this.imageSelectedView = true;
  }

  onImageChange(imageName) {
    if (imageName !== '') {
      this.imageSelectedView = false;
      this.uploadView = false;
    } else {
      this.imageSelectedView = true;
    }
  }

  onUploaded(data) {
    for (const item of this.nodetypesImages) {
      if ( item.nodetype_id === data.nodetype ) {
        if (!item.images.includes(data.image)) {
          item.images.unshift(data.image);
        }
        return;
      }
    }
    this.nodetypesImages = [{nodetype_id: data.nodetype, images: [data.image]}, ...this.nodetypesImages];
  }

  change_view_to_image() {
    this.uploadView = false;
    this.imageSelectedView = true;
  }

  change_view_to_upload() {
    this.uploadView = true;
    this.imageSelectedView = false;
  }

}
