import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadcomponent } from './upload-image.component';

describe('UploadImageComponent', () => {
  let component: ImageUploadcomponent;
  let fixture: ComponentFixture<ImageUploadcomponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUploadcomponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
