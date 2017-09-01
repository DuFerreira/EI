import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

declare var google;
//Cria um array em branco para toda lista de marcadores
var markers = [];

var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  posts: any;
  private URL: string = "https://eduferr.pythonanywhere.com/shibe/default/api/materia.json";
  /*https://http://127.0.0.1:8000/shibe/default/index.json*/

  @ViewChild('map') mapElement: ElementRef;
  map: any;


  constructor(public navCtrl: NavController, public http: Http, public geolocation: Geolocation) {
    this
    .http
    .get(this.URL)
    .map(res => res.json().content)
    .subscribe(
      data => {
        this.posts = data;
        console.log("data:"+this.posts);
      },
      err => {
        console.log("erro:"+this.posts);
      }
    );
    console.log("saída:"+this.posts);



  }

  ionViewDidLoad(){
    this.loadMap();
  }




  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }



addMarker(){

  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter(),
    title: "Minha casa"
  });

  let content = "<h4>Information!</h4>";

  this.addInfoWindow(marker, content);

}

addInfoWindow(marker, content){

  let infoWindow = new google.maps.InfoWindow({
    content: content
  });

  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });

}


}
