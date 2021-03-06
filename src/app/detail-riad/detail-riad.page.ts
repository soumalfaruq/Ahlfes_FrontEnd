import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides,ActionSheetController, Platform, AlertController  } from '@ionic/angular';
import { DataServiceService } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';
import {GoogleMaps, GoogleMap,GoogleMapsMapTypeId, GoogleMapsEvent,GoogleMapOptions,CameraPosition,MarkerOptions,Marker, Environment} from '@ionic-native/google-maps';
@Component({
  selector: 'app-detail-riad',
  templateUrl: './detail-riad.page.html',
  styleUrls: ['./detail-riad.page.scss'],
})
export class DetailRiadPage implements OnInit {
  public url:string="/riads/";
  public picture;
  public riads;
  public riad;

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  sliderOne: any;
  map: GoogleMap;

  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };

  constructor(private service:DataServiceService,
    private route: ActivatedRoute, public alertController: AlertController,
    public actionCtrl: ActionSheetController,
    private platform: Platform) { 

      if (this.platform.is('cordova')) {
        this.loadMap();
      }
     //Item object for Nature
     this.sliderOne =
     {
       isBeginningSlide: true,
       isEndSlide: false,
       slidesItems: [
         {
           id: 995
         },
         {
           id: 925
         },
         {
           id: 940
         },
         {
           id: 943
         },
         {
           id: 944
         }
       ]
     };
  }
//Move to Next slide
slideNext(object, slideView) {
  slideView.slideNext(500).then(() => {
    this.checkIfNavDisabled(object, slideView);
  });
}
loadMap() {
	Environment.setEnv({
		API_KEY_FOR_BROWSER_RELEASE: 'AI*********************************DPM',
		API_KEY_FOR_BROWSER_DEBUG: 'AI*********************************DPM'
	});
	this.map = GoogleMaps.create('map_canvas', {
		camera: {
			target: {
				lat: 43.610769,
				lng: 3.876716
			},
			zoom: 12,
			tilt: 30
		}
	});
}
//Move to previous slide
slidePrev(object, slideView) {
  slideView.slidePrev(500).then(() => {
    this.checkIfNavDisabled(object, slideView);
  });;
}

//Method called when slide is changed by drag or navigation
SlideDidChange(object, slideView) {
  this.checkIfNavDisabled(object, slideView);
}

//Call methods to check if slide is first or last to enable disbale navigation  
checkIfNavDisabled(object, slideView) {
  this.checkisBeginning(object, slideView);
  this.checkisEnd(object, slideView);
}

checkisBeginning(object, slideView) {
  slideView.isBeginning().then((istrue) => {
    object.isBeginningSlide = istrue;
  });
}
checkisEnd(object, slideView) {
  slideView.isEnd().then((istrue) => {
    object.isEndSlide = istrue;
  });}
  ngOnInit() {
    const id= +this.route.snapshot.paramMap.get('id');
    this.service.getResource(this.url+id)
    .subscribe(data=>{
      this.riad=data;
      this.riads=[this.riad]
      console.log(this.riad)
    },err=>{
      console.log(err);
    });
    this.service.getResource(this.url+id+"/pictures")
    .subscribe(data=>{
      this.picture=data;
      this.picture=this.picture._embedded.picturesRiads;
      this.riads=[this.riad,[this.picture]]
    },err=>{
      console.log(err);
    });
    }
}
