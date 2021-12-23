import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import {
  UserPhoto,
  PhotoService,
} from 'src/app/core/services/services/photo.service';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-pollo-precoccion-cocina',
  templateUrl: './pollo-precoccion-cocina.component.html',
  styleUrls: ['./pollo-precoccion-cocina.component.scss'],
})
export class PolloPrecoccionCocinaComponent implements OnInit {
  public today = new Date();
  public user: any;
  public data: PrecookedChickenModel = new PrecookedChickenModel();
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public idBranch: string;
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosProducto: any;
  public url = 'http://34.237.214.147/back/api_rebel_wings/';
  public activeData = false;
  public toggleChicken;
  constructor(public router: Router,
    private camera: Camera,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idBranch = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
  }
  ngOnInit() { }
  // get data refrigerador
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('PrecookedChicken/' + this.idBranch)
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.result?.length !== 0 && resp.result !== null) {
            this.dataId = true; //si hay registro entonces se hara un put
            this.activeData = true;
            this.data = resp.result;
            console.log('get data', this.data);
            // cambiar el toggle por el valor correcto
            if (this.data.precookedChickenOnTheTable === true){
              this.toggleChicken = true;
            }
            else{
              this.toggleChicken = false;
            }
          }
          else {
            console.log('completar tarea');
            this.data.id = 0;
            this.toggleChicken = false;
            this.activeData = true;
            this.dataId = false; //no hay registro entonces se hara un post
          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('regional/centro-control');
  }
  // ---------add product complete----------

  async addPhotoToGallery(idType: number) {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.data.photoPrecookedChickens.push({
      id: 0,
      precookedChickenId: 0,
      type: idType,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
      filepath: ''
    });
    console.log('fotos chicken', this.data);

  }

  public async showActionSheet(photo, position: number) {
    console.log('photo', photo);
    console.log('posicion', position);

    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
            //
            this.data.photoPrecookedChickens.splice(position, 1);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
  //eliminar imagenes bd
  public async deleteImgShowAction(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.service
              .serviceGeneralDelete(`PrecookedChicken/${id}/Photo`)
              .subscribe((data) => {
                if (data.success) {
                  this.load.presentLoading('Eliminando..');
                  console.log('data', data);
                  this.ionViewWillEnter();
                }
              });
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
  save() {
    this.disabled = true;
    this.fotosProducto = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    // si no hay registro en el get sera un post
    if (this.dataId === false) {
      this.addPolloPrecoccion();
    } else {
      this.updatePolloPrecoccion();
    }
  }
  addPolloPrecoccion() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    // validar togles
    if (this.toggleChicken === true) {
      this.data.precookedChickenOnTheTable = true;
      this.data.precookedChickenInGeneral = true;
      this.data.bonelesOrPrecookedPotatoes = true;
      // se manda cadena ya que el servicio marca error
      this.data.commentPrecookedChickenOnTheTable = '';
      this.data.commentPrecookedChickenInGeneral = '';
      this.data.commentBonelesOrPrecookedPotatoes = '';
    }
    else{
      this.data.precookedChickenOnTheTable = false;
      this.data.precookedChickenInGeneral = false;
      this.data.bonelesOrPrecookedPotatoes = false;
    }
    console.log('Obj To send  post=> ', this.data);
    this.service
      .serviceGeneralPostWithUrl('PrecookedChicken', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('regional/centro-control');
        }
      });
  }
  updatePolloPrecoccion() {
    // validar togles
    if (this.toggleChicken === true) {
      this.data.precookedChickenOnTheTable = true;
      this.data.precookedChickenInGeneral = true;
      this.data.bonelesOrPrecookedPotatoes = true;
      // se manda cadena ya que el servicio marca error
      this.data.commentPrecookedChickenOnTheTable = '';
      this.data.commentPrecookedChickenInGeneral = '';
      this.data.commentBonelesOrPrecookedPotatoes = '';
    }
    else {
      this.data.precookedChickenOnTheTable = false;
      this.data.precookedChickenInGeneral = false;
      this.data.bonelesOrPrecookedPotatoes = false;
    }
    // al realizar el get el path viene null, al hacer el put marca error si no se manda una cadena de texto

    if (this.data.photoPrecookedChickens.length !== 0) {
      this.data.photoPrecookedChickens.forEach((photo) => {
        if (photo.id !== 0) {
          photo.photoPath = '';
        }
      });
    }


    console.log('Obj To send put => ', this.data);
    this.service
      .serviceGeneralPut('PrecookedChicken', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('regional/centro-control');
        }
      });
  }
}
class PrecookedChickenModel {
  id: number;
  branchId: number;
  precookedChickenOnTheTable: boolean;
  amountPrecookedChickenOnTheTable: number;
  amountPrecookedChickenInGeneral: number;
  precookedChickenInGeneral: boolean;
  amountBonelesOrPrecookedPotatoes: number;
  bonelesOrPrecookedPotatoes: boolean;
  commentPrecookedChickenOnTheTable: string;
  commentPrecookedChickenInGeneral: string;
  commentBonelesOrPrecookedPotatoes: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoPrecookedChickens: PhotoPrecookedChickensModel[] = [];
}
class PhotoPrecookedChickensModel {
  id: number;
  precookedChickenId: number;
  type: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem

}
